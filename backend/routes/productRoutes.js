import express from 'express';
import products from '../data/products.js';
import asyncHandler from '../middleware/asyncHandler.js';
const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/products', asyncHandler(async (req, res) => {
    res.json(products);
    })
);

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
router.get('/products/:id', asyncHandler(async (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
    })
);


export default productRoutes;