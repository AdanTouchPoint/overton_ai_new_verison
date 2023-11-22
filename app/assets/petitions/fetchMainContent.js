import { fetchData } from "./fetchData";
import { formater } from "../helpers/formater";
const fetchMainContent = async (petitionMethod, backendURLBase, endpoint, clientId, params = '', setMainData) => {
    const datos = await fetchData(petitionMethod,backendURLBase,endpoint, clientId, params)
    const data = await formater(datos)
    if (datos.data && (Array.isArray(datos.data) ? datos.data.length > 0 : Object.keys(datos.data).length > 0)) {
        setMainData(data);
      }

}

export{
    fetchMainContent
}
