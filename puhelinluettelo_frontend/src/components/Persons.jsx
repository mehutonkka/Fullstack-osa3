const Person = ({ name, number, id, remove }) => {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        remove(id, name)
      }}>
        <p>
          {name} {number} 
          <button type="submit">delete</button>
          </p>
        </form>
    )
  }



const Persons = ({persons, remove}) => {
  return(
    <>
      {persons.map(person => 
        <Person key={person.id} id={person.id} name={person.name} number={person.number} remove={remove} /> 
      )}
    </>
  )
}



export default Persons
