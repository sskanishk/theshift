import moment from "moment"
import { useEffect, useState } from "react"
import NoResultFound from "./NoResultFound"
import ShiftGroup from "./MyShifts/ShiftGroup"

function MyShifts({data}) {

    const [myShifts, setMyShifts] = useState(null)

    useEffect(() => {
        const temp = groupByDateFunc(data.filter((dt) => dt.booked))
		setMyShifts(temp)
    },[])

	const cancelshift = (shift) => {
		// debugger
		let updatedMyShift = myShifts.map((i) => {
            if(i.date === moment(shift.startTime).format('L')) {
                return {
                    shifts: i.shifts.map((s) => {
                        if(s.id === shift.id) {
                            s.booked = false
                            return s
                        }
                        return s
                    }),
                    ...i
                }
            }
            return i
        })
		// debugger
		setMyShifts(updatedMyShift)
	}

    return (
        <>
        {
            myShifts && myShifts.length > 0
            ? myShifts.map((obj) => {
                return <ShiftGroup item={obj} cancelshift={cancelshift} />
            })
            : <NoResultFound />
        }
        </>
    )
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

export default MyShifts