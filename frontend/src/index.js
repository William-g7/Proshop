import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import store from './store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProductListScreen from './screens/Admin/ProductListScreen';
import OrderListScreen from './screens/Admin/OrderListScreen';
import UserListScreen from './screens/Admin/UserListScreen';
import CreateProductScreen from './screens/Admin/CreateProductScreen';
import EditProductScreen from './screens/Admin/EditProductScreen';
import EditUserScreen from './screens/Admin/EditUserScreen';
import reportWebVitals from './reportWebVitals';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index={true} element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='product/:id' element={<ProductScreen />} />
      <Route path='cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/orderhistory' element={<OrderHistoryScreen />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/product/create' element={<CreateProductScreen />} />
        <Route path='/admin/product/:id/edit' element={<EditProductScreen />} />
        <Route path='/admin/user/:id/edit' element={<EditUserScreen />} />
      </Route>
    </Route>
  )
)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
