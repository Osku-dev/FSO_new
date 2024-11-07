import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
  },
});

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog, username) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.createBlog(blog);
      const updatedBlog = {
        ...newBlog,
        user: {
          ...newBlog.user,
          username: username,
        },
      };

      dispatch(addBlog(updatedBlog));
      return true;
    } catch (error) {
      console.error("Failed to create blog:", error);
      return false;
    }
  };
};

export const { setBlogs, addBlog } = blogSlice.actions;
export default blogSlice.reducer;
