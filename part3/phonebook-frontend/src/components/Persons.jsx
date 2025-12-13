const Persons = ({ personsToShow, removePerson }) => {
    return (
        <div>
            {personsToShow.map(person => 
                <div 
                    key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person.id)}>delete</button> 
                </div>
            )}
        </div>
    )
}

export default Persons