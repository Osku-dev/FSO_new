import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

const initialState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const loginUser = (credentials) => async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      return true;
    } catch (exception) {
      console.error("Login error:", exception);
      return false;
    }
  };
  
  export const logoutUser = () => (dispatch) => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    dispatch(clearUser());
  };

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;