import { configureStore } from "@reduxjs/toolkit"
import filtersReducer from "./filterSlice.js"

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
})
