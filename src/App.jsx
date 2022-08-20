import { useEffect, useState } from 'react'
import moment from 'moment'
import MyShift from './components/MyShift'
import NavigationTabs from './components/NavigationTabs'
import AvailableShift from './components/AvailableShifts'

import datalocal from "../data.json"
import ShiftContainer from './components/ShiftContainer'

const API_URL = import.meta.env.VITE_BASE_API_URL

function App() {

	const defaultTabState = [
		{
			id: "my-shift",
			title: "My Shift",
			isActive: true,
			component: (x) => <MyShift data={x} key="my-shift" />
		},
		{
			id: "avaialble-shift",
			title: "Avaialble Shift",
			isActive: false,
			component: (x) => <AvailableShift data={x} key="avaialble-shift" />
		}		
	]

	// console.log("org", datalocal)
	// console.log("sort ", datalocal.sort((a,b) => a.startTime - b.startTime))
	const [data, setData] = useState(datalocal)
	// const [data, setData] = useState(datalocal.sort((a,b) => a.startTime - b.endTime))
	const [groupData, setGroupData] = useState(null)
	const [areaList, setAreaList] = useState(null)
	const [ tabState, setTabState ] = useState(defaultTabState)


	useEffect(() => {
		const fetchData = async () => {
			// const response = await fetch(`${API_URL}/shifts`)
			// const data = await response.json()
			const data = datalocal
			setData(data.sort((a,b) => a.startTime - b.startTime))
			// setAreaList(getDistinctArea(data))
			// setGroupData(groupShiftData(data).groupByShift)
			// setAreaList(groupShiftData(data).groupByArea)
		}
		fetchData()
	}, [])

	return (
		<div className="app__container">
			<NavigationTabs tabState={tabState} setTabState={setTabState} />
			<div className="app__wrapper">
				<div className="app__navigation">
					<div className="shift__wrapper">

					{
						tabState.map((i) => {
							if(i.isActive) {
								return i.component(data)
							}
						})
					}

					</div>
				</div>
			</div>
		</div>
	)
}


const groupShiftData = (data) => {
	const groupByArea = []
	const groups = data.reduce((groups, slot) => {
		const date = moment(slot.startTime).format('L')
		if (!groups[date]) {
			groups[date] = {
				shifts: [],
				totalDuration: 0
			}
		}
		slot.duration = Math.abs(slot.startTime - slot.endTime) / 36e5
		groups[date].totalDuration = slot.duration + groups[date].totalDuration
		groups[date].shifts.push(slot)
		
		if(!groupByArea[slot.area]) {
			groupByArea[slot.area] = {
				area: slot.area,
				count: 0
			}
		}
		groupByArea[slot.area].count = groupByArea[slot.area].count + 1
		return groups
	}, {})
	console.log("groupByArea ", groupByArea)
	const groupByShift = Object.keys(groups).map((date) => {
		return {
			date,
			totalDuration: groups[date].totalDuration,
			shifts: groups[date].shifts
		}
	})
	return { groupByShift, groupByArea }
}

const getDistinctArea = (data) => {
	let area = data.map((slot) => slot.area)
	area = new Set(area)
	// setAreaList([...area])
	return [...area]
}

export default App
