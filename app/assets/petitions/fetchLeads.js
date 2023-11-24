import { fetchData } from "./fetchData";
const fetchLeads = (
  successResponse,
  backendURLBase,
  endpoints,
  clientId,
  dataUser,
  emailData,
  emailMessage
) => {
  fetchData(
    "POST",
    backendURLBase,
    endpoints.toSaveLeads,
    clientId,
    `&firstName=${dataUser.userName ? dataUser.userName : ""}&postalcode=${
      dataUser.postalCode ? dataUser.postalCode : "NA"
    }&emailData=${dataUser?.emailUser}&representative=${
      emailData?.name
    }&emailMessage=${JSON.stringify(emailMessage)}&sended=${successResponse}&subject=${dataUser.subject}&city=${dataUser.city ? dataUser.city : "NA"}&party=${dataUser.party ? dataUser.party : "NA"}`
  );
  console.log(clientId, 'clientID')
  console.log(dataUser, 'subject')
  console.log(emailMessage, 'message')
};

const fetchAllLeads = async (petitionMethod,backendURLBase, endpoint, clientId, setLeads) => {
  const  leads = await fetchData(petitionMethod, backendURLBase, endpoint, clientId)
   const data = leads.data
   setLeads(data)
}

export {
   fetchLeads, fetchAllLeads
}