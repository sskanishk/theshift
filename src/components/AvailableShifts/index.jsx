import moment from "moment"
import { useEffect, useState } from "react"
import ShiftsGroup from "./shiftsGroup"
import useStore from '../../store/shift'

function AvailableShift({data}) {

	const shiftStore = useStore()
    const { availableShifts, getAvailableShiftsData } = shiftStore.shift

	// const defaultArea = Object.keys(availableShifts)[0]

	const [avaialbleShifts, setAvaialbleShifts] = useState(null)
	const [activeArea, setActiveArea] = useState()
	const [shiftsToPass, setShiftsToPass] = useState(null)


    useEffect(() => {
		// const response = groupByShiftFunc(data.filter((shift) => moment().valueOf() < shift.endTime))
		let r = getAvailableShiftsData()
		debugger
		console.log(r)
		console.log("availableShifts ", availableShifts)
		const defaultArea = Object.keys(availableShifts)[0]
		setAvaialbleShifts(availableShifts)
		setActiveArea(defaultArea)
		setShiftsToPass(availableShifts[defaultArea])
    }, [])


    const shiftAction = (shift, type) => {
		let bookStatus
		if(type === "cancel") { bookStatus = false }
		if(type === "book") { bookStatus = true }
        
		let updatedshift = avaialbleShifts[shift.area].shifts.map((foo) => {
            if(foo.date === moment(shift.startTime).format('L')) {
                return {
                    shifts: foo.shifts.map((bar) => {
                        if(bar.id === shift.id) {
                            bar.booked = bookStatus
                            return bar
                        }
                        return bar
                    }),
                    ...foo
                }
            }
            return foo
        })
        setAvaialbleShifts({
            ...avaialbleShifts, 
            [shift.area]: { 
                shifts: updatedshift, 
                ...avaialbleShifts[shift.area]
            } 
        })
    }

	return (
        <>
            <AreaFilter 
				availableShifts={availableShifts} 
				activeArea={activeArea} 
				setActiveArea={setActiveArea} 
				setShiftsToPass={setShiftsToPass}
			/>
			{
				shiftsToPass?.shifts
				? 
					shiftsToPass.shifts.map((shift, i) => {
						return <ShiftsGroup item={shift} shiftAction={shiftAction} key={`sg${i}`}/>
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
    // debugger
	return data.find((shift) => {
		if(shift.endTime > currentShift.startTime && shift.startTime < currentShift.endTime) {
			return true
		}
		return false
	})
}


export default AvailableShift