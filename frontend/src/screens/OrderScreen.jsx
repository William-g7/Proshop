import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../slices/orderApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Row, Col, ListGroup, ListGroupItem, Card, Button } from 'react-bootstrap';





const OrderScreen = () => {
    const { id } = useParams();
    const { data: order, refetch,isLoading, error } = useGetOrderByIdQuery(id);
    console.log(order);

    return(
        isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name:</strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {order.user.email}
                        </p>
                        <p>
                            <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <p>
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt.substring(0, 10)}</Message> : <Message variant='danger'>Not Delivered</Message>}
                        </p>

                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method:</strong> {order.paymentMethod}
                        </p>
                        <p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt.substring(0, 10)}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </p>

                        <h2>Order Items</h2>
                        <ListGroup>
                            {order.orderItems.map((item) => (
                                <ListGroupItem key={item._id}>
                                    <Row>
                                        <Col md={1}>
                                            <img src={item.image} alt={item.name} style={{ width: '50px' }} className='img-fluid' />
                                        </Col>
                                        <Col md={7}>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup>
                                <ListGroupItem>
                                    <h2>Order Summary</h2>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0)}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                    {order.isPaid && (
                                        <ListGroupItem>
                                            <Button type='button' className='btn-block'>
                                                Pay
                                            </Button>
                                        </ListGroupItem>
                                    )}
                                    {order.isDelivered && (
                                        <ListGroupItem>
                                            <Button type='button' className='btn-block'>
                                                Deliver
                                            </Button>
                                        </ListGroupItem>
                                    )}
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    );
};

export default OrderScreen;