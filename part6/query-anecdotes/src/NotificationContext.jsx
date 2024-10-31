import { createContext, useReducer, useContext } from 'react';

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

const NotificationContext = createContext();

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

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
