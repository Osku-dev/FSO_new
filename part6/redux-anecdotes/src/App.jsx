import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import VisibilityFilter from "./components/VisibilityFilter";
import Notification from "./components/Notification";

const App = () => {
  return (
    <div>
      <Notification />
      <VisibilityFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;