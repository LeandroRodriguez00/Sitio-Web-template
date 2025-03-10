// adminMiddleware.js
export const adminMiddleware = (req, res, next) => {
    // Se asume que el middleware de autenticación ya ha sido ejecutado y que
    // la información del usuario está disponible en req.user
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Acceso denegado: Se requieren privilegios de administrador.' });
  };
  