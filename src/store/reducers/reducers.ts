import {FETCH_DATA_SUCCESS, FETCH_DATA_ERROR, IAction} from '../actions/actions'

const initialState = {
    dailyData: [],
    historyData: [],
    error: null,
}

const dataReducer = (state = initialState, {type, ...payload}: IAction) => {
    switch (type) {
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                ...payload,
            }
        case FETCH_DATA_ERROR:
            return {
                ...state,
                ...payload,
            }
        default:
            return state
    }
}
export default dataReducer
