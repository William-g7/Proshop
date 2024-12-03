import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
    res.json(products);
    }
);

router.get('/products/:id', (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
    }
);


export default productRoutes;