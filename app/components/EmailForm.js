"use client";
import React, { useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/cjs/Col";
import Alert from "react-bootstrap/Alert";
import Loader from "react-loader-spinner";
import { fetchData } from "../assets/petitions/fetchData";
import { fetchLeads } from "../assets/petitions/fetchLeads";
import { urlEncode } from "../assets/helpers/utilities";
import { useCompletion } from "ai/react";
import { animateScroll as scroll } from "react-scroll";
import LoadingMainForm from "./LoadingMainForm";
import ManualEmailForm from "./ManualEmailForm";
const EmailForm = ({
  leads,
  setLeads,
  questions,
  setShowThankYou,
  setShowFindForm,
  dataUser,
  setDataUser,
  showEmailForm,
  setShowEmailForm,
  emailData,
  setEmailData,
  clientId,
  backendURLBase,
  endpoints,
  backendURLBaseServices,
  mainData,
  setShowList,
  allDataIn,
  setAllDataIn,
  setMany,
  many,
  setShowMainContainer
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [showManualEmailForm, setShowManualEmailForm] = useState(true)
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const { userName, subject } = dataUser;
  const [emailMessage, setEmailMessage] = useState({});
  const [requestCompletion, setRequestCompletion] = useState([]);
  const [ableGenIA, setAbleGenIA] = useState(true);
  const [continueBtn, setcontinueBtn] = useState(true);
  const {
    complete,
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
    setCompletion,
  } = useCompletion({
    api: "/api/completion",
    //(onFinish: ()=>(setRequestCompletion({message: JSON.parse(completion).message , subject: JSON.parse(completion).subject} ))
  });
  
  const handleMessageChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      subject: e.target.name === "subject" ? e.target.value : dataUser.subject,
      message: e.target.name === "message" ? e.target.value : dataUser.message,
    });
    if (!dataUser.message || dataUser.message === '') {
      setAbleGenIA(false);
    }
    console.log(dataUser);
  };
  const handleContinue = async (e) => {
    e.preventDefault();
    try {
      let payload;
      console.log(dataUser, 'sendmany')
      if (many === true) {
        payload = await fetchData(
          "GET",
          backendURLBaseServices,
          endpoints.toSendBatchEmails,
          clientId,
          `to=${allDataIn}&subject=${dataUser.subject}&firstName=${
            dataUser.userName
          }&emailData=${
            dataUser.emailUser
          }&text=${dataUser.message.replace(/\n\r?/g, "<br/>")}`
        )
      } else{
        console.log(allDataIn);
        payload = await fetchData(
          "GET",
          backendURLBaseServices,
          endpoints.toSendBatchEmails,
          clientId,
          `to=${emailData.email}&subject=${dataUser.subject}&firstName=${
            dataUser.userName
          }&emailData=${
            dataUser.emailUser
          }&text=${dataUser.message.replace(/\n\r?/g, "<br/>")}`
        );

      }
        
      
  
      console.log(payload.success);
      const messageEmail = dataUser.message.replace(/\n\r?/g, "<br/>")
      if (payload.success === true) {
        fetchLeads(
          true,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          messageEmail
        );
        setShowEmailForm(true);
        setShowFindForm(true);
        setShowEmailPreview(true);
        setShowThankYou(false);
        setLeads(leads + 1);
      } else {
        fetchLeads(
          false,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          messageEmail
        );
        throw new Error("Email not sent successfully");
      }
    } catch (error) {
      console.error("Error handling continue:", error);
      // Mostrar un mensaje de error al usuario, puedes agregar un estado para manejarlo
      setError(true);
    }
  };
  const back = (e) => {
    e.preventDefault();
    setShowList(false);
    setShowEmailForm(true);
    setShowMainContainer(false);
  };
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  const clickAI = async (e) => {
    e.preventDefault();
    if (!dataUser.message || dataUser.message === '') {
      // setAbleGenIA(false); // Comentado por ahora
    }
    try {
      const text = await complete(dataUser.message);
      const response = JSON.parse(text);
      console.log(text);
      setRequestCompletion({ message: response.message });
      setDataUser({
        ...dataUser,
        subject: response.subject || '',
        message: response.message || '',
      });
      setcontinueBtn(false);
    } catch (error) {
      console.error("Error in AI generation:", error);
      // Manejar el error, posiblemente mostrando un mensaje al usuario
    }
  };

  const manualMailChange = async (e) =>{
    e.preventDefault();
    setDataUser({
      ...dataUser,
      subject:'',
      message:''
    })
    setShowEmailForm(true)
    setShowManualEmailForm(false)
  }
  return (
    <>
      {isLoading == true ? (
              <div className="emailContainer">
                {loading("spinner-containerB")}

              </div>
            ) : (
            <div className={"emailContainer"} hidden={showEmailForm}>
        {error ? (
          <Alert variant={"danger"}>
            All fields are required, please fill in the missing ones.
          </Alert>
        ) : null}
        <Form
          name="fm-email"
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
        >
          <div>
          
            {
              continueBtn ? (<>
              <h3 className="ia-instructions-title main-text-title">Instructions</h3>
            <p className="ia-instructions-p main-text-instruction">
              write how feel you about it and AI helps you to write a email for
              you representatives
            </p>
              </>) : (
            <>
            <h3 className="ia-instructions-title main-text-title">{mainData.titlePreview ? mainData.titlePreview : 'Edit & Send'}</h3>
            <p className="ia-instructions-p main-text-instruction">{mainData.intructionsPreview ? mainData.intructionsPreview : 'Edit and/or send the email that was written for you by AI.'}</p> 
            
            </>  
            
            )
            }
            
              <div>
                {" "}
                <div>
                  <Col>
                    {dataUser.subject ? (
                      <Form.Group>
                        <Form.Label>
                          {mainData.emailFormSubjectPlaceholder}
                        </Form.Label>
                        <Form.Control
                          id="subject-emailform"
                          onChange={handleMessageChange}
                          name="subject"
                          type="text"
                          defaultValue={dataUser.subject}
                        />
                      </Form.Group>
                    ) : null}
                    <Form.Group>
                      <Form.Label>
                        {mainData.emailFormMessagePlaceholder}
                      </Form.Label>
                      <Form.Control
                        id="message-emailform"
                        onChange={handleMessageChange}
                        as="textarea"
                        rows={12}
                        name="message"
                        defaultValue={requestCompletion.message}
                        className="email-ia-text-area"
                        required
                      />
                    </Form.Group>
                  </Col>
                </div>
                <div className={"container buttons-container-email-form btn-container-checklist"}>
                  <Button onClick={back} className={"button-email-form back-button"}>
                    Back
                  </Button>
                  <Button onClick={clickAI} className={"button-email-form secundary-btn"} disabled={ableGenIA} hidden={!continueBtn}>
                    Generate
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className={"button-email-form secundary-btn"}
                    hidden={continueBtn}
                  >
                    Send
                  </Button>
                </div>
              </div>
              <div className="change-to-manual-email-container">
          <span className="change-to-manual-email-letters" onClick={manualMailChange}>OR Click here to write without using AI <u className="change-to-manual-email-btn">Write it yourself</u></span>
        </div>
          </div>
        </Form>
        
        </div>
      )}
      <ManualEmailForm
        many={many}
        setMany={setMany}
        setShowList={setShowList}
        setLeads={setLeads}
        leads={leads}
        setShowThankYou={setShowThankYou}
        setShowFindForm={setShowFindForm}
        setShowEmailForm={setShowEmailForm}
        showEmailForm={showEmailForm}
        dataUser={dataUser}
        emailData={emailData}
        setEmailData={setEmailData}
        setDataUser={setDataUser}
        clientId={clientId}
        endpoints={endpoints}
        backendURLBase={backendURLBase}
        backendURLBaseServices={backendURLBaseServices}
        mainData={mainData}
        questions={questions}
        allDataIn={allDataIn}
        setAllDataIn={setAllDataIn}
        
        setShowMainContainer={setShowMainContainer}
        showManualEmailForm={showManualEmailForm}
        setShowManualEmailForm={setShowManualEmailForm}
      />
    </>
  );
};

export default EmailForm;
