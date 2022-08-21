import { useEffect } from "react"
import NoResultFound from "../NoResultFound"
import ShiftsGroup from "./shiftsGroup"
import useStore from '../../store/shift'


function MyShifts() {

    const shiftStore = useStore(state => state.shift)
    const { myShifts, getMyShiftData } = shiftStore

    useEffect(() => {
        getMyShiftData()
    },[])

    return (
        <>
        {
            myShifts && myShifts.length > 0
            ? myShifts.map((obj, i) => {
                return <ShiftsGroup item={obj} key={`$shift${i}`}/>
            })
            : <NoResultFound />
        }
        </>
    )
}

export default MyShifts