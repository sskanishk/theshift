import moment from "moment"
import { useEffect } from "react"
// import Button from "../Button"

function ShiftsGroup({item, bookshift}) {
    return (
        <div className="shift__group">
            <ShiftHeader date={item.date} />
            {
                item && item.shifts ?
                item.shifts.map((slot, i) => {
                    // debugger
                    return (
                        <div key={`sh${i}`} className="shift__data shift__row">
                            <SlotTime startTime={slot.startTime} endTime={slot.endTime}/>
                            <div className="shift__booking_status">
                                    {
                                        !slot.booked && findOverlappedShift(item.shifts, slot) 
                                        ? <h3 id="overlap">Overlapping</h3> 
                                        : ""
                                    }
                                    {
                                        slot.booked
                                        ? <h3 id="booked">Booked</h3> 
                                        : ""
                                    }
                                <Button 
                                    title={slot.booked ? "Cancel" : "Book"}
                                    className={`${slot.booked ? "cancel" : "book"} ${!slot.booked && findOverlappedShift(item.shifts, slot) ? "disable" : ""}`}
                                    isDisabled={moment().valueOf() > slot.startTime || !slot.booked && findOverlappedShift(item.shifts, slot)}
                                    onClick={() => bookshift(slot)}
                                />
                            </div>
                        </div>
                    )
                })
                : null
            }
        </div>
    )
    
}

const SlotTime = ({ startTime, endTime }) => {
    return (
        <h2 className="shift__time">
            {`${moment(startTime).format("HH:mm")}-${moment(endTime).format("HH:mm")}`}
        </h2>
    )
}

const ShiftHeader = ({ date }) => {
    let headerDate = moment(date)
    let todayDate = moment()
    let tommorowDate = moment().add(1, 'days')
    let headerTitle
    if(headerDate.format('L') === todayDate.format('L')) {
        headerTitle = "Today"
    } else if(headerDate.format('L') === tommorowDate.format('L')) {
        headerTitle = "Tommorow"
    } else {
        headerTitle = moment(headerDate).format('MMMM Do')
    }

    return (
        <div className="shift__header shift__row">
            <h3 className="">{headerTitle}</h3>
        </div>
    )
}

const Button = ({title, className, isDisabled, onClick}) => {
    return (
        <button 
            className={className} 
            disabled={isDisabled} 
            onClick={onClick}
        >
            {title}
        </button>
    )
}

const findOverlappedShift = (data,shift) => {
    return !!data.filter(s => s.booked).find(s => s.startTime < shift.endTime && s.endTime > shift.startTime)
}


export default ShiftsGroup