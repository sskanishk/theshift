import moment from "moment"
import { useEffect, useState } from "react"
import ShiftGroup from "./ShiftGroup"

function AvailableShift({data}) {

	const [avaialbleShifts, setAvaialbleShifts] = useState(null)
	const [activeArea, setActiveArea] = useState(null)
	const [shiftsToPass, setShiftsToPass] = useState(null)



    useEffect(() => {
		const response = groupByShiftFunc(data)
		const defaultArea = Object.keys(response)[0]
		setAvaialbleShifts(response)
		setActiveArea(defaultArea)
		setShiftsToPass(response[defaultArea])
    }, [])

	return (
        <>
            <AreaFilter 
				avaialbleShifts={avaialbleShifts} 
				activeArea={activeArea} 
				setActiveArea={setActiveArea} 
				setShiftsToPass={setShiftsToPass}
			/>
			{/* {
				avaialbleShifts
				? Object.keys(avaialbleShifts).map((area) => {
					if(avaialbleShifts[area].isActive) {
						avaialbleShifts[area].shifts.map((shiftGroupByDate) => {
							return <ShiftGroup item={shiftGroupByDate.shifts} />
						})
					}
				}) : null
			} */}
			{
				shiftsToPass?.shifts
				? 
					shiftsToPass.shifts.map((shift) => {
						return <ShiftGroup item={shift} />
					})
				
				: null
			}
        </>
    )
}

const AreaFilter = ({ avaialbleShifts, setShiftsToPass, activeArea, setActiveArea }) => {
	const handleAreaFilter = (e) => {
		setActiveArea(e.target.title)
		setShiftsToPass(avaialbleShifts[e.target.title])
	}
    return (
        <div className="shift__area_filter">
            {
				avaialbleShifts
                ? Object.keys(avaialbleShifts).map((area, id) => {
                    return (
                        <h2 
							onClick={handleAreaFilter} 
							title={area}
							className={area === activeArea ? "shift__active_area" : ""}
						>
							{area}({avaialbleShifts[area].count})
						</h2>
                    )
                })
				: null
            }
        </div>
    )
}




const groupByShiftFunc = (data) => {
	const groups = data.reduce((groups, shift) => {
		if(!groups[shift.area]) {
			groups[shift.area] = {
				area: shift.area,
				count: 0,
				shifts: []
			}
		}
		groups[shift.area].count = groups[shift.area].count + 1
		groups[shift.area].shifts.push(shift)
		return groups
	}, {})

	// const groupByArea = Object.keys(groups).map((area) => {
	// 	return {
	// 		area,
	// 		count: groups[area].count,
	// 		shifts: groupByDateFunc(groups[area].shifts)
	// 	}
	// })

	const groupByArea = {}

	Object.keys(groups).forEach((area) => {
		groupByArea[area] = {
			area,
			count: groups[area].count,
			shifts: groupByDateFunc(groups[area].shifts)
		}
	})

	return groupByArea
}

const groupByDateFunc = (data) => {
	const groups = data.reduce((groups, shift) => {
		const date = moment(shift.startTime).format('L')
		if (!groups[date]) {
			groups[date] = {
				shifts: [],
				totalDuration: 0
			}
		}
		shift.duration = Math.abs(shift.startTime - shift.endTime) / 36e5
		groups[date].totalDuration = shift.duration + groups[date].totalDuration
		groups[date].shifts.push(shift)
		return groups
	}, {})

	const groupByDate = Object.keys(groups).map((date) => {
		return {
			date,
			totalDuration: groups[date].totalDuration,
			shifts: groups[date].shifts
		}
	})

	return groupByDate
}


export default AvailableShift