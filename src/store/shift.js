import create from 'zustand'
import ApiActions from '../actions/ApiActions'
import { devtools } from 'zustand/middleware'


import { 
    groupByDateMyshifts, 
    groupByAreaAvailableShifts, 
    liveShifts, 
    bookedShifts,
    updateBookStatus
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

        fetchAvailableShiftsData: () => {
            // get Shift Data from store
            const shiftData = get().shift.shiftData

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

        updateShift: (shiftToBeUpdate, type) => {

            // start loading
            set((state) => ({
                shift: {...state.shift, loading: true, loadingId: shiftToBeUpdate.id}
            }))

            setTimeout(() => {
                // get availableShifts data
                const availableShiftsData = get().shift.availableShifts

                let bookStatus
                if(type === "cancel") { bookStatus = false }
                if(type === "book") { bookStatus = true }

                let data = availableShiftsData[shiftToBeUpdate.area].shifts
                let updatedshift = updateBookStatus(data, shiftToBeUpdate, bookStatus)

                set((state) => ({
                    shift: {
                        ...state.shift,
                        loading: false,
                        loadingId: "",
                        availableShifts: {
                            ...state.shift.availableShifts, 
                            [shiftToBeUpdate.area]: { 
                                shifts: updatedshift, 
                                ...state.shift.availableShifts[shiftToBeUpdate.area]
                            } 
                        }
                    }
                }))
            }, 500)
            

        },

        cancelShift: (shiftToBeCancel) => {
            // start loading
            set((state) => ({
                shift: {...state.shift, loading: true, loadingId: shiftToBeCancel.id}
            }))

            setTimeout(() => {
                // get my-shift data
                const myShiftData = get().shift.myShifts

                let updatedshift = updateBookStatus(myShiftData, shiftToBeCancel, false)

                // set available shift data
                set((state) => ({
                    shift: {...state.shift, myShifts: updatedshift, loading:false, loadingId:""}
                }))
            }, 500)
        }
    }
}))

export default useStore


