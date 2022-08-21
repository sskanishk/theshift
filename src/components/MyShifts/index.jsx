import moment from "moment"
import { useEffect, useState } from "react"
import NoResultFound from "../NoResultFound"
import ShiftGroup from "./ShiftGroup"
import useStore from '../../store/shift'


function MyShifts({data}) {

    // const [myShifts, setMyShifts] = useState(null)

    const shiftStore = useStore()
    const { myShifts, getMyShiftData } = shiftStore.shift


    useEffect(() => {
        // const temp = groupByDateFunc(data.filter((dt) => dt.booked))
		// setMyShifts(temp)
        getMyShiftData()

    },[])

	const cancelshift = (shift) => {
		let updatedMyShift = myShifts.map((foo) => {
            if(foo.date === moment(shift.startTime).format('L')) {
                return {
                    shifts: foo.shifts.map((bar) => {
                        if(bar.id === shift.id) {
                            bar.booked = false
                            return bar
                        }
                        return bar
                    }),
                    ...foo
                }
            }
            return foo
        })
		// setMyShifts(updatedMyShift)
	}

    return (
        <>
        {
            myShifts && myShifts.length > 0
            ? myShifts.map((obj, i) => {
                return <ShiftGroup item={obj} cancelshift={cancelshift} key={`$shift${i}`}/>
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