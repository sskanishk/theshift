import create from 'zustand'
import ApiActions from '../actions/ApiActions'

import { groupByDateMyshifts, groupByAreaAvailableShifts, liveShifts, bookedShifts } from './services'


const initialState = {
    data: [],
    loading: false,
    error: "",
}

const useStore = create((set, get) => ({

    shift: {

        shiftData: initialState.data,
        loading: initialState.loading,
        error: initialState.error,
        availableShifts: {},
        myShifts: [],

        setShifts: (newShiftData) => {
            set((state) => ({
                shift: {...state.shift, shiftData: newShiftData}
            }))
        },

        fetchShifts: async () => {
            
            // start loading
            set((state) => ({
                shift: {...state.shift, loading: true}
            }))

            try {

                // getting response
                let response = await ApiActions.getShifts()

                // sorting response
                response = response.sort((a,b) => a.startTime - b.startTime)

                // set response
                set((state) => ({
                    shift: {...state.shift, shiftData: response, error: "", loading: false}
                }))

            } catch (error) {
                
                // set error if catch
                set((state) => ({
                    shift: {...state.shift, error: error.message, loading: false}
                }))

            }
        },

        getAvailableShiftsData: () => {
            // get Shift Data from store
            const shiftData = get().shift.shiftData

            // get ongoing or live shifts data
            const liveShiftData = liveShifts(shiftData)
    
            // modify data for available shifts
            const availableShifts = groupByAreaAvailableShifts(liveShiftData)

            debugger
            // set available shift data
            set((state) => ({
                shift: {...state.shift, availableShifts: availableShifts}
            }))

            debugger
            console.log(get().shift.availableShifts)
        },

        getMyShiftData: () => {
            // get Shift Data from store
            const shiftData = get().shift.shiftData

            // get only booked shifts
            const bookedShiftsData = bookedShifts(shiftData)
    
            // modify data for my-shifts
            const myShifts = groupByDateMyshifts(bookedShiftsData)

            // set available shift data
            set((state) => ({
                shift: {...state.shift, myShifts: myShifts}
            }))
        },

    }

}))

export default useStore


