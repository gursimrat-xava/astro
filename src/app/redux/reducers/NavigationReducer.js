import mainNavigations from 'app/navigations'
import { SET_USER_NAVIGATION } from '../actions/NavigationAction'

const initialState = [...mainNavigations.navigations]

const NavigationReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_USER_NAVIGATION: {
            return [...action.payload]
        }
        default: {
            return [...state]
        }
    }
}

export default NavigationReducer
