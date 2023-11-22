import { fetchData } from "./fetchData";

const fetchRepresentatives = async (petitionMethod, backendURLBase, endpoint, clientId, params = '', setMp, setSenator, setShowLoadSpin, setShowList,setShowListSelect,setShowFindForm,sendMany,setAllDataIn) => {
    const datos = await fetchData(petitionMethod, backendURLBase, endpoint, clientId, params)
    
    let query = datos.mps;
    console.log(sendMany, 'sen many')
    let fill = await query.map((el) => {
      return el;
    });
    setMp(fill);
    setSenator(datos.data)
    setShowLoadSpin(false)
    setShowFindForm(true)
    setShowList(false)
    setShowListSelect(true)

}


export{
    fetchRepresentatives
}
