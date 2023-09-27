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
  setMany,
  many,
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const { userName, subject } = dataUser;
  const [emailMessage, setEmailMessage] = useState({});
  const [requestCompletion, setRequestCompletion] = useState([]);
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
    setDataUser({ ...emailData, [e.target.name]: e.target.value });
  };
  const handleContinue = async (e) => {
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
        }&text=${requestCompletion.message.replace(/\n\r?/g, "<br/>")}`
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
        setShowEmailForm(true);
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
      setShowEmailForm(true);
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
    setShowEmailForm(true);
  };
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  const clickAI = async (e) => {
    e.preventDefault();
    console.log(dataUser.message);
    const text = await complete(dataUser.message);
    let response = await JSON.parse(text);
    console.log(text);
    setRequestCompletion({ message: response.message });
    setDataUser({
      ...dataUser,
      subject: response.subject,
      message: response.message,
    });
  };
  return (
    <div>
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
            <h1>Instructions</h1>
            <p>
              write how feel you about it and AI helps you to write a email for
              you representatives
            </p>
            <h2>{mainData.titlePreview}</h2>
            <p>{mainData.intructionsPreview}</p>
            {isLoading == true ? (
              loading("spinner-containerB")
            ) : (
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
                        required
                      />
                    </Form.Group>
                  </Col>
                </div>
                <div className={"container buttons-container-email-form"}>
                  <Button onClick={back} className={"button-email-form"}>
                    Back
                  </Button>
                  <Button onClick={clickAI} className={"button-email-form"}>
                    Generate
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className={"button-email-form"}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EmailForm;
