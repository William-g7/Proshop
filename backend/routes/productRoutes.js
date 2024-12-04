import express from 'express';
import { getProducts, getProductById } from '../controller/routesController.js';
import { notFound, errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProductById);


router.use(notFound);
router.use(errorHandler);

export default router;