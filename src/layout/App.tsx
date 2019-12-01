import React from 'react'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import _ from 'lodash'
import {connect} from 'react-redux'
import {bindActionCreators, Dispatch} from 'redux'
import fetchDataAction from '../store/fetchData'
import styles from './styles.module.scss'

export interface IAPI {
    [date: string]: TDate
}

type TDate = {
    open: string
    close: string
    high: string
    low: string
    volume: string
}

interface IState {
    data: TDataItem[]
    min: number
    max: number
}

type TDataItem = {
    date: string
    price: string
}

interface IProps {
    fetchData?: any
    historyData?: any
    dailyData?: any
}

class App extends React.Component<IProps, IState> {
    state: IState = {
        data: [],
        min: 0,
        max: 0,
    }

    handleClick = async (e: React.MouseEvent | null) => {
        const {historyData, dailyData} = this.props
        let value: string
        if (e !== null) {
            value = (e!.target as HTMLButtonElement).value
        } else {
            value = 'year'
        }
        let data: IAPI
        switch (value) {
            case 'day': {
                data = dailyData
                break
            }
            case 'month': {
                // 21 is average number of working days per month
                const rawData: IAPI = {}
                Object.keys(historyData)
                    .reverse()
                    .slice(-21)
                    .reverse()
                    .forEach((date: string) => {
                        rawData[date] = historyData[date]
                    })
                data = rawData
                break
            }
            case 'year': {
                data = historyData
                break
            }
            default: {
                data = historyData
                break
            }
        }
        const normalizedData: TDataItem[] = []
        for (const key in data) {
            const stateObject = {
                date: key,
                price: data[key]['open'],
            }
            normalizedData.push(stateObject)
        }
        const max = _.maxBy(normalizedData, obj => parseInt(obj.price))
        const min = _.minBy(normalizedData, obj => parseInt(obj.price))
        this.setState({data: normalizedData.reverse(), max: parseFloat(max!.price), min: parseFloat(min!.price)})
    }

    async componentDidMount() {
        await this.props.fetchData()
        this.handleClick(null)
    }

    render() {
        const {data, min, max} = this.state
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2>NYSE: SNAP</h2>
                </header>
                <ResponsiveContainer width={'90%'} height={'70%'}>
                    <LineChart width={800} height={500} data={data} margin={{right: 10, left: -10}}>
                        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis dataKey="price" domain={[Math.floor(min * 100) / 100, Math.floor(max * 100) / 100]} />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `${value} USD`,
                                name[0].toUpperCase() + name.slice(1),
                            ]}
                            labelFormatter={(label: string) => `Date: ${label}`}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className={styles.buttonSet}>
                    <button onClick={event => this.handleClick(event)} value={'year'} className={styles.button}>
                        1 year
                    </button>
                    <button onClick={event => this.handleClick(event)} value={'month'} className={styles.button}>
                        1 month
                    </button>
                    <button onClick={event => this.handleClick(event)} value={'day'} className={styles.button}>
                        1 day
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({dataStore: {historyData, dailyData}}: any) => ({historyData, dailyData})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({fetchData: fetchDataAction}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
