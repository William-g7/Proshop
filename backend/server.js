import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '../database/config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// basic route
app.get('/', (req, res) => {
    res.send('App is running');
    }
);

// product routes
app.use('/api/products', productRoutes);
// user routes
app.use('/api/users', userRoutes);
// order routes
app.use('/api/orders', orderRoutes);

// paypal routes
app.use('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    }
);

