import { useState } from 'react';
import { useRegisterMutation } from '../slices/userApiSlice.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';



const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await register({ name, email, password }).unwrap();
            console.log(res);
            dispatch(setCredentials({ ...res }));
            console.log(userInfo);
            navigate(redirect);
        } catch (err) {
            console.error('Register error:', err);
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>

            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' disabled={isLoading}>
                    {isLoading ? <Loader /> : 'Sign Up'}
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;