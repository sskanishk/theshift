import moment from "moment"

function ShiftGroup({item, cancelshift}) {
    console.log("Render", item)
    return (
        <div className="shift__group">
            <ShiftHeader date={item.date} totalDuration={item.totalDuration} shiftCount={item?.shifts?.length} />
            {
                item && item.shifts ?
                item.shifts.map((slot, i) => {
                    let liveShift = slot.startTime > moment().valueOf() && moment().valueOf() > slot.endTime
                    return (
                        <div key={`sh${i}`} className="shift__data shift__row">
                            <div>
                                <SlotTime startTime={slot.startTime} endTime={slot.endTime}/>
                                <Area areaName={slot.area} />
                            </div>
                            <Button 
                                title={slot.booked ? "Cancel" : "Book"} 
                                className={`${slot.booked ? "cancel" : "book"} ${liveShift ? "disable" : ""}`}
                                disabled={liveShift}
                                onClick={() => cancelshift(slot)}
                            />
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

const Area = ({areaName}) => {
    return (
        <h2 className="shift__area">
            {areaName}
        </h2>
    )
}

const ShiftHeader = ({ date, totalDuration, shiftCount }) => {
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
            <h5>{shiftCount} shifts,&nbsp;</h5>
            <h5>{totalDuration} hrs</h5>
        </div>
    )
}

const Button = ({title, className, disable, onClick}) => {

    return (
        <button className={className} disabled={disable} onClick={onClick}>{title}</button>
    )
    
}

export default ShiftGroup