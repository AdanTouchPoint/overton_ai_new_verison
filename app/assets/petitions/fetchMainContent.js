import { fetchData } from "./fetchData";
import { formater } from "../helpers/formater";
const fetchMainContent = async (petitionMethod, backendURLBase, endpoint, clientId, params = '', setMainData) => {
    const datos = await fetchData(petitionMethod,backendURLBase,endpoint, clientId, params)
    const data = await formater(datos)
    datos.data !== {} && datos.data !== [] ? setMainData(data) : ''

}

export{
    fetchMainContent
}
