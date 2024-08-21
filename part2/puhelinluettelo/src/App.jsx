import { useState, useEffect } from "react";
import { Persons, PersonForm, Filter } from "./components/Persons";
import { SuccessNotification, ErrorNotification } from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );
      if (!confirmUpdate) return;

      const updatedPerson = { ...existingPerson, number: newNumber };
      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          );
          setSuccessMessage(`${returnedPerson.name} updated`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000); // Changed to 5000ms
        })
        .catch((error) => {
          console.error("Error updating person:", error);

          if (error.response?.data?.error) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage(
              `Information of ${updatedPerson.name} has already been removed from the server`
            );
            setPersons(persons.filter((p) => p.id !== updatedPerson.id));
          }

          setTimeout(() => {
            setErrorMessage(null);
          }, 5000); // Changed to 5000ms
        });
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(nameObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");

        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000); // Changed to 5000ms
      })
      .catch((error) => {
        console.error("Error creating person:", error);

        if (error.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Failed to add the person");
        }

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000); // Changed to 5000ms
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const deletePerson = (id) => {
    if (window.confirm(`Do you really want to delete this contact?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setSuccessMessage(`Person deleted`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000); // Changed to 5000ms
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      <h1>add a new</h1>
      <PersonForm
        addNote={addNote}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;