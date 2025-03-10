// errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Imprime el error en la consola para debug.
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error interno del servidor'
    });
  };
  