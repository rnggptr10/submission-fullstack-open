import React from "react";

function Person(props) {
  const delete = () =>{
    
  }

  return props.persons.map((person) => (
    <>
      {person.name} {person.number}
      <button type="submit" onClick>
        delete
      </button>
      <br />
      <br />
    </>
  ));
}

export default Person;
