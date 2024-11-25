const Notify = ({ message }) => {
    if (!message) {
      return null; 
    }
  
    return (
      <div style={{ color: "red", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
        {message}
      </div>
    );
  };
  
  export default Notify;
  