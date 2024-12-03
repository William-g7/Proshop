import express from 'express';
import Product from '../../database/models/productModel.js'
import asyncHandler from '../middleware/asyncHandler.js';
import { notFound, errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
    })
);

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
    })
);



router.use(notFound);
router.use(errorHandler);

export default router;