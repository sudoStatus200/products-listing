// src/store/reducers/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartDetails: {
    id: null,
    userId: null,
    date: null,
    products: [],
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.cartDetails = action.payload;
    },
  },
});

export const { setCartData } = cartSlice.actions;
export default cartSlice.reducer;
