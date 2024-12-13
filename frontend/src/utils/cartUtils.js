export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
    // Calculate items price
    const itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    // Calculate shipping price
    const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 10);
    // Calculate tax price
    const taxPrice = addDecimals(Number(itemsPrice) * 0.15);
    // Calculate total price
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    // Save to local storage
    localStorage.setItem('cart', JSON.stringify({ ...state, itemsPrice, shippingPrice, taxPrice, totalPrice }));

    return { ...state, itemsPrice, shippingPrice, taxPrice, totalPrice };
}