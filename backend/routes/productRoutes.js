import express from 'express';
import { getProducts, getProductById } from '../controller/routesController.js';
import { notFound, errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProductById);


export default router;