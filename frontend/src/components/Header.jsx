import React from 'react'
import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NavDropdown } from 'react-bootstrap'
import logo from '../assets/logo.png'

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);
  
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand as={Link} to='/'>
            <img src={logo} alt="ProShop" /> ProShop
            </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" >
              <Nav.Link as={Link} to='/cart'>
                <FaShoppingCart /> Cart 
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
              </Nav.Link>
              
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/orderhistory'>
                    Order
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/logout'>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
