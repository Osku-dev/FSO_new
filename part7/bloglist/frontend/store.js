import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./src/reducers/notificationReducer";
import blogReducer from "./src/reducers/blogReducer";
import userReducer from "./src/reducers/userReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer
  },
});

export default store;
