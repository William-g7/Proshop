import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetTopRatedProductsQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import Message from './Message';
import { Image } from 'react-bootstrap';

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopRatedProductsQuery();
    return (
        <>
            {
                isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Carousel pause='hover' className='bg-dark'>
                        {products.map((product) => (
                            <Carousel.Item key={product._id}>
                                <Row>
                                    <Col md={5}>
                                        <Link to={`/product/${product._id}`}>
                                            <img src={product.image} alt={product.name} />
                                        </Link>
                                    </Col>
                                    <Col md={7}>
                                        <Link to={`/product/${product._id}`} className="text-decoration-none">
                                            <div className="product-details">
                                                <div>
                                                    <h2>{product.name}</h2>
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </Col>
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )
            }
        </>
    )
}

export default ProductCarousel;