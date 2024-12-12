import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import '../assets/styles/PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [shippingAddress, paymentMethod, navigate]);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({ 
                orderItems: cartItems, 
                shippingAddress, 
                paymentMethod,
                itemsPrice: cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2),
                taxPrice: (cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15).toFixed(2),
                shippingPrice: shippingAddress.address ? 0 : 20,
                totalPrice: (cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) + (shippingAddress.address ? 0 : 20) + (cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15)).toFixed(2)
            }).unwrap();
            console.log(res);
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || err?.error || 'Something went wrong');
        }
    };


    return (
        <div className='place-order-container'>
            <CheckoutSteps step1 step2 step3 step4 />
            <h1 className='text-center'>Place Order</h1>
            <Row>
                <Col md={8}>
                    <Card className='order-card'>
                        <Card.Body>
                        <ListGroup>
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong>
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method:</strong>
                                {paymentMethod}
                            </p>
                        </ListGroupItem>
                        {cartItems.map((item) => (
                        <ListGroupItem key={item._id} className='order-item'>
                            <Row>
                                <Col md={6} className='d-flex align-items-center'> 
                                    {item.image && <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className='product-image' 
                                    />} 
                                    <Link to={`/product/${item._id}`} className='product-link'>{item.name}</Link>
                                    </Col>
                                    <Col md={6} className='d-flex align-items-center justify-content-end'>
                                         <span className='price-text'>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                        </Card.Body>    
                    </Card>
                    
                </Col>
                <Col md={4}>
                    <Card className='order-card'>
                        <Card.Body>
                            <Card.Title className='section-title'>Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h3>Items</h3>
                                    <p>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h3>Shipping</h3>
                                    <p>${shippingAddress.address ? 0 : 20}</p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h3>Tax</h3>
                                    <p>${(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15).toFixed(2)}</p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h3>Order Total</h3>
                                    <p>${(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) + (shippingAddress.address ? 0 : 20) + (cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15)).toFixed(2)}</p>
                                </ListGroupItem>
                            </ListGroup>
                            {error && <Message variant='danger'>{error.data?.message || error.error || 'An error occurred'}</Message>}
                            <Button className='place-order-button' onClick={placeOrderHandler} disabled={isLoading}>
                                {isLoading ? <Loader /> : 'Place Order'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;