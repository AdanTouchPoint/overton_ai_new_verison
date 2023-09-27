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
import { useChat } from "ai/react";
import { Link, animateScroll as scroll } from "react-scroll";
import Card from "react-bootstrap/Card";

const EmailPreview = ({
  completion,
  emailMessage,
  setShowEmailPreview,
  showEmailPreview,
  leads,
  setLeads,
  setDataQuestions,
  dataQuestions,
  setQuestions,
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
}) => {
  
  const handleChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      ...emailData,
      [e.target.name]: e.target.value.replace(/\n\r?/g, "<br/>"),
    });
    setEmailData({
      ...dataUser,
      ...emailData,
      [e.target.name]: e.target.value.replace(/\n\r?/g, "<br/>"),
    });
  };

  const send = async (e) => {
    e.preventDefault();
    const payload = await fetchData(
      "GET",
      backendURLBaseServices,
      endpoints.toSendEmails,
      clientId,
      `&questions=${urlEncode(JSON.stringify(emailMessage))}&user=${urlEncode(
        JSON.stringify(dataUser)
      )}`
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
      setShowFindForm(true)
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
      setLeads(leads + 1);
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
    e.preventDefault();;
    setShowEmailForm(false);
    scroll.scrollTo(1000)
    setShowEmailPreview(true);
  };
console.log(emailMessage.message)
  return (
    <div className="emailContainer" hidden={showEmailPreview} >
      <h1>Instructions</h1>
      <p>
        write how feel you about it and AI helps you to write a email for you
        representatives
      </p>
      <h2>{mainData.titlePreview}</h2>
      <p>{mainData.intructionsPreview}</p>
      <Card body>
        <div className="input-prompt">
          <Col>
            <Form.Group>
              <Form.Label>{mainData.emailFormSubjectPlaceholder}</Form.Label>
              <Form.Control
                id="prompt-emailform"
                onChange={handleChange}
                as="textarea"
                plaintext
                rows={12}
                name="prompt"
                required
                readOnly
                defaultValue={dataUser?.message  ? dataUser.message : completion}
              />
            </Form.Group>
          </Col>
        </div>
      </Card>
      <div className={"container buttons-container-email-form"}>
      <Button
          id="backButton-emailform"
          className={"button-email-form"}
          variant={"dark"}
          onClick={back}
        >
          {emailData.backButton
            ? "please enter a back-button text on your dashboard"
            : "Back"}
        </Button>
        <Button
          id="sendButton-emailform"
          type={"submit"}
          className={"button-email-form"}
          variant={"dark"}
          onClick={send}
        >
          {emailData.sendButton
            ? "please enter a send-button text on your dashboard"
            : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default EmailPreview;
