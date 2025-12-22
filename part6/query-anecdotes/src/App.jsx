import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer } from 'react'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      const message = action.payload
      return message
    case 'REMOVE_NOTIFICATION':
      return ''
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  
  const queryClient = useQueryClient()
  
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: `You voted for '${anecdote.content}'` })
    setTimeout(() => {
          notificationDispatch({ type: 'REMOVE_NOTIFICATION' })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    // refetchOnWindowFocus: false
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification notification={notification} />
      <AnecdoteForm notificationDispatch={notificationDispatch} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
