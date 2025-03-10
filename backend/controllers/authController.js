import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
