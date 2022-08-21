import Api from './Api.js'

class ApiActions {

    getShifts() {
        return Api.get(`/shifts`)
    }

    getShiftsById(id) {
        return Api.get(`/shifts/${id}`)
    }

    bookShift(id) {
        return Api.post(`/shifts/${id}/book`)
    }

    cancelShift(id) {
        return Api.post(`/shifts/${id}/cancel`)
    }
}

export default new ApiActions