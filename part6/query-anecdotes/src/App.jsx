import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from './services/requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotification } from './NotificationContext';

const App = () => {

  const queryClient = useQueryClient()
  const { setNotification } = useNotification();

  const updateAnecdoteMutation = useMutation(
    {mutationFn: updateVote,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    setNotification(`You voted: '${anecdote.content}'`, 5);
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })
  

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      
      {result.isLoading ? (
        <p>Loading...</p>
      ) : result.isError ? (
        <p>Anecdote service not available due to problems in server</p>
      ) : (
        <>
          <Notification />
          <AnecdoteForm />
          {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
