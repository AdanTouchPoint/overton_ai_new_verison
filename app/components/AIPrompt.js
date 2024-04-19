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
import EmailForm from "./EmailForm";
const AIPrompt = ({
  leads,
  setLeads,
  questions,
  setShowThankYou,
  setShowFindForm,
  dataUser,
  setDataUser,
  hideIAPrompt,
  setHideIAPrompt,
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
  setShowMainContainer,
  setQuestions,
  setDataQuestions,
  dataQuestions,
  configurations,
  
}) => {
  const [hideEmailForm, setHideEmailForm] = useState(true);
  const [showManualEmailForm, setShowManualEmailForm] = useState(true)
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const { userName, subject } = dataUser;
  const [emailMessage, setEmailMessage] = useState({});
  const [requestCompletion, setRequestCompletion] = useState([]);
  const [ableGenIA, setAbleGenIA] = useState(true);
  const [iaPrompt, setIaPrompt] =useState('')
//   const [continueBtn, setcontinueBtn] = useState(true);
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
  const handlePromptChange = (e) =>{
    setIaPrompt(e.target.value);
    if (!iaPrompt || iaPrompt === '') {
        setAbleGenIA(false);
      }
  }
  const back = (e) => {
    e.preventDefault();
    setShowList(false);
    setHideIAPrompt(true);
    setShowMainContainer(false);
  };
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  const clickAI = async (e) => {
    e.preventDefault();
    try {
      const validObject = { promptBase: mainData.promptAI, prompt : iaPrompt}
      const validString = await JSON.stringify(validObject)
      const text = await complete(validString);
      const response = JSON.parse(text)
      setRequestCompletion({ message: response.message });
      setDataUser({
        ...dataUser,
        subject: response.subject || '',
        message: response.message || '',
      });
      setHideIAPrompt(true)
      setHideEmailForm(false)
      
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
    setHideIAPrompt(true)
    setShowManualEmailForm(false)
  }
  return (
    <>
      {isLoading == true ? (
              <div className="emailContainer">
                {loading("spinner-containerB")}

              </div>
            ) : (
            <div className={"emailContainer"} hidden={hideIAPrompt}>
        {error ? (
          <Alert variant={"danger"}>
            All fields are required, please fill in the missing ones.
          </Alert>
        ) : null}
        {console.log(allDataIn)}
        <Form
          name="fm-email"
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
        >
          <div>
          
            <>
              <h3 className="ia-instructions-title main-text-title">{mainData.titleAI ? mainData.titleAI : 'Describe your email to Ais'}</h3>
            <p className="ia-instructions-p main-text-instruction">
            {mainData.intructionsAI ? mainData.intructionsAI : 'Customer instructions for the user. Here the client explains to the user how this function works, and tells them to briefly describe what they want to say in the email.'}
            </p>
              </>

              <div>
                <div>
                  <Col>
                    <Form.Group>
                      <Form.Label className="label-ia-prompt">Write a Prompt and click “Generate”</Form.Label>
                      
                      <Form.Control
                        id="message-emailform"
                        onChange={handlePromptChange}
                        as="textarea"
                        rows={12}
                        name="message"
                        defaultValue={iaPrompt}
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
                  <Button onClick={clickAI} className={"button-email-form secundary-btn"} disabled={ableGenIA}>
                    Generate
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
        setHideIAPrompt={setHideIAPrompt}
        hideIAPrompt={hideIAPrompt}
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
    <EmailForm
      many={many}
      setMany={setMany}
      setShowList={setShowList}
      setLeads={setLeads}
      leads={leads}
      setShowThankYou={setShowThankYou}
      setShowFindForm={setShowFindForm}
      setHideIAPrompt={setHideIAPrompt}
      hideIAPrompt={hideIAPrompt}
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
      setQuestions={setQuestions}
      setDataQuestions={setDataQuestions}
      dataQuestions={dataQuestions}
      allDataIn={allDataIn}
      setAllDataIn={setAllDataIn}
      configurations={configurations}
      setShowMainContainer={setShowMainContainer}
      setHideEmailForm={setHideEmailForm}
      hideEmailForm={hideEmailForm}
      isLoading={isLoading}
    />
    </>
  );
};

export default AIPrompt;
