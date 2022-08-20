import moment from "moment"
import { useEffect, useState } from "react"
import ShiftsGroup from "./shiftsGroup"

function AvailableShift({data}) {

	const [avaialbleShifts, setAvaialbleShifts] = useState(null)
	const [activeArea, setActiveArea] = useState(null)
	const [shiftsToPass, setShiftsToPass] = useState(null)



    useEffect(() => {
		const response = groupByShiftFunc(data.filter((shift) => moment().valueOf() < shift.endTime))
		const defaultArea = Object.keys(response)[0]
		setAvaialbleShifts(response)
		setActiveArea(defaultArea)
		setShiftsToPass(response[defaultArea])
    }, [])

    const bookshift = (shift) => {
        let updatedshift = avaialbleShifts[shift.area].shifts.map((i) => {
            if(i.date === moment(shift.startTime).format('L')) {
                return {
                    shifts: i.shifts.map((s) => {
                        if(s.id === shift.id) {
                            s.booked = true
                            return s
                        }
                        return s
                    }),
                    ...i
                }
            }
            return i
        })
        setAvaialbleShifts({
            ...avaialbleShifts, 
            [shift.area]: { 
                shifts: updatedshift, 
                ...avaialbleShifts[shift.area]
            } 
        })

        console.log("alice", findOverlappedShift(data, shift))
    }

	return (
        <>
            <AreaFilter 
				avaialbleShifts={avaialbleShifts} 
				activeArea={activeArea} 
				setActiveArea={setActiveArea} 
				setShiftsToPass={setShiftsToPass}
			/>
			{
				shiftsToPass?.shifts
				? 
					shiftsToPass.shifts.map((shift, i) => {
						return <ShiftsGroup item={shift} bookshift={bookshift} key={`sg${i}`}/>
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
                ? Object.keys(avaialbleShifts).map((area, i) => {
                    return (
                        <h2 
							onClick={handleAreaFilter} 
							title={area}
							className={area === activeArea ? "shift__active_area" : ""}
                            key={`af${i}`}
						>
							{area}&nbsp;({avaialbleShifts[area].count})
						</h2>
                    )
                })
				: null
            }
        </div>
    )
}




const groupByShiftFunc = (data) => {
    // Filter upcoming shifts and skipping passed shifts
	const groups = data.reduce((groups, shift) => {
		if(!groups[shift.area]) {
			groups[shift.area] = {
				area: shift.area,
				count: 0,
				shifts: []
			}
		}
		// groups[shift.area].overlapped = findOverlappedShift(data, shift)
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

const findOverlappedShift = (data,currentShift) => {
    debugger
	return data.find((shift) => {
		if(shift.endTime > currentShift.startTime && shift.startTime < currentShift.endTime) {
			return true
		}
		return false
	})
}


export default AvailableShift