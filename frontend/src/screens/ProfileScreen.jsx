import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateUserProfileMutation } from '../slices/userApiSlice';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const ProfileScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile({ id: userInfo._id, name, email, password }).unwrap();
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };

    return (
        <FormContainer>
            <h1>Update Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-3' disabled={isLoading}>
                    {isLoading ? <Loader /> : 'Update'}
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ProfileScreen;
