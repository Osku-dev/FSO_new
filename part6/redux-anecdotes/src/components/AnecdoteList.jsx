import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, clearNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const anecdotes = useSelector((state) => state.anecdotes);
    const filter = useSelector((state) => state.filter);
    const dispatch = useDispatch();

    const filteredAnecdotes = anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      );

      const vote = (id) => {
        const anecdote = anecdotes.find(anecdote => anecdote.id === id);
        dispatch(voteAnecdote(id));
        dispatch(setNotification(`You voted for '${anecdote.content}'`));
        
        setTimeout(() => {
          dispatch(clearNotification());
        }, 5000); 
      };

  return (
    <div>
      <h2>Anecdotes</h2>
      {filteredAnecdotes 
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
