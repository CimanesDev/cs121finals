import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const NOTES_URL = `${BASE_URL}notes/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`

export const login = async (email, password) => {
    try {
        const response = await axios.post(LOGIN_URL,
            {email: email, password: password},
            {withCredentials: true}
        )
        
        if (response.data.success && response.data.first_name) {
            localStorage.setItem('first_name', response.data.first_name);
        }
        
        return response.data.success
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message)
        return false
    }
}
export const refresh_token = async () => {
    try {
       await axios.post(REFRESH_URL,
            {},
            { withCredentials: true}
        )
        return true
    } catch (error) {
        console.error("Refresh token error:", error.response?.data || error.message)
        return false
    }
}

export const get_notes = async () => {
    try {
        const response = await axios.get(NOTES_URL,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error("Get notes error:", error.response?.data || error.message)
        return call_refresh(error, () => axios.get(NOTES_URL, { withCredentials: true}))
    }
}

const call_refresh = async (error, func) => {
    if (error.response && error.response.status === 401) {
        const tokenRefreshed = await refresh_token();
        if (tokenRefreshed) {
            try {
                const retryResponse = await func();
                return retryResponse.data
            } catch (retryError) {
                console.error("Retry error:", retryError.response?.data || retryError.message)
                return false
            }
        }
    }
    return false
}

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL,
            {},
            { withCredentials: true }
        )
        return true
    } catch (error) {
        console.error("Logout error:", error.response?.data || error.message)
        return false
    }
}

export const is_authenticated = async () => {
    try {
        const response = await axios.post(AUTH_URL, {}, { withCredentials: true })
        console.log("Auth response:", response.data)
        return {
            authenticated: true,
            first_name: response.data.first_name
        };
    } catch (error) {
        console.error("Auth check error:", error.response?.status)
        return {
            authenticated: false,
            first_name: null
        };
    }
}
export const register = async (firstName, lastName, email, birthday, password) => {
    try {
        const response = await axios.post(REGISTER_URL,
            {
                first_name: firstName,
                last_name: lastName,
                email: email,
                birthday: birthday,
                password: password
            },
            { withCredentials: true }
        )
        return response.data.success !== false
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message)
        return false
    }
}