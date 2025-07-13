import { createContext, useReducer, useContext } from 'react';

// Reducer function to handle notification actions
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload; 
    case "CLEAR_NOTIFICATION":
      return ''; 
    default:
      return state;
  }
};

// Create a context to share notification state and dispatch across the app
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const { notificationDispatch } = useContext(NotificationContext);

  const setNotification = (message, duration) => {
    notificationDispatch({ type: "SET_NOTIFICATION", payload: message });

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR_NOTIFICATION" });
    }, duration * 1000);
  };

  return { setNotification };
};

// Context provider component to wrap your app and provide notification state
export const NotificationContextProvider = (props) => {

  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  return (
    // Provide the current notification state and dispatch function to all children
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
