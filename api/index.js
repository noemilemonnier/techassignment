import axios from 'axios'


const api = axios.create({
    baseURL: 'https://api.hel.fi/servicemap/v2',
    headers: {
        //'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
    }
})


export const getDepartments = () => api.get(`/department`)
export const getDepartmentByID = id => api.get(`/department/${id}`)
export const getUnits = () => api.get(`/unit`)
export const getUnitByID = id => api.get(`/unit/${id}`)
export const getUnitsWithDistance = (lat, lon, radius) => api.get(`/unit/?distance=${radius}&lat=${lat}&lon=${lon}`)
export const getUnitsAll = (lat, lon, radius, count) => api.get(`/unit/?distance=${radius}&lat=${lat}&lon=${lon}&page_size=${count}`)


const apis = {
    getDepartments,
    getDepartmentByID,
    getUnits,
    getUnitByID,
    getUnitsWithDistance,
    getUnitsAll
}

export default apis