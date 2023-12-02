import React, { useState } from "react";

function PersonForm() {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState("a new person...");

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newPerson,
    };
    setPersons(persons.concat(personObject));
    setNewPerson("");
    console.log("new persons: ", persons);
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewPerson(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newPerson} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm;
