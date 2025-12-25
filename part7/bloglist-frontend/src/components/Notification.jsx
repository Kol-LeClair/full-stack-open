import { useSelector } from 'react-redux'

const Notification = ({ isError }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const message = useSelector(state => state.notification)

  if (message === '') {
    return null
  }

  if (isError === true) {
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification