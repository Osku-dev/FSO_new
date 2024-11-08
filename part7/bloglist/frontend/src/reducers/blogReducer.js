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
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog));
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const likeBlog = (id) => async (dispatch, getState) => {
  try {
    const blogToUpdate = getState().blogs.find((blog) => blog.id === id);
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    

    const updatedBlogWithUser = {
      ...updatedBlog,
      user: blogToUpdate.user,
    };

    const returnedBlog = await blogService.updateBlog(id, updatedBlogWithUser);


    dispatch(updateBlog(returnedBlog));
    return true; 
  } catch (exception) {
    console.error("Error updating likes: ", exception);
    return false; 
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  try {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
    return true;
  } catch (exception) {
    console.error("Error deleting blog: ", exception);
    return false;
  }
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

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
