import { useState } from "react";

const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Statistics = (props) => {
  if (!props.good && !props.neutral && !props.bad) {
    return <p>No feedback given</p>;
  } else {
    return (
      <>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine
          text="all"
          value={props.good + props.neutral + props.bad}
        />
        <StatisticLine text="average" value="-" />
        <StatisticLine text="positif" value="-" />
      </>
    );
  }
};

const StatisticLine = (props) => {
  return (
    <div>
      <table>
        <tr>
          <td>{props.text}</td>
          <td>{props.value}</td>
        </tr>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header name={"give feedback"} />
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Header name={"statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
