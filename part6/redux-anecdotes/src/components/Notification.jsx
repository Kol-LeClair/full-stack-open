import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from "../reducers/notificationReducer"

const Notification = () => {
  const message = useSelector(state => state.notification)
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <>{(message != '') && <div style={style}>{message}</div>}</>
}

export default Notification
