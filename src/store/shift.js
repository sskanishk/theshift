import create from 'zustand'
// import { immer } from 'zustand/middleware/immer'


const useStore = create((set, get) => ({

    navigation: {
        
        tabs: [
            { id: "my-shift", title: "My Shift", isActive: true },
            { id: "avaialble-shift", title: "Avaialble Shift", isActive: false }		
        ],

        setTabs: (newTabState) => {
            // console.log("tabsbatte", newTabState)
            set((state) => ({
                navigation: {
                    ...state.navigation,
                    tabs: newTabState
                }
            }))
        }
    
    }

}))

export default useStore


