import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../slices/userApiSlice';

const EditUserScreen = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();

    const { data: user, isLoading, error: fetchError } = useGetUserByIdQuery(userId);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Updating user with ID:', userId);
            if (!userId) {
                toast.error('User ID is missing');
                return;
            }

            await updateUser({
                id: userId,
                name,
                email,
                isAdmin,
            }).unwrap();
            toast.success('User updated successfully');
            navigate('/admin/userlist');
        } catch (err) {
            console.error('Update error:', err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? (
                <Loader />
            ) : fetchError ? (
                <Message variant='danger'>
                    {fetchError?.data?.message || 'Error fetching user'}
                </Message>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='isAdmin' className='my-2'>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                    </Form.Group>

                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    );
};

export default EditUserScreen;
