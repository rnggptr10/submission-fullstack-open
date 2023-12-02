import { useEffect, useState } from "react";
// import Person from "./Person";
import personService from "./services/persons";

const Filter = (props) => {
  const personsToShow = (e) => {
    props.setDataFilter(
      props.persons.filter((person) =>
        person.name.toLowerCase().includes(e.toLowerCase())
      )
    );
  };

  return (
    <>
      <div>
        filter shown with name{" "}
        <input onChange={(e) => personsToShow(e.target.value)} />
      </div>
    </>
  );
};

const PersonForm = (props) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = props.persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            props.setPersons(
              props.persons.map((person) =>
                person.id === existingPerson.id ? response.data : person
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error updating person:", error);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((response) => {
        props.setPersons(props.persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = (props) => {
  const handleDelete = (id) => {
    if (window.confirm("Do you really want to delete this person?")) {
      personService.deleted(id).then(() => {
        props.setPersons(props.persons.filter((person) => person.id !== id));
        // props.setDataFilter(response.data);
      });
    }
  };

  return props.persons.map((person) => (
    <>
      {person.name} {person.number}
      <button
        key={person.id}
        type="submit"
        onClick={() => handleDelete(person.id)}
      >
        delete
      </button>
      <br />
      <br />
    </>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [dataFilter, setDataFilter] = useState(persons);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  useEffect(() => {
    // Memperbarui dataFilter setiap kali persons berubah
    setDataFilter(persons);
  }, [persons]);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter persons={persons} setDataFilter={setDataFilter} />
      <h3>add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h3>Numbers</h3>
      <Person persons={dataFilter} setPersons={setPersons} />
    </div>
  );
};

export default App;
