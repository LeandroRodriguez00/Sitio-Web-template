import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  // Campos para recuperación de contraseña
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  }
}, {
  timestamps: true  // Añade createdAt y updatedAt automáticamente
});

const User = mongoose.model('User', userSchema);
export default User;
