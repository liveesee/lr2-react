import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    activeTag: null,
  },
  reducers: {
    setActiveTag(state, action) {
      state.activeTag = action.payload
    },
  },
})

export const { setActiveTag } = filterSlice.actions
export const selectActiveTag = (state) => state.filters.activeTag

export default filterSlice.reducer
