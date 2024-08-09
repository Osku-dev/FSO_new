import { useState } from "react";

const Button = ({ handleClick, text }) => (
  <p>
    <button onClick={handleClick}>{text}</button>
  </p>
);

const ShowAnecdote = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
      <p>{props.anecdote}</p>
      <p>has {props.vote} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const handleNextClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const handleVoteClick = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  return (
    <div>
      <ShowAnecdote
        text="Anecdote of the day"
        anecdote={anecdotes[selected]}
        vote={points[selected]}
      />

      <Button handleClick={handleVoteClick} text="vote" />
      <Button handleClick={handleNextClick} text="next anecdote" />

      <ShowAnecdote
        text="Anecdote with the most votes"
        anecdote={anecdotes[points.indexOf(Math.max(...points))]}
        vote={Math.max(...points)}
      />
    </div>
  );
};

export default App;
