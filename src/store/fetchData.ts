import {fetchDataSuccess, fetchDataError} from './actions/actions'
import {Dispatch} from 'redux'
import historyDataAPI from '../API/historyData.json'
import dailyDataAPI from '../API/dailyData.json'
import {IAPI} from '../layout/App'

const fetchData = () => {
    return async (dispatch: Dispatch) => {
        try {
            const historyData: IAPI = historyDataAPI
            const dailyData: IAPI = dailyDataAPI
            dispatch(fetchDataSuccess(historyData, dailyData))
        } catch (e) {
            dispatch(fetchDataError(e))
        }
    }
}

export default fetchData
