import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    const data = request.then(response => response.data)
    request.catch(error => {
        console.log('fail')
        return
    })
    return data
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    const data = request.then(response => response.data)
    request.catch(error => {
        console.log('fail')
        return
    })
    return data
}

const remove = (id, name) => {
    console.log(id, name)
    const request = axios.delete(`${baseUrl}/${id}`)
    const data = request.then(() => getAll())
    request.catch(error => {
        console.log('fail')
        return
    })
    return data
}

const update = (name, number, id) => {
    const newData = {name, number, id}
    console.log(newData)
    const request = axios.put(`${baseUrl}/${id}`, newData)
    const data = request.then(() => getAll())
    request.catch(error => {
        console.log('fail')
        return
    })
    return data
}




export default {getAll, create, remove, update}