import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../database/config/db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(cors());

// basic route
app.get('/', (req, res) => {
    res.send('App is running');
    }
);

// product routes
app.use('/api/products', productRoutes);



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    }
);

