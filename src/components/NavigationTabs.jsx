function NavigationTabs({tabState, setTabState}) {

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
		}
		if(e.target.id === "avaialble-shift") {
		}
	}


	return (
		<div className="shift__navigation" onClick={handleNavigation}>
			{
				tabState.map((tab) => {
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