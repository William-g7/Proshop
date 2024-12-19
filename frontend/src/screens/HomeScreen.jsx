import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice'
import { Row, Col, Pagination } from 'react-bootstrap'
import Product from '../components/Product'
import ProductCarousel from '../components/ProductCarousel'
import Loader from '../components/Loader'
import Message from '../components/Message'


const HomeScreen = () => {
  const { keyword = '', pageNumber = 1 } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber: Number(pageNumber)
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <ProductCarousel />
          <h1>Latest Products</h1>
          <Row>
            {data.products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Pagination */}
          {data.pages > 1 && (
            <Pagination className='justify-content-center my-3'>
              {[...Array(data.pages).keys()].map((x) => (
                <Pagination.Item
                  key={x + 1}
                  active={x + 1 === data.page}
                  as={Link}
                  to={keyword ?
                    `/search/${keyword}/page/${x + 1}` :
                    `/page/${x + 1}`
                  }
                >
                  {x + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </>
  )
}

export default HomeScreen