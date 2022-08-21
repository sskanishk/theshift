function NavigationTabs({tabState, setTabState}) {

	const handleNavigation = (e) => {
		if(e.target.nodeName !== "H1") {
			return
		}
		const newTabState = tabState.map((tab) => {
			if(tab.id === e.target.id) {
				tab.isActive = true
				return tab
			} else {
				tab.isActive = false
				return tab
			}
		})
		setTabState(newTabState)
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