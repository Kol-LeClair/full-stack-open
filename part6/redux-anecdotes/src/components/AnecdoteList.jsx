import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({ anecdotes, filter }) => {
        if (filter === '') {
            return anecdotes
        }
        return anecdotes
            .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })
    const dispatch = useDispatch()

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={async () => {
                            dispatch(voteForAnecdote((anecdote)))
                            dispatch(addNotification(`You voted ${anecdote.content}`, 5))
                        }}>
                            vote
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList