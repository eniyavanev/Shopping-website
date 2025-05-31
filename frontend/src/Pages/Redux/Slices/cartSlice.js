import { createSlice } from "@reduxjs/toolkit";

// 🔸 Load cart from localStorage or set initial default values
const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {
        items: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },

  // 🔸 Load shipping info from localStorage or set empty object
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

// 🔧 Helper function to calculate prices and update localStorage
const calculatePrices = (cart) => {
  if (cart.items.length === 0) {
    // 🧹 Reset all prices if cart is empty
    cart.itemsPrice = 0;
    cart.shippingPrice = 0;
    cart.taxPrice = 0;
    cart.totalPrice = 0;
  } else {
    // 💰 Calculate subtotal
    cart.itemsPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 🚚 Calculate shipping price (Free over ₹1000)
    cart.shippingPrice = cart.itemsPrice > 1000 ? 0 : 50;

    // 🧾 Calculate 18% GST
    cart.taxPrice = Number((0.18 * cart.itemsPrice).toFixed(2));

    // 🧮 Calculate total
    cart.totalPrice = Number(
      (cart.itemsPrice + cart.shippingPrice + cart.taxPrice).toFixed(2)
    );
  }

  // 💾 Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};

// 🧩 Slice creation
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ➕ Add or update item in cart
    addToCart: (state, action) => {
      const newItem = action.payload;
      const exist = state.cart.items.find((x) => x._id === newItem._id);

      if (exist) {
        // 📝 If exists, update
        state.cart.items = state.cart.items.map((x) =>
          x._id === exist._id ? newItem : x
        );
      } else {
        // 🆕 If not, add new item
        state.cart.items.push(newItem);
      }

      calculatePrices(state.cart);
    },

    // ❌ Remove item from cart
    removeFromCart: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (item) => item._id !== action.payload
      );
      calculatePrices(state.cart);
    },

    // 🔺 Increase quantity
    increaseQty: (state, action) => {
      const item = state.cart.items.find((x) => x._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      calculatePrices(state.cart);
    },

    // 🔻 Decrease quantity (minimum 1)
    decreaseQty: (state, action) => {
      const item = state.cart.items.find((x) => x._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      calculatePrices(state.cart);
    },

    // 📦 Save shipping information
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
    //order Completed
    orderCompleted: (state) => {
      state.cart.items = [];
      state.shippingInfo = {};

      // 🧹 Also reset all prices to zero
      state.cart.itemsPrice = 0;
      state.cart.shippingPrice = 0;
      state.cart.taxPrice = 0;
      state.cart.totalPrice = 0;

      // 🗑️ Clear persisted storage
      localStorage.removeItem("cart");
      localStorage.removeItem("shippingInfo");
      sessionStorage.removeItem("orderData");
    },
  },
});

// 🎯 Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  saveShippingInfo,
  orderCompleted,
} = cartSlice.actions;

export default cartSlice.reducer;
