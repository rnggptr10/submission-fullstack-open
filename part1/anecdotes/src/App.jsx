import { useState } from "react";

const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const Anecdote = (props) => {
  return (
    <>
      <p>{props.text}</p>
      <p>has {props.votes} votes</p>
    </>
  );
};

const AnecdoteMostVote = (props) => {
  const highestValue = Math.max(...Object.values(props.points));
  const indexOfHighestValue = Object.keys(props.points).find(
    (key) => props.points[key] === highestValue
  );

  console.log(highestValue);
  if (highestValue == 0) {
    return <p>No votes given</p>;
  } else {
    return (
      <Anecdote
        text={props.text[indexOfHighestValue]}
        votes={props.points[indexOfHighestValue]}
      />
    );
  }
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const randomZeroToSeven = Math.floor(Math.random() * 8);

  // handle
  const handleClickNext = () => {
    if (selected >= 7) {
      setSelected(0);
    } else {
      setSelected(randomZeroToSeven);
    }
  };

  const handleClickVote = () => {
    // Membuat salinan objek points
    const updatedPoints = { ...points };

    // Menambahkan 1 ke nilai yang sesuai
    updatedPoints[selected] += 1;

    // Memperbarui state points
    setPoints(updatedPoints);
  };

  return (
    <div>
      <Header name={"Anecdote of the day"} />
      <Anecdote text={anecdotes[selected]} votes={points[selected]} />
      <br />
      <Button handleClick={() => handleClickVote()} text={"vote"} />
      <Button handleClick={() => handleClickNext()} text={"next anecdote"} />
      <Header name={"Anecdote with most votes"} />
      <AnecdoteMostVote points={points} text={anecdotes} />
    </div>
  );
};

export default App;
