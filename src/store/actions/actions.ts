import {IAPI} from '../../layout/App'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR'

export interface IAction {
    type: string
}

interface ISuccessAction extends IAction {
    historyData: IAPI
    dailyData: IAPI
}

interface IErrorAction extends IAction {
    error: any
}

export const fetchDataSuccess = (historyData: IAPI, dailyData: IAPI): ISuccessAction => {
    return {
        type: FETCH_DATA_SUCCESS,
        dailyData,
        historyData,
    }
}

export const fetchDataError = (error: any): IErrorAction => {
    return {
        type: FETCH_DATA_ERROR,
        error: error,
    }
}
