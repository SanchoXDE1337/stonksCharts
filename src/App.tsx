import React from 'react'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

type TDataItem = {
    date: string
    price: string
}

interface IState {
    data: TDataItem[]
    min: number
    max: number
}

interface IProps {
}

class App extends React.Component<IProps, IState> {
    state: IState = {
        data: [],
        min: 0,
        max: 0,
    }

    async componentDidMount() {
        this.handleClick(null)
    }

    handleClick = async (e: React.MouseEvent | null) => {
        let value: string
        if (e !== null) {
            value = (e!.target as HTMLButtonElement).value
        } else {
            value = 'year'
        }
        const now = moment().format('YYYY-MM-DD')
        let ago = ''
        let data = []
        let isDay = false
        switch (value) {
            case 'day': {
                data = (
                    await axios(
                        ` https://intraday.worldtradingdata.com/api/v1/intraday?symbol=SNAP&range=1&interval=5&api_token=cV3MvyhjBa4gKqe2h5ewCT39tqMuWrAPrfBVCoKHiLuSIq0WZSRfQgczdC9D`,
                    )
                ).data.intraday
                isDay = true
                break
            }
            case 'month': {
                ago = moment()
                    .subtract(1, 'months')
                    .format('YYYY-MM-DD')
                break
            }
            case 'year': {
                ago = moment()
                    .subtract(1, 'years')
                    .format('YYYY-MM-DD')
                break
            }
            default:
                ago = moment()
                    .subtract(1, 'years')
                    .format('YYYY-MM-DD')
        }
        const normalizedData: TDataItem[] = []
        if (!isDay) {
            data = (
                await axios(
                    `https://api.worldtradingdata.com/api/v1/history?symbol=SNAP&sort=newest&api_token=cV3MvyhjBa4gKqe2h5ewCT39tqMuWrAPrfBVCoKHiLuSIq0WZSRfQgczdC9D&date_from=${ago}&date_to=${now}`,
                )
            ).data
            for (const key in data.history) {
                const stateObject = {
                    date: key,
                    price: data.history[key]['open'],
                }
                normalizedData.push(stateObject)
            }
        } else {
            for (const key in data) {
                const stateObject = {
                    date: key,
                    price: data[key]['open'],
                }
                normalizedData.push(stateObject)
            }
        }
        const max = _.maxBy(normalizedData, obj => parseInt(obj.price))
        const min = _.minBy(normalizedData, obj => parseInt(obj.price))
        this.setState({data: normalizedData.reverse(), max: parseFloat(max!.price), min: parseFloat(min!.price)})
    }

    render() {
        const {data, min, max} = this.state
        return (
            <div>
                <LineChart width={800} height={700} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                    <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <XAxis dataKey="date"/>
                    <YAxis
                        dataKey="price"
                        domain={[Math.floor((min) * 100) / 100, Math.floor((max) * 100) / 100]}
                    />
                    <Tooltip/>
                </LineChart>
                <div>
                    <button onClick={event => this.handleClick(event)} value={'year'}>
                        1 year
                    </button>
                    <button onClick={event => this.handleClick(event)} value={'month'}>
                        1 month
                    </button>
                    <button onClick={event => this.handleClick(event)} value={'day'}>
                        1 day
                    </button>
                </div>
            </div>
        )
    }
}

export default App
