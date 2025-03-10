import Product from '../models/Product.js';
import { productValidationSchema } from '../validations/productValidation.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    let productData = { ...req.body };

    // Si se sube un archivo, guardamos solo el nombre del archivo
    if (req.file) {
      productData.images = [req.file.filename];
    } else if (typeof productData.images === 'string') {
      productData.images = [productData.images];
    }

    // Validar datos con Joi
    const { error } = productValidationSchema.validate(productData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let productData = { ...req.body };

    // Buscar el producto existente
    const existingProduct = await Product.findById(id);
    if (!existingProduct)
      return res.status(404).json({ message: 'Producto no encontrado' });

    if (req.file) {
      // Si se sube una nueva imagen, usarla (guardamos solo el nombre del archivo)
      productData.images = [req.file.filename];
    } else if (req.body.images !== undefined) {
      // Si se envía el campo "images" en el body (por ejemplo, cadena vacía al eliminar la imagen)
      if (typeof req.body.images === 'string' && req.body.images.trim() === '') {
        // Si se eliminó la imagen: enviamos un arreglo vacío
        productData.images = [];
      } else {
        // Si viene algún valor (por ejemplo, el nombre original), lo convertimos a arreglo
        productData.images = [req.body.images];
      }
    } else {
      // Si no se envía nada en "images", conservamos la imagen existente
      productData.images = existingProduct.images;
    }

    // Validar datos con Joi
    const { error } = productValidationSchema.validate(productData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Actualizar producto
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};
