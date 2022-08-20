import { useEffect, useState } from 'react'
import MyShifts from './components/MyShifts'
import NavigationTabs from './components/NavigationTabs'
import AvailableShift from './components/AvailableShifts'
import datalocal from "../data.json"

const API_URL = import.meta.env.VITE_BASE_API_URL

function App() {

	const defaultTabState = [
		{
			id: "my-shift",
			title: "My Shift",
			isActive: true,
			component: (dt) => <MyShifts data={dt} key="my-shift" />
		},
		{
			id: "avaialble-shift",
			title: "Avaialble Shift",
			isActive: false,
			component: (dt) => <AvailableShift data={dt} key="avaialble-shift" />
		}		
	]

	const [data, setData] = useState(datalocal)
	const [ tabState, setTabState ] = useState(defaultTabState)


	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${API_URL}/shifts`)
			const data = await response.json()
			// const data = datalocal
			setData(data.sort((a,b) => a.startTime - b.startTime))
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

export default App
