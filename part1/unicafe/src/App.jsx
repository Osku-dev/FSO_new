import { useState } from "react";

const Heading = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
    </div>
  );
};

const Stats = (props) => {
  return (
    <div>
      <table>
        <tbody>
        <tr>
          <td>{props.text1}</td>
          <td>{props.stat}</td>
          <td>{props.text2}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    const updatedAll = all + 1;
    setAll(updatedAll);
    setAverage((updatedGood - bad) / updatedAll);
    setPositive((updatedGood / updatedAll) * 100);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    const updatedAll = all + 1;
    setAll(updatedAll);
    setAverage((good - bad) / updatedAll);
    setPositive((good / updatedAll) * 100);
  };

  const handleBadClick = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    const updatedAll = all + 1;
    setAll(updatedAll);
    setAverage((good - updatedBad) / updatedAll);
    setPositive((good / updatedAll) * 100);
  };

  if (all != 0) {
    return (
      <div>
        <Heading text="give feedback" />

        <Button handleClick={handleGoodClick} text="good" />

        <Button handleClick={handleNeutralClick} text="neutral" />

        <Button handleClick={handleBadClick} text="bad" />

        <Heading text="statistics" />
        <Stats text1="good" stat={good} />

        <Stats text1="neutral" stat={neutral} />

        <Stats text1="bad" stat={bad} />

        <Stats text1="all" stat={all} />

        <Stats text1="average" stat={average} />

        <Stats text1="positive" stat={positive} text2="%" />
      </div>
    );
  }
  return (
    <div>
      <Heading text="give feedback" />

      <Button handleClick={handleGoodClick} text="good" />

      <Button handleClick={handleNeutralClick} text="neutral" />

      <Button handleClick={handleBadClick} text="bad" />

      <Heading text="statistics" />
      <Stats text1="No feedback given" />
    </div>
  );
};

export default App;
