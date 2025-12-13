import { useState, useEffect } from 'react'

import './index.css'

import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = search === '' 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())) 

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm((`${newName} is already added to phonebook, replace the old number with a new one?`))) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name === newName ? returnedPerson : person))
            setNewName('')
            setNewNumber('')

            setMessage(`Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`)
            setTimeout(() => {
            setMessage(null)
          }, 3000)
          })
          .catch(error => {
            setIsError(true)
            setMessage(`Information of ${person.name} has already been removed from server`)
            setPersons(persons.filter(person => person.name != newName))
            setTimeout(() => {
              setMessage(null)
              setIsError(false)
            }, 3000)
          })
      }
    } else {   
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  const removePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      personService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id != id))
        })
    }
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleSearchChange = event => setSearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError} />
      <Filter handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        personsToShow={personsToShow}
        removePerson={removePerson} 
      />
    </div>
  )
}

export default App