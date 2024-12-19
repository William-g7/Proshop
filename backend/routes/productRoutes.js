import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getProducts, getProductsAdmin, getTopRatedProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview } from '../controller/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/admin', getProductsAdmin);
router.get('/top', getTopRatedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

export default router;