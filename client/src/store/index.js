import create from 'zustand'
import ApiActions from '../actions/ApiActions'
import { devtools } from 'zustand/middleware'


import { 
    groupByDateMyshifts, 
    groupByAreaAvailableShifts, 
    liveShifts, 
    bookedShifts,
} from './services'


const initialState = {
    data: [],
    loading: false,
    error: "",
    loadingId: ""
}

const useStore = create((set, get) => ({

    shift: {

        shiftData: initialState.data,
        loading: initialState.loading,
        error: initialState.error,
        availableShifts: {},
        activeArea: "",
        activeAreaData: [],
        myShifts: [],

        setShifts: (newShiftData) => {
            set((state) => ({
                shift: {...state.shift, shiftData: newShiftData}
            }))
        },

        fetchShifts: async () => {
            
            // start loading
            set((state) => ({
                shift: {...state.shift}
            }))

            try {

                // getting response
                let response = await ApiActions.getShifts()

                // debugger
                // sorting response
                response = response.sort((a,b) => a.startTime - b.startTime)

                // set response
                set((state) => ({
                    shift: {...state.shift, shiftData: response}
                }))

            } catch (error) {
                
                // set error if catch
                set((state) => ({
                    shift: {...state.shift, error: error.message}
                }))

            }
        },

        fetchAvailableShiftsData: () => {
            // get Shift Data from store
            const shiftData = get().shift.shiftData
            // debugger
            // get ongoing or live shifts data
            const liveShiftData = liveShifts(shiftData)
    
            // modify data for available shifts
            const availableShifts = groupByAreaAvailableShifts(liveShiftData)

            const defaultArea = Object.keys(availableShifts)[0]

            // set available shift data
            set((state) => ({
                shift: {
                    ...state.shift,
                    availableShifts: availableShifts,
                    activeArea: defaultArea,
                    activeAreaData: availableShifts[defaultArea]
                }
            }))
        },

        setActiveArea: (newArea) => {
            set((state) => ({
                shift: {
                    ...state.shift,
                    activeArea: newArea,
                }
            }))
        },

        setActiveAreaData: (newActiveAreaData) => {
            set((state) => ({
                shift: {
                    ...state.shift,
                    activeAreaData: newActiveAreaData,
                }
            }))
        },

        fetchMyShiftData: async () => {

            await get().shift.fetchShifts()

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

        updateShift: async (shiftToBeUpdate, type) => {

            // start loading
            set((state) => ({
                shift: {...state.shift, loading: true, loadingId: shiftToBeUpdate.id}
            }))

            let resp
            if(type === "cancel") { 
                resp = await ApiActions.cancelShift(shiftToBeUpdate.id)
            }
            if(type === "book") { 
                resp = await ApiActions.bookShift(shiftToBeUpdate.id)
            }

            // getting response
            let response = await ApiActions.getShifts()

            // sorting response
            response = response.sort((a,b) => a.startTime - b.startTime)

            // get ongoing or live shifts data
            const liveShiftData = liveShifts(response)
                
            // modify data for available shifts
            const availableShifts = groupByAreaAvailableShifts(liveShiftData)

            // get only booked shifts
            const bookedShiftsData = bookedShifts(response)

            // modify data for my-shifts
            const myShifts = groupByDateMyshifts(bookedShiftsData)

            // set available shift data
            set((state) => ({
                shift: {
                    ...state.shift,
                    loading: false,
                    loadingId: "",
                    shiftData: response,
                    availableShifts: availableShifts,
                    activeAreaData: availableShifts[shiftToBeUpdate.area],
                    myShifts: myShifts
                }
            }))

            return resp
        },

        cancelShift: async (shiftToBeCancel) => {
            
            // start loading
            set((state) => ({
                shift: {...state.shift, loading: true, loadingId: shiftToBeCancel.id}
            }))

            let resp = await ApiActions.cancelShift(shiftToBeCancel.id)

            // getting response
            let response = await ApiActions.getShifts()

            // sorting response
            response = response.sort((a,b) => a.startTime - b.startTime)

            // get only booked shifts
            const bookedShiftsData = bookedShifts(response)

            // modify data for my-shifts
            const myShifts = groupByDateMyshifts(bookedShiftsData)

            // get ongoing or live shifts data
            const liveShiftData = liveShifts(response)
                
            // modify data for available shifts
            const availableShifts = groupByAreaAvailableShifts(liveShiftData)

            // set available shift data
            set((state) => ({
                shift: {
                    ...state.shift,
                    loading: false,
                    loadingId: "",
                    shiftData: response,
                    myShifts: myShifts,
                    availableShifts: availableShifts,
                    activeAreaData: availableShifts[shiftToBeCancel.area],
                }
            }))

            return resp
        }
    }
}))

export default useStore


