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
import EmailPreview from "./EmailPreview";
import { animateScroll as scroll } from "react-scroll";
import LoadingMainForm from "./LoadingMainForm";

const ManualEmailForm = ({
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
  setMany,
  many,
  setShowMainContainer,
  showManualEmailForm,
  setShowManualEmailForm,
  isLoading
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const { userName, subject } = dataUser;
  const [emailMessage, setEmailMessage] = useState({});
  const [requestCompletion, setRequestCompletion] = useState([]);
  const [ableGenIA, setAbleGenIA] = useState(true);
  const [continueBtn, setcontinueBtn] = useState(true);
  
  const handleMessageChange = (e) => {
    e.preventDefault();
    setDataUser({ ...emailData, [e.target.name]: e.target.value });
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (many === true) {
      console.log(allDataIn);
      const payload = await fetchData(
        "GET",
        backendURLBaseServices,
        endpoints.toSendBatchEmails,
        clientId,
        `to=${allDataIn}&subject=${dataUser.subject}&firstName=${
          dataUser.userName
        }&emailData=${
          dataUser.emailUser
        }&text=${dataUser.message.replace(/\n\r?/g, "<br/>")}`
      );
      if (payload.success === true) {
        fetchLeads(
          true,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          emailMessage
        );
        setShowManualEmailForm(true);
        setShowFindForm(true);
        setShowEmailPreview(true);
        setShowThankYou(false);
        setLeads(leads + 1);
      }
      if (payload.success !== true) {
        fetchLeads(
          false,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          emailMessage
        );
        return (
          <Alert>
            El correo no ha sido enviado con éxito, por favor intente de nuevo
            más tarde
            <Button
              className={"button-email-form"}
              variant={"dark"}
              onClick={back}
            >
              Regresar
            </Button>
          </Alert>
        );
      }
      return;
    }
    const payload = await fetchData(
      "GET",
      backendURLBaseServices,
      endpoints.toSendEmails,
      clientId,
      `&questions=${urlEncode(
        JSON.stringify(requestCompletion)
      )}&user=${urlEncode(JSON.stringify(dataUser))}`
    );
    console.log(payload.success);
    if (payload.success === true) {
      fetchLeads(
        true,
        backendURLBase,
        endpoints,
        clientId,
        dataUser,
        emailData,
        emailMessage
      );
      setShowManualEmailForm(true);
      setShowFindForm(true);
      setShowEmailPreview(true);
      setShowThankYou(false);
      setLeads(leads + 1);
    }
    if (payload.success !== true) {
      fetchLeads(
        false,
        backendURLBase,
        endpoints,
        clientId,
        dataUser,
        emailData,
        emailMessage
      );
      return (
        <Alert>
          El correo no ha sido enviado con éxito, por favor intente de nuevo más
          tarde
          <Button
            className={"button-email-form"}
            variant={"dark"}
            onClick={back}
          >
            Regresar
          </Button>
        </Alert>
      );
    }
  };
  const back = (e) => {
    e.preventDefault();
    setShowList(false);
    setShowManualEmailForm(true);
    setShowMainContainer(false);
  };
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  
  return (
    <>
      {isLoading == true ? (
              <div className="emailContainer">
                {loading("spinner-containerB")}

              </div>
            ) : (
            <div className={"emailContainer"} hidden={showManualEmailForm}>
        {error ? (
          <Alert variant={"danger"}>
            All fields are required, please fill in the missing ones.
          </Alert>
        ) : null}
        <Form
          name="fm-email"
          onSubmit={handleSend}
          noValidate
          validated={validated}
        >
          <div>
          
            {
              continueBtn ? (<>
              <h3 className="ia-instructions-title main-text-title">Instructiones</h3>
            <p className="ia-instructions-p main-text-instruction">
              write how feel you about it and AI helps you to write a email for
              you representatives
            </p>
              </>) : (
            <>
            <h3 className="ia-instructions-title">{mainData.titlePreview ? mainData.titlePreview : 'Edit & Send'}</h3>
            <p className="ia-instructions-p">{mainData.intructionsPreview ? mainData.intructionsPreview : 'Edit and/or send the email that was written for you by AI.'}</p> 
            
            </>  
            
            )
            }
            
              <div>
                {" "}
                <div>
                  <Col>
                      <Form.Group>
                        <Form.Label className="subject-label">
                          {mainData.emailFormSubjectPlaceholder ? mainData.emailFormSubjectPlaceholder : 'Subject Line'}
                        </Form.Label>
                        <Form.Control
                          id="subject-emailform"
                          onChange={handleMessageChange}
                          name="subject"
                          type="text"
                          defaultValue={dataUser.subject}
                          className="subject-input"
                        />
                      </Form.Group>
                   
                    <Form.Group>
                      <Form.Label className="subject-label">
                        {mainData.emailFormMessagePlaceholder ? mainData.emailFormMessagePlaceholder : 'Email'}
                      </Form.Label>
                      <Form.Control
                        id="message-emailform"
                        onChange={handleMessageChange}
                        as="textarea"
                        rows={12}
                        name="message"
                        defaultValue={dataUser.message}
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
                  <Button
                    onClick={handleSend}
                    className={"button-email-form secundary-btn"}
                    
                  >
                    Send!
                  </Button>
                </div>
              </div>
              
          </div>
        </Form>
        
        </div>
      )}
      
    </>
  );
};

export default ManualEmailForm;