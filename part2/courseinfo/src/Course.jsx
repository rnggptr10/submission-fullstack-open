const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Content = (props) => {
  return (
    <>
      <Part parts={props.parts} />
      <Total parts={props.parts} />
    </>
  );
};

const Part = (props) =>
  props.parts.map((part) => (
    <p key={part.id}>
      {part.name} {part.exercises}
    </p>
  ));

const Total = (props) => {
  const total = props.parts.reduce((total, part) => total + part.exercises, 0);
  return <b>total of {total} exercises</b>;
};

const Course = (props) => {
  return (
    <>
      {props.course.map((course, i) => (
        <div key={i}>
          <Header name={course.name} />
          <Content parts={course.parts} />
        </div>
      ))}
    </>
  );
};

export default Course;
