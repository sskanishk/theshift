class Api {
    getURL = (urlPath) => {
        return `${import.meta.env.VITE_BASE_API_URL}${urlPath}`
    }
    
    addPayload = (payload) => {
        return Object.assign({}, payload)
    }

    get = async (url) => {
        const response = await fetch(this.getURL(url), {
            method: 'get'
        })
        return response.json()
    }

    post = async (url, payload) => {
        payload = payload || {}
        const response = await fetch(this.getURL(url), {
            method: 'post',
            body: JSON.stringify(this.addPayload(payload))
        })
        return response.json()
    }
}

export default new Api()