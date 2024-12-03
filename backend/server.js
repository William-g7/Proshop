import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../database/config/db.js';
import productRoutes from './routes/productRoutes.js';
import products from './data/products.js';

const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.get('/', (req, res) => {
    res.send('App is running');
    }
);

app.use('/api/products', productRoutes);

app.use()


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    }
);

