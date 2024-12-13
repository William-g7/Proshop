import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../slices/orderApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Row, Col, ListGroup, ListGroupItem, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetPaypalClientIdQuery, usePayOrderMutation } from '../slices/orderApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const OrderScreen = () => {
    const { id } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderByIdQuery(id);
    console.log(order);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const { data: paypal, isLoading: loadingPaypal, error: errorPaypal } = useGetPaypalClientIdQuery();
    console.log(paypal);

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { userInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!errorPaypal && !loadingPaypal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending',
                });
            };

            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [paypal, paypalDispatch, errorPaypal, loadingPaypal, order]);

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{ amount: { value: order.totalPrice } }],
        });
    };

    const onApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();
            const result = await payOrder({
                orderId: order._id,
                details: {
                    id: details.id,
                    status: details.status,
                    update_time: details.update_time,
                    email_address: details.payer.email_address,
                },
            }).unwrap();

            toast.success('Payment successful');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };

    const onError = (err) => {
        toast.error(err.message);
    };


    return (
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
                        <div>
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt.substring(0, 10)}</Message> : <Message variant='danger'>Not Delivered</Message>}
                        </div>

                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method:</strong> {order.paymentMethod}
                        </p>
                        <div>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt.substring(0, 10)}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </div>

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

                                    {!order.isPaid && (
                                        <ListGroupItem>
                                            {loadingPay && <Loader />}
                                            {isPending ? (
                                                <Loader />
                                            ) : (
                                                <div>
                                                    <PayPalButtons
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    />
                                                </div>
                                            )}
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