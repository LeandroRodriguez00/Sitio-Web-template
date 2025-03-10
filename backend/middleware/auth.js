// auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Extraer el encabezado de autorización de la solicitud.
    // Se espera que el token se envíe en el encabezado "Authorization" en el formato: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Acceso no autorizado: No se proporcionó token' });
    }

    // 2. Separar la palabra "Bearer" del token.
    const token = authHeader.split(' ')[1]; // Separa en un arreglo ["Bearer", "<token>"]
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado: Formato de token incorrecto' });
    }

    // 3. Verificar el token usando la clave secreta almacenada en las variables de entorno.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Si ocurre un error (token inválido, expirado, etc.), se retorna un error de autenticación.
        return res.status(401).json({ message: 'Acceso no autorizado: Token inválido' });
      }
      // 4. Si el token es válido, se puede adjuntar la información decodificada (por ejemplo, el id del usuario y el rol)
      req.user = decoded;
      // 5. Llamamos a next() para continuar con la siguiente función del middleware o la ruta protegida.
      next();
    });
  } catch (error) {
    // Si ocurre algún error inesperado, se devuelve un error del servidor.
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};
