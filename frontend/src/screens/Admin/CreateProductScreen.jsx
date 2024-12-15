import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useCreateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const CreateProductScreen = () => {
    const navigate = useNavigate();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const handleImageUpload = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting product:', {
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        });
        try {
            const result = await createProduct({
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            }).unwrap();
            console.log('Create product response:', result)
            toast.success('Product created successfully');
            navigate('/admin/productlist');
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Create Product</h1>
            {loadingCreate && <Loader />}
            {loadingUpload && <Loader />}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='price' className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='Enter price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min={0}
                        step={0.01}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='image' className='my-2'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter image url'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>
                    <Form.Control
                        type='file'
                        label='Choose Image'
                        onChange={handleImageUpload}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='brand' className='my-2'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter brand'
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category' className='my-2'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='countInStock' className='my-2'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='Enter count in stock'
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        min={0}
                        step={1}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='description' className='my-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        placeholder='Enter description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>
                    Create
                </Button>
            </Form>
        </FormContainer>
    );
};

export default CreateProductScreen;