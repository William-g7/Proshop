import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

const OrderHistoryScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    return (
        <Row>
            <Col md={12}>
                <h1>Order History</h1>
                {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ?
                                        <FaCheck style={{ color: '#2ecc71' }} size={18} /> :
                                        <FaTimes style={{ color: '#e74c3c' }} size={18} />
                                    }</td>
                                    <td>{order.isDelivered ?
                                        <FaCheck style={{ color: '#2ecc71' }} size={18} /> :
                                        <FaTimes style={{ color: '#e74c3c' }} size={18} />
                                    }</td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm' >Details</Button>
                                    </LinkContainer>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row >
    );

};

export default OrderHistoryScreen;
