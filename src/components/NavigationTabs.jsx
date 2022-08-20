// import { useState } from "react"
// import useStore from "../store/shift"

function NavigationTabs({tabState, setTabState}) {

	// const defaultTabState = [
	// 	{
	// 		id: "my-shift",
	// 		title: "My Shift",
	// 		isActive: true
	// 	},
	// 	{
	// 		id: "avaialble-shift",
	// 		title: "Avaialble Shift",
	// 		isActive: false
	// 	}		
	// ]

	// const [ tabState, setTabState ] = useState(defaultTabState)

	const handleNavigation = (e) => {
		const newTabState = tabState.map((tab) => {
			if(tab.id === e.target.id) {
				tab.isActive = true
				return tab
			}
			tab.isActive = false
			return tab
		})
		setTabState(newTabState)

		if(e.target.id === "my-shift") {
			console.log("x","my-shift")
		}
		if(e.target.id === "avaialble-shift") {
			console.log("x","avaialble-shift")
		}
		console.log("Tabsstate ", tabState)
	}


	return (
		<div className="shift__navigation" onClick={handleNavigation}>
			{
				tabState.map((tab) => {
					// console.log("tab", tab)
					return (
						<h1 
							id={tab.id} 
							key={tab.id} 
							className={tab.isActive ? "tab__active" : ""}
						>
						{tab.title}
						</h1>
					)
				})
			}
		</div>
	)
}


export default NavigationTabs