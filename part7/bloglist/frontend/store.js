import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./src/reducers/notificationReducer";
import blogReducer from "./src/reducers/blogReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer
  },
});

export default store;
