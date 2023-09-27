import { fetchData } from "./fetchData";

const fetchRepresentatives = async (petitionMethod, backendURLBase, endpoint, clientId, params = '', setMp, setSenator, setShowLoadSpin, setShowList,setShowListSelect,setShowFindForm,sendMany,setAllDataIn) => {
    const datos = await fetchData(petitionMethod, backendURLBase, endpoint, clientId, params)
    if(sendMany === "Si") {
      const emails = await mailerExtracter(datos.data)
      console.log(emails)
      setAllDataIn(emails)
      setMp(datos.data)
      setShowLoadSpin(false)
      setShowList(false)
      return
     }
    let query = datos.data;
    let fill = await query.map((el) => {
      return el[0];
    });
    setMp(fill);
    setSenator(datos.statesFilter)
    setShowLoadSpin(false)
    setShowFindForm(true)
    setShowList(false)
    setShowListSelect(true)

}


export{
    fetchRepresentatives
}
