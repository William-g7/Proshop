import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useGetProductDetailsQuery, useCreateProductReviewMutation } from "../slices/productsApiSlice";
import { Row, Col, Image, ListGroup, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";


const ProductScreen = () => {
    const { id: productId } = useParams();
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const [createProductReview, { isLoading: reviewLoading, error: reviewError }] = useCreateProductReviewMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get('comment');
        const rating = formData.get('rating');
        try {
            await createProductReview({
                productId,
                rating: Number(rating),
                comment
            });
            toast.success('Review submitted successfully');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const dispatch = useDispatch();

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <Meta title={product.name} description={product.description} />
                    <Link className='btn btn-light my-3' to='/'>
                        Go Back
                    </Link>

                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>{product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty: </Col>
                                                    <Col>
                                                        <Form.Control as='select' value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </>
                                    )}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No reviews yet</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} text={`${review.createdAt.substring(0, 10)}`} />
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {reviewLoading && <Loader />}
                                    {reviewError && <Message variant='danger'>{reviewError.data.message || reviewError.error}</Message>}
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Select
                                                name='rating'
                                                required
                                            >
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group controlId='review'>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                                name='comment'
                                                as='textarea'
                                                rows={3}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type='submit' variant='primary' disabled={reviewLoading || !userInfo} > Submit</Button>
                                    </Form>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>

    )

}

export default ProductScreen;
