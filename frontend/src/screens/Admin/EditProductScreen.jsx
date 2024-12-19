import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const EditProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const { data: product, isLoading, error: fetchError } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            }).unwrap();
            toast.success('Product updated successfully');
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

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

    return (
        <FormContainer>
            <h1>Update Product</h1>
            {loadingUpdate && <Loader />}
            {loadingUpload && <Loader />}
            {isLoading ? (
                <Loader />
            ) : fetchError ? (
                <Message variant='danger'>{fetchError?.data?.message || 'Error fetching product'}</Message>
            ) : (
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
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    );
};


export default EditProductScreen;