import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = (newAnecdote) => {
  if (newAnecdote.content.length < 5) {
    throw new Error("Content must be at least 5 characters long.");
  }
  return axios.post(baseUrl, newAnecdote).then(res => res.data);
};

export const updateVote = anecdote =>
    axios.put(`${baseUrl}/${anecdote.id}`, anecdote).then(res => res.data)