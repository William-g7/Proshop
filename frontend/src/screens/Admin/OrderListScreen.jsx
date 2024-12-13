import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/orderApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const OrderListScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDelivery, setFilterDelivery] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const filteredOrders = orders?.filter(order => {
        if (!order.user) return false;

        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPayment = filterStatus === 'all' ? true :
            filterStatus === 'paid' ? order.isPaid :
                filterStatus === 'unpaid' ? !order.isPaid : true;

        const matchesDelivery = filterDelivery === 'all' ? true :
            filterDelivery === 'delivered' ? order.isDelivered :
                filterDelivery === 'undelivered' ? !order.isDelivered : true;

        return matchesSearch && matchesPayment && matchesDelivery;
    }) || [];

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'price':
                return b.totalPrice - a.totalPrice;
            default:
                return 0;
        }
    });

    return (
        <Row>
            <Col md={12}>
                <h1>Orders</h1>
                <Row className="mb-3">
                    <Col md={3}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Payment Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={filterDelivery}
                            onChange={(e) => setFilterDelivery(e.target.value)}
                        >
                            <option value="all">All Delivery Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="undelivered">Undelivered</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="price">Sort by Price</option>
                        </Form.Select>
                    </Col>
                </Row>
                {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user && order.user.name}</td>
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

export default OrderListScreen;
