import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification (state, action) {
            const message = action.payload
            return message
        },
        removeNotification (state, action) {
            return ''
        }
    }
})

const { setNotification, removeNotification } = notificationSlice.actions

export const addNotification = (message, time) => {
    return (dispatch) => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(removeNotification())
        }, time * 1000)
    }
}

export default notificationSlice.reducer