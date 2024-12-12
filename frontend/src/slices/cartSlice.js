import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = {
    cartItems: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart')).cartItems
        : [],
    shippingAddress: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart')).shippingAddress
        : {
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            country: ''
        },
    paymentMethod: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart')).paymentMethod
        : 'PayPal'
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            updateCart(state);
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            updateCart(state);
        },
    },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
