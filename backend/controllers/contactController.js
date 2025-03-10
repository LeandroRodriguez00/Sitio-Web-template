// contactController.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Configuración del transportador utilizando las variables de entorno.
  // En producción, se valida el certificado; en desarrollo se deshabilita la validación.
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ejemplo: 'smtp.gmail.com'
    port: Number(process.env.EMAIL_PORT), // Ejemplo: 465 (SSL) o 587 (TLS)
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      // Si NODE_ENV es 'production', se rechaza un certificado no autorizado (valor true)
      // En desarrollo se establece en false para permitir certificados autofirmados
      rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false
    }
  });

  // Configuración de las opciones del correo
  const mailOptions = {
    from: email, // También puedes usar una dirección fija si lo prefieres
    to: process.env.CONTACT_EMAIL, // Destinatario predefinido
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `Tienes un nuevo mensaje de contacto:
    
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}

Mensaje:
${message}`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.json({ message: 'Email enviado correctamente', info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar email' });
  }
};
