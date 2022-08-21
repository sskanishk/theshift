import moment from "moment"

// Groupby date, data for MyShift 
export const groupByDateMyshifts = (data) => {
	const groups = data.reduce((groups, shift) => {
		const date = moment(shift.startTime).format('L')
		if (!groups[date]) {
			groups[date] = {
				shifts: [],
				totalDuration: 0
			}
		}
		shift.duration = Math.abs(shift.startTime - shift.endTime) / 36e5  // Convert in hours
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


// Groupby area, data for AvailableShifts 
export const groupByAreaAvailableShifts = (data) => {
    // Filter upcoming shifts and skipping passed shifts
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

	const groupByArea = {}

	Object.keys(groups).forEach((area) => {
		groupByArea[area] = {
			area,
			count: groups[area].count,
			shifts: groupByDateAvailableShifts(groups[area].shifts)
		}
	})

	return groupByArea
}


// Groupby date, data for AvailableShifts 
export const groupByDateAvailableShifts = (data) => {
	const groups = data.reduce((groups, shift) => {
		const date = moment(shift.startTime).format('L')
		if (!groups[date]) {
			groups[date] = {
				shifts: [],
				totalDuration: 0
			}
		}
		shift.duration = Math.abs(shift.startTime - shift.endTime) / 36e5  // Convert in hours
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


// Filter ongoing shifts and skip old/passed shift
export const liveShifts = (data) => {
    return data.filter((shift) => moment().valueOf() < shift.endTime)
}


// Filter only booked shifts
export const bookedShifts = (data) => {
    return data.filter((dt) => dt.booked)
}


// Update shifts
export const updateBookStatus = (data, shift, newStatus) => {
	let newShiftData = data.map((foo) => {
		if(foo.date === moment(shift.startTime).format('L')) {
			return {
				shifts: foo.shifts.map((bar) => {
					if(bar.id === shift.id) {
						bar.booked = newStatus
						return bar
					}
					return bar
				}),
				...foo
			}
		}
		return foo
	})
	return newShiftData
} 