import { useEffect } from "react"
import NoResultFound from "../NoResultFound"
import ShiftsGroup from "./shiftsGroup"
import useStore from '../../store'
import shallow from 'zustand/shallow'


function MyShifts() {

    const shiftStore = useStore(state => state.shift, shallow)
    const { myShifts, fetchMyShiftData } = shiftStore

    useEffect(() => {
        fetchMyShiftData()
    }, [])

    return (
        <>
            {
                myShifts && myShifts.length > 0
                    ? myShifts.map((obj, i) => {
                        return <ShiftsGroup item={obj} key={`$shift${i}`} />
                    })
                    : <NoResultFound />
            }
        </>
    )
}

export default MyShifts