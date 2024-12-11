import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';

const PaymentScreen = () => {
    const cart = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    useEffect(() => {
        if (!cart.shippingAddress) {
            navigate('/shipping');
        }
    }, [cart.shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }


    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Your Payment Method</Form.Label>
                    <Col>
                        <Form.Check 
                            type='radio' 
                            label='PayPal or Credit Card' 
                            id='PayPal' 
                            name='paymentMethod' 
                            value='PayPal' 
                            checked 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                    <Col>
                        <Form.Check 
                            type='radio' 
                            label='Stripe' 
                            id='Stripe' 
                            name='paymentMethod' 
                            value='Stripe'  
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;