import { useEffect } from "react"
import ShiftsGroup from "./shiftsGroup"
import useStore from '../../store'
import shallow from 'zustand/shallow'

function AvailableShift() {

	const shiftStore = useStore((state) => state.shift, shallow)

	const {
		availableShifts, fetchAvailableShiftsData,
		activeArea, setActiveArea,
		activeAreaData, setActiveAreaData
	} = shiftStore

	useEffect(() => {
		fetchAvailableShiftsData()
	}, [])

	return (
		<>
			<AreaFilter
				availableShifts={availableShifts}
				activeArea={activeArea}
				setActiveArea={setActiveArea}
				setActiveAreaData={setActiveAreaData}
			/>
			{
				activeAreaData?.shifts
					?
					activeAreaData.shifts.map((shift, i) => {
						return <ShiftsGroup item={shift} key={`sg${i}`} />
					})

					: null
			}
		</>
	)
}

const AreaFilter = ({ availableShifts, setActiveAreaData, activeArea, setActiveArea }) => {
	const handleAreaFilter = (e) => {
		setActiveArea(e.target.title)
		setActiveAreaData(availableShifts[e.target.title])
	}
	return (
		<div className="shift__area_filter">
			{
				availableShifts
					? Object.keys(availableShifts).map((area, i) => {
						return (
							<h2
								onClick={handleAreaFilter}
								title={area}
								className={area === activeArea ? "shift__active_area" : ""}
								key={`af${i}`}
							>
								{area}&nbsp;({availableShifts[area].count})
							</h2>
						)
					})
					: <h2>Something is missing</h2>
			}
		</div>
	)
}

export default AvailableShift