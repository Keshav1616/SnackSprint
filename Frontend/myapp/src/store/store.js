import { configureStore } from '@reduxjs/toolkit'
import restaurantsReducer from './restaurantsSlice'
import cartReducer from './cartSlice'
import appReducer from './appSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
    cart: cartReducer,
    app: appReducer,
    chat:chatReducer
  }
})

export default store
