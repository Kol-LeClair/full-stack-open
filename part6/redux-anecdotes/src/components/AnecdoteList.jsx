import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

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
                            dispatch(setNotification(`You voted '${anecdote.content}'`))
                            setTimeout(() => {
                                dispatch(removeNotification())
                            }, 5000)
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