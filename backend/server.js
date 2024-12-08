import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../database/config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// basic route
app.get('/', (req, res) => {
    res.send('App is running');
    }
);

// product routes
app.use('/api/products', productRoutes);
// user routes
app.use('/api/users', userRoutes);



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    }
);

