import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : { cartItems: [], shippingAddress: {}, paymentMethod: '' };
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            // Calculate shipping price
            state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);
            // Calculate tax price
            state.taxPrice = addDecimals(Number(state.itemsPrice) * 0.15);
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);
            // Save to local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

    },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;