import { createSlice } from "@reduxjs/toolkit"
import { useReducer } from "react"

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        logoutUser(state, action) {
            return null
        }
    }
})

const { setUser, logoutUser } = userSlice.actions

export const initializeUser = (user) => {
    return async (dispatch) => {
        dispatch(setUser(user))
    }
}

export const logoutTheUser = () => {
    return async(dispatch) => {
        dispatch(logoutUser())
    }
}

export default userSlice.reducer