import { useEffect, useState } from 'react'
import MyShifts from './components/MyShifts'
import NavigationTabs from './components/NavigationTabs'
import AvailableShift from './components/AvailableShifts'
import useStore from './store'
// import datalocal from "../data.json"


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

	const [tabState, setTabState] = useState(defaultTabState)

	const shiftStore = useStore()
	const { shiftData, fetchShifts } = shiftStore.shift

	useEffect(() => {
		fetchShifts()
	}, [])

	return (
		<div className="app__container">
			{tabState && <NavigationTabs tabState={tabState} setTabState={setTabState} />}
			<div className="app__wrapper">
				<div className="app__navigation">
					<div className="shift__wrapper">
						{
							tabState && tabState.map((i) => {
								if (i.isActive) {
									return i.component(shiftData)
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
