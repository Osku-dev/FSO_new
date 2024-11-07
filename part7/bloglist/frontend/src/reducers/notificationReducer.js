import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", type: "" },
  reducers: {
    setNotification(state, action) {
      return { message: action.payload.message, type: action.payload.type };
    },
    clearNotification() {
      return { message: "", type: "" };
    },
  },
});

export const setNotificationWithTimeout = (message, type, duration) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
