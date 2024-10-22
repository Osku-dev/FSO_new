import { setFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  const handleFilterChange = (event) => {
    dispatch(setFilter (event.target.value));
  };
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleFilterChange} />
    </div>
  )
}

export default VisibilityFilter