import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define la carpeta donde se guardarán las imágenes
const uploadFolder = 'uploads/';

// Asegúrate de que la carpeta existe; si no, créala
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten imágenes'), false);
  }
  cb(null, true);
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});

// Configuración de Multer con límite de tamaño de 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export { upload };
