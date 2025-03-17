import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { registerValidationSchema, loginValidationSchema } from '../validations/authValidation.js';

export const register = async (req, res) => {
  try {
    // Validar los datos de registro
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { name, email, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

export const login = async (req, res) => {
  try {
    // Validar los datos de inicio de sesión
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { email, password } = req.body;

    // Buscar usuario por email
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparar la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar token JWT
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, se devuelve el mismo mensaje
      return res.status(200).json({ message: 'Si el email existe, se enviarán instrucciones para recuperar la contraseña.' });
    }

    // Generar un token aleatorio y configurar su expiración (1 hora)
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    // Configurar el transportador de nodemailer
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false
      }
    });

    // Define la URL de tu front‑end para la recuperación de contraseña.
    // Por ejemplo, si tu aplicación React corre en http://localhost:3000:
    const frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Configurar el email de recuperación usando backticks para el string multilinea
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Recupera tu contraseña',
      text: `Has solicitado recuperar tu contraseña.
Por favor, haz clic en el siguiente enlace (o pégalo en tu navegador) para restablecer tu contraseña:
${frontEndUrl}/reset-password?token=${token}\n\n
Si no solicitaste este cambio, ignora este email.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Si el email existe, se enviarán instrucciones para recuperar la contraseña.' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud de recuperación de contraseña' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Buscar el usuario cuyo token coincida y que aún no haya expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
    }

    // Hashear la nueva contraseña y actualizarla
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    // Limpiar los campos de recuperación
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'La contraseña ha sido restablecida exitosamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};
