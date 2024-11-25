import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ token, show, setErrorMessage }) => {
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const { loading, data } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0]?.message || 'An error occurred')
      setTimeout(() => setErrorMessage(""), 5000); 
    },
    onCompleted: () => {
      console.log('Author updated successfully!')
    },
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    if (selectedAuthor && birthYear) {
      editAuthor({ variables: { name: selectedAuthor, setBornTo: parseInt(birthYear) } })
      setSelectedAuthor('')
      setBirthYear('')
    } else {
      console.log('Both author and birth year must be provided.')
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <>
          <h2>Set Birthyear</h2>
          <form onSubmit={submit}>
            <div>
              <label>
                Author:
                <select
                  value={selectedAuthor}
                  onChange={({ target }) => setSelectedAuthor(target.value)}
                >
                  <option value="">Select author</option>
                  {data.allAuthors.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              Birthyear:
              <input
                type="number"
                value={birthYear}
                onChange={({ target }) => setBirthYear(target.value)}
              />
            </div>
            <button type="submit">Update Author</button>
          </form>
        </>
      )}
    </div>
  );
};
export default Authors