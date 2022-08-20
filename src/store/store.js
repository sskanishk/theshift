import create from "zustand"

const useStore = create((set, get) => ({
  Imagine: {
    totalSeats: [],
    disabledSeats: [],
    booked: [],
    balcony: {
      cost: 200,
      seats: [],
    },
    normal: {
      cost: 100,
      seats: [],
    },
  },


  bookmyseat: {
    showName: "",
    showId: "",
    seatsToBook: 0,
    disabledSeats: [],
    availableSeats: [],
    bookedSeats: [],
    bookedSeatsPrice: [],
    finalSeatsObject: [],
    seatClass: [{
      seatClassName: "",
      endColumn: "",
      startColumn: "A",
      rows: "",
      cost: "",
      seats: []
    }],
    addDisabledSeats: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.bookmyseat, disabledSeats: newSate },
      }))
    },
    addBookedSeats: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.bookmyseat, bookedSeats: newSate },
      }))
    },
    addAvailableSeats: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.bookmyseat, availableSeats: newSate },
      }))
    },
    addSeatsToBook: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.bookmyseat, seatsToBook: newSate },
      }))
    },
    addSeatClass: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.bookmyseat, seatClass: newSate}
      }))
    },
    addShowName: (newSate) => {
      set((state) => ({
        bookmyseat: {...state.bookmyseat, showName: newSate}
      }))
    },
    addShowId: (newSate) => {
      set((state) => ({
        bookmyseat: {...state.bookmyseat, showId: newSate}
      }))
    },
    addBookedSeatsPrice: (newSate) => {
      set((state) => ({
        bookmyseat: {...state.bookmyseat, bookedSeatsPrice: newSate}
      }))
    },
  },

  masterdata: {
    shows: [],
    addShows: (newSate) => {
      set((state) => ({
        bookmyseat: { ...state.masterdata, shows: newSate },
      }))
    }
  },

  createSeats: {
    hall: [
      {
        sectionName: "",
        columnName: "",
        startColumn: "",
        rowCount: "",
      },
    ],
    addHall: (newSate) => {
      set((state) => ({
        createSeats: {
          ...state.createSeats,
          hall: [...state.createSeats.hall, newSate],
        },
      }))
    },
  },
}))

export default useStore
