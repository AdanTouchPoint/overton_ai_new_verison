import React, { useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/cjs/Col";
import Alert from "react-bootstrap/Alert";
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
  const [showManualEmailForm, setShowManualEmailForm] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [requestCompletion, setRequestCompletion] = useState([]);
  const [ableGenIA, setAbleGenIA] = useState(false);  // Cambiado a false por defecto
  const [iaPrompt, setIaPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false)
const handlePromptChange = (e) => {
    const value = e.target.value;
    setIaPrompt(value);
    setAbleGenIA(value.trim() !== '');  // Habilitar si el prompt no está vacío
  };
  const back = (e) => {
    e.preventDefault();
    setShowList(false);
    setHideIAPrompt(true);
    setShowMainContainer(false);
  };

  const clickAI = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const validObject = { promptBase: mainData.promptAI, prompt: iaPrompt };
      const text = await fetch('/api/completion', {
        method: 'POST',
        body: JSON.stringify({
          prompt: validObject,
        }),
      })
    const data = await text.json()
    const response = await JSON.parse(data)
      console.log(response.subject)
      setRequestCompletion({ message: response.message });
      setDataUser({
        ...dataUser,
        subject: response.subject || '',
        message: response.message || '',
      });
      setHideIAPrompt(true);
      setHideEmailForm(false);
      setIsLoading(false)
    } catch (error) {
      console.error("Error in AI generation:", error);
      setError(true);  // Mostrar mensaje de error en el estado
    }
  };

  const manualMailChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      subject: '',
      message: '',
    });
    setHideIAPrompt(true);
    setShowManualEmailForm(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="emailContainer">
          <LoadingMainForm cl="spinner-containerB" />
        </div>
      ) : (
        <div className={"emailContainer"} hidden={hideIAPrompt}>
          {error && (
            <Alert variant={"danger"}>
              An error occurred during AI generation. Please try again.
            </Alert>
          )}
          <Form
            name="fm-email"
           //onSubmit={handleSubmit}
            noValidate
            validated={validated}
          >
            <div>
              <h3 className="ia-instructions-title main-text-title">
                {mainData.titleAI || 'Describe your email to Ais'}
              </h3>
              <p className="ia-instructions-p main-text-instruction">
                {mainData.intructionsAI || 'Customer instructions for the user.'}
              </p>
              <div>
                <Col>
                  <Form.Group>
                    <Form.Label className="label-ia-prompt">
                      Write a Prompt and click “Generate”
                    </Form.Label>
                    <Form.Control
                      id="message-emailform"
                      onChange={handlePromptChange}
                      as="textarea"
                      rows={12}
                      name="message"
                      value={iaPrompt}
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
                <Button onClick={clickAI} className={"button-email-form secundary-btn"} disabled={!ableGenIA}>
                  Generate
                </Button>
              </div>
              <div className="change-to-manual-email-container">
                <span className="change-to-manual-email-letters" onClick={manualMailChange}>
                  OR Click here to write without using AI <u className="change-to-manual-email-btn">Write it yourself</u>
                </span>
              </div>
            </div>
          </Form>
        </div>
      )}
{showManualEmailForm === false ?       
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
      /> :  null }
{ hideEmailForm === false ? 
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
    /> : null
  }
    </>
  );
};

export default AIPrompt;
