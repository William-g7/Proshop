import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useGetProductsAdminQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';


const ProductListScreen = () => {

    const { userInfo } = useSelector((state) => state.auth);
    const { data: products, refetch, isLoading, error } = useGetProductsAdminQuery();
    const navigate = useNavigate();
    const [deleteProduct] = useDeleteProductMutation();
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterBrand, setFilterBrand] = useState('all');

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ? true :
            filterStatus === 'inStock' ? product.countInStock > 0 :
                filterStatus === 'outOfStock' ? product.countInStock === 0 : true;

        const matchesCategory = filterCategory === 'all' ? true :
            product.category === filterCategory;

        const matchesBrand = filterBrand === 'all' ? true :
            product.brand === filterBrand;

        return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
    });

    const getUniqueValues = (products, key) => {
        if (!products) return [];
        return ['all', ...new Set(products.map(product => product[key]))];
    };

    const deleteHandler = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this product?')) {
                await deleteProduct(id);
                refetch();
                toast.success('Product deleted successfully');
            }
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    return (
        <Row>
            <Col md={12}>
                <h1>Products</h1>
            </Col>
            <Col md={2}>
                <Form.Control type='text' placeholder='Search products...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Col>
            <Col md={2}>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value='all'>All Stock Status</option>
                    <option value='inStock'>In Stock</option>
                    <option value='outOfStock'>Out of Stock</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    {getUniqueValues(products, 'category').map(category => (
                        <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' :
                                category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                    {getUniqueValues(products, 'brand').map(brand => (
                        <option key={brand} value={brand}>
                            {brand === 'all' ? 'All Brands' :
                                brand.charAt(0).toUpperCase() + brand.slice(1)}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
                <LinkContainer to='/admin/product/create'>
                    <Button type='button' className='mb-3'>
                        <FaPlus className='me-2' /> Create Product
                    </Button>
                </LinkContainer>
            </Col>
            {isLoading ? <Loader /> : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error?.error || 'An error occurred'}
                </Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm' style={{ marginTop: '30px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>{product.countInStock}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='light' className='btn-sm mx-2' onClick={() => deleteHandler(product._id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

        </Row>



    );
}


export default ProductListScreen;