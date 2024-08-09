
 
 const Person = (props) => {
    return (
      <div>
        <p>
          {props.name} {props.number} 
          <button onClick={() => props.deletePerson(props.id)}>delete</button>
        </p>
      </div>
    );
  };
  
  export const Persons = (props) => {
    return (
      <div>
        {props.filteredPersons.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            number={person.number}
            id={person.id}
            deletePerson={props.deletePerson}
          />
        ))}
      </div>
    );
  };
  
  export const PersonForm = (props) => {
    return (
      <form onSubmit={props.addNote}>
        <div>
          {" "}
          name: <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>
          number:{" "}
          <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
  };
  
  export const Filter = (props) => {
    return (
      <div>
        filter shown with{" "}
        <input value={props.newFilter} onChange={props.handleFilterChange} />
      </div>
    );
  };
 
  