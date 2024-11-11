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
    
    const updatedBlogData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };
    
    const returnedBlog = await blogService.updateBlog(id, updatedBlogData);

    const updatedBlogWithUser = {
      ...returnedBlog,
      user: blogToUpdate.user, 
    };

    dispatch(updateBlog(updatedBlogWithUser));
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

export const createBlog = (newBlogData) => async (dispatch, getState) => {
  try {
    const currentUser = getState().user;
    const returnedBlog = await blogService.createBlog(newBlogData);

    const returnedBlogWithUser = {
      ...returnedBlog,
      user: {
        username: currentUser.username,
        name: currentUser.name,
        id: currentUser.id
      },
    };

    dispatch(addBlog(returnedBlogWithUser));
    return true;
  } catch (exception) {
    console.error("Error creating new blog: ", exception);
    return false;
  }
};

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
