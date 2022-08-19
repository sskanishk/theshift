import { useEffect, useState } from 'react'
import './App.css'
import ShiftRow from './components/ShiftRow'

const API_URL = import.meta.env.VITE_BASE_API_URL

function App() {

	const [data, setData] = useState(null)
	const [groupData, setGroupData] = useState(null)
	const [area, setArea] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${API_URL}/shifts`)
			const data = await response.json()
			setData(data)
			getDistinctArea(data)
			groupByDate(data)
		}
		const groupByDate = (data) => {
			const groups = data.reduce((groups, slot) => {
				const date = new Date(slot.startTime).toLocaleDateString()
				if (!groups[date]) {
					groups[date] = []
				}
				groups[date].push(slot)
				return groups
			}, {})

			const groupArrays = Object.keys(groups).map((date) => {
				return {
					date,
					slots: groups[date]
				}
			})
			setGroupData(groupArrays)
			console.log("groupArrays ", groupArrays)
		}
		const getDistinctArea = (data) => {
			let area = data.map((slot) => slot.area)
			area = new Set(area)
			setArea(area)
		}
		fetchData()
	}, [])

	console.log(`${API_URL}/shifts`)
	return (
		<div className="App">
			{
				groupData
				? groupData.map((item, i) => {
					return (
						<div key={`item${i}`}>
							<ShiftRow item={item} />
						</div>
					)
				})
				: <h3>No group data</h3>
			}
			{
				data
				? data.map((item, i) => {
					return (
						<div key={i}>
							{new Date(item.startTime).toLocaleDateString()}
							{"  ---  "}
							{new Date(item.endTime).toLocaleDateString()}
							{"  ---  "}
							{i+1}
							{"  ---  "}
							{item.endTime}
						</div>
					)
				})
				: <h2>nothing</h2>
			}
		</div>
	)
}

export default App
