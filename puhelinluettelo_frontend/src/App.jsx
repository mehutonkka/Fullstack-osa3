import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import FilterForm from './components/Filter'
import personService from './services/personsget'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filtPersons, setFiltPersons] = useState(persons)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      const specificPerson = persons.find((person1) => person1.name === newName)
      const specificId = specificPerson ? specificPerson.id : null
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(newName, newNumber, specificId)
          .then(returnedPersons => {
            setPersons(returnedPersons)
            setNotificationClass('changed')
            setNotificationMessage(`Changed number of ${newName} to ${newNumber}`)
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)})
          .catch(error => {
              setNotificationClass('error')
              setNotificationMessage(`Information of ${newName} has already been removed from server`)
              setNewName('')
              setNewNumber('')
              setPersons(persons.filter(p => p.name != newName))
              setTimeout(() => {
                setNotificationMessage(null)
              }, 5000)
            })
            
      }
    } else {
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationClass('added')
        setNotificationMessage(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        setNotificationClass('error')
        setNotificationMessage(`Information of ${newName} has already been removed from server`)
        setNewName('')
        setNewNumber('')
        setPersons(persons.filter(p => p.name != newName))
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
    
    }
    
  }
  
  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
    personService
      .remove(id, name)
      .then(returnedPersons => {
        setPersons(returnedPersons)
        setNotificationClass('removed')
        setNotificationMessage(`Removed ${name}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)})
      .catch(error => {
          setNotificationClass('error')
          setNotificationMessage(`Information of ${name} has already been removed from server`)
          setPersons(persons.filter(p => p.id != id))
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
      
    }}

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  
  const handleFilterInput = (event) => {
    const searchFilter = event.target.value
    setNewFilter(searchFilter)
    const filtered = persons.filter((person) => 
    person.name.toLowerCase().includes(searchFilter.toLowerCase())
  )
    setFiltPersons(filtered)
  }

  useEffect(() => {
    const filtered = persons.filter(person => 
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    )
    setFiltPersons(filtered)
  }, [persons, newFilter])

  const Notification = ({message}) => {
    if (message === null) {
      return null
    }
    return (
      <div className={notificationClass}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage} notificationClass={notificationClass} />
        <FilterForm newFilter={newFilter} handleFilterInput={handleFilterInput} />

      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} 
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newNumber={newNumber} />
    
      <h2>Numbers</h2>
        <Persons persons={filtPersons} remove={removePerson}/>
      
    </div>
  )

}

export default App


