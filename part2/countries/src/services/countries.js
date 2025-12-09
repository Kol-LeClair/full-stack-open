import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries"

const getAll = () => axios.get(`${baseUrl}/api/all`)

const getOne = (name) => axios.get(`${baseUrl}/api/name/${name}`)

export default { getAll, getOne }