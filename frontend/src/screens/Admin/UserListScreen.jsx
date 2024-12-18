import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/userApiSlice';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const UserListScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // 过滤用户列表
    const filteredUsers = users?.filter(user => {
        const matchesSearch =
            user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' ? true :
            filterRole === 'admin' ? user.isAdmin :
                filterRole === 'customer' ? !user.isAdmin : true;

        return matchesSearch && matchesRole;
    });

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                refetch();
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <Row>
            <Col md={12}>
                <h1>Users</h1>
            </Col>
            <Col md={4}>
                <Form.Control
                    type='text'
                    placeholder='Search users...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Col>
            <Col md={4}>
                <Form.Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value='all'>All Roles</option>
                    <option value='admin'>Administrators</option>
                    <option value='customer'>Customers</option>
                </Form.Select>
            </Col>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm' style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>REGISTERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers?.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>
                                        {user.email}
                                    </a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <Button
                                        variant='light'
                                        className='btn-sm ms-2'
                                        onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant='light'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(user._id)}
                                        disabled={user._id === userInfo._id}
                                    >
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
};

export default UserListScreen;
