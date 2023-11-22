"use client";
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/cjs/Button";
import Alert from "react-bootstrap/Alert";
import List from "./List";
import ListSelect from "./ListSelect";
import EmailForm from "./EmailForm";
import ThankYou from "./ThankYou";
import { Link, animateScroll as scroll } from "react-scroll";
import { fetchRepresentatives } from "../assets/petitions/fetchRepresentatives";
import LoadingMainForm from "./LoadingMainForm";
const MainForm = ({
  leads,
  setLeads,
  dataUser,
  setDataUser,
  mp,
  setMp,
  setEmailData,
  emailData,
  clientId,
  states,
  tweet,
  typData,
  mainData,
  backendURLBase,
  endpoints,
  backendURLBaseServices,
  senator,
  setSenator,
  setDataQuestions,
  dataQuestions,
  questions,
  setQuestions,
  configurations,
  allDataIn,
  setAllDataIn,
  colors
}) => {
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showFindForm, setShowFindForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(true);
  const [tac, setTac] = useState(false);
  const { formFields } = mainData;
  const [showListSelect,setShowListSelect] = useState(true)
  const [emails,setEmails]= useState()
  const [many, setMany] =  useState(false)
  const [showMainContainer, setShowMainContainer] = useState(false)

  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };

  const handleTerms = (e) => {
    if (e.target.checked === true) {
      setTac(true);
    } else {
      setTac(false);
    }
  };
const selectAll = (e) => {
setMany(true)
setEmails([
  ...mp,
  ...senator
]

)
e.preventDefault()
setShowListSelect(false)
setShowList(true)
}
  const handleChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    });
  };
  const fieldValidator = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmail = (email) => {
      return emailRegex.test(email.trim());
    };
    for (let key in dataUser) {
      console.log(key);
      let value = dataUser[key];
      if (value === "") return false;
      if (key === "emailUser") {
        let value = dataUser[key];
        if (isValidEmail(value) === false) return false;
      }
    }
  };
  const back = (e) => {
    e.preventDefault;
    setShowFindForm(false)
    setShowList(true)
  }
  const click = async (e) => {
    e.preventDefault();
    console.log(dataUser, 'dataUser')
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    if (fieldValidator() === false || tac === false ||  Object.getOwnPropertyNames(dataUser).length === 0 || dataUser.userName === undefined  || dataUser.emailUser === undefined  ) {
      setError(true);
      return;
    }
    setShowLoadSpin(true);
    setError(false);

    if (configurations.SearchBy === "postcode") {
      fetchRepresentatives(
        "GET",
        backendURLBase,
        endpoints.toGetRepresentativesByCp,
        clientId,
        `&postcode=${dataUser.postalCode}`,
        setMp,
        setSenator,
        setShowLoadSpin,
        setShowList,
        setShowListSelect,
        setShowFindForm
      ).catch((error) => console.log("error", error));
      scroll.scrollToBottom();
      if (!mainData) return "loading datos";
      if (!mp) return "loading datos";
    }

    if (configurations.SearchBy === "state") {
      fetchRepresentatives(
        "GET",
        backendURLBase,
        endpoints.toGetRepresentativesPerStates,
        clientId,
        `&state=${dataUser.state}`,
        setMp,
        setShowLoadSpin,
        setShowList,
        mp,
        setSenator,
        senator,
        configurations.sendMany,
        setAllDataIn
      ).catch((error) => console.log("error", error));
      scroll.scrollTo(1000);
      if (!mainData) return "loading datos";
      if (!mp) return "loading datos";
    }
    if (configurations.searchBy === "party") {
      fetchRepresentatives(
        "GET",
        backendURLBase,
        endpoints.toGetRepresentativesPerParty,
        clientId,
        `&party=${dataUser.party}`,
        setMp,
        setShowLoadSpin,
        setShowList,
        mp,
        setSenator,
        senator
      ).catch((error) => console.log("error", error));
      scroll.scrollTo(1000);
      if (!mainData) return "loading datos";
      if (!mp) return "loading datos";
    }
  };
  if (!mainData) return "loading datos";
  if (!mp) return "loading datos";
  return (
    <div className={"contenedor main-form-flex-container"}>
      <div className={"container instructions"}></div>
      <div className={"form-container"} hidden={showMainContainer} >
        <div  className={"container container-content" }>
          {error ? (
            <Alert variant={"danger"}>
              Please fill all fields. Also, please make sure there are no spaces
              before of after your email or postcode.
            </Alert>
          ) : null}
         
          <Form
            name="fm-find"
            onSubmit={click}
            noValidate
            validated={validated}
            hidden={showFindForm}
          >
            <div className="instructions-container">
              <h3 className="main-texts-color main-text-title">{mainData.title}</h3>
              <p className="main-texts-color main-text-instruction">{mainData.instruction}</p>

            </div>
            {/* <h3 className="find-her-mp-text main-texts-color">{mainData.firstFormLabel1}</h3> */}
            <div className="fields-form">
              {formFields.map((field, key) => {
                console.log(field, key, mainData, 'Main Data');
                console.log(colors, 'COLORS')
                return field.type !== "state" ? (
                  <Form.Group  className="field" key={key}>
                    <Form.Label className="select-label main-texts-color labels-text-format">
                      {field.label}
                    </Form.Label>
                    <Form.Control
                      id="emailInput-mainForm"
                      type={field.type}
                      placeholder={field.placeholder}
                      name={field.type ===  "name" ? "userName" : field.type }
                      onChange={handleChange}
                      className="input-color main-form-inputs"
                      required
                    />
                  </Form.Group>
                ) : states.length > 0 ? (
                  <Form.Group className={"field"} key={key}>
                    <Form.Label className="select-label">
                      {field.label}
                    </Form.Label>
                    <Form.Select
                      aria-label="DefaulValue"
                      required
                      name={field.type}
                      id="stateSelect-mainForm"
                      onChange={handleChange}
                    >
                      <option key={"vacio"} value={""}>
                        {field.placeholder}
                      </option>
                      {states.sort().map((estate) => (
                        <option key={estate} value={estate}>
                          {estate}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Form.Group className="field" key={key}>
                    <Form.Label className="select-label">
                      {field.label}
                    </Form.Label>
                    <Form.Control
                      id="emailInput-mainForm"
                      type={field.type}
                      placeholder={field.placeholder}
                      name={field.type}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                );
              })}
            </div>
            <Form.Group
              style={{ textAlign: "justify" }}
              className="field select-styles-form terms-and-cond-input"
              controlId="conditions"
            >
              <Form.Check
                name="conditions"
                onClick={handleTerms}
                className="links-checkboxes-color terms-and-cond-input"
                // bsPrefix="custom-checkbox"
                required
                label={
                  <a
                    target={"_blank"}
                    className="links-checkboxes-color"
                    rel={"noreferrer"}
                    href={mainData.termsAndConditionsURL}
                  >
                    {mainData.termsAndConditionsTxt}
                  </a>
                }
              />
            </Form.Group>
            <Form.Group 
              className="main-find-btn-container"
            >
              <Button
                id="findButton-mainForm"
                type={"submit"}
                variant={"dark"}
                size={"lg"}
                onClick={click}
                className={"u-full-width capitalize-style find-btn-main-form"}
              >
                {mainData.findBtnText}
              </Button>
            </Form.Group>
            {showLoadSpin ? (
              loading("spinner-containerB")
            ) : null}
          </Form>
          <div className={"container senators-container"} hidden={showList}>
          <h3 className="main-texts-color instruction-text">
            {mainData.instruction}
          </h3>
            <div className="note-container">
              <span className="link-simulation links-checkboxes-color change-mode-list-btn" onClick={selectAll}>Email / all several representatives</span>
              <p>{mainData.note}</p>
            </div>
            <div className="list-container">

            <h5 className="representative-position">{mainData.senatorLabel ? mainData.senatorLabel : 'Senators'}</h5>
            <div className="representatives-container">
              { senator && senator.length > 0 ? (
                senator.map((mps, index) => (
                  <List
                  setMany={setMany}
                    setShowEmailForm={setShowEmailForm}
                    setShowFindForm={setShowFindForm}
                    showFindForm={showFindForm}
                    mainData={mainData}
                    emailData={emailData}
                    setEmailData={setEmailData}
                    dataUser={dataUser}
                    mps={mps}
                    clientId={clientId}
                    key={index}
                    tweet={tweet}
                    setShowList={setShowList}
                    showMainContainer={showMainContainer}
                  setShowMainContainer={setShowMainContainer}
                  colors={colors}
                  />
                ))
              ) : (
                <Alert variant="danger">
                  No representatives have been found with the state that has
                  provided us
                </Alert>
              )}
            </div>


            </div>

            <div className="list-container">

            <h5 className="representative-position">{mainData.positionName ? mainData.positionName : 'MP`S'}</h5>
            <div className="representatives-container">
              {mp && mp.length > 0 ? (
                mp.map((mps, index) => (
                  <List
                  setMany={setMany}
                  setShowList={setShowList}
                  setShowEmailForm={setShowEmailForm}
                  setShowFindForm={setShowFindForm}
                  showFindForm={showFindForm}
                  emailData={emailData}
                  setEmailData={setEmailData}
                  dataUser={dataUser}
                  mainData={mainData}
                  mps={mps}
                  clientId={clientId}
                  key={index}
                  tweet={tweet}
                  showMainContainer={showMainContainer}
                  setShowMainContainer={setShowMainContainer}
                  colors={colors}
                  />
                ))
              ) : (
                <Alert variant="danger">
                  No representatives have been found with the state that has
                  provided us
                </Alert>
              )}
            </div>

            </div>
            <Button className="back-button" onClick={back}>Back</Button>
          </div>
          <div className={"container senators-container"} hidden={showListSelect}>
          
            <h2 className="main-texts-color instruction-text">{mainData.instruction}</h2>
          
            <div className="representatives-container">
              {mp.length > 0 ? (
                <ListSelect
                  setEmails={setEmails}
                  emails={emails}
                  setShowList={setShowList}
                  setShowListSelect={setShowListSelect}
                  setShowEmailForm={setShowEmailForm}
                  setShowFindForm={setShowFindForm}
                  showFindForm={showFindForm}
                  emailData={emailData}
                  setEmailData={setEmailData}
                  dataUser={dataUser}
                  mp={mp}
                  clientId={clientId}
                  // key={index}
                  tweet={tweet}
                  allDataIn={allDataIn}
                  setAllDataIn={setAllDataIn}
                  showMainContainer={showMainContainer}
                  setShowMainContainer={setShowMainContainer}
                />
              ) : (
                <Alert variant="danger">
                  No representatives have been found with the state that has
                  provided us
                </Alert>
              )}
            </div>

          
          </div>
        </div>
      
      
    </div>
    <EmailForm
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
      setQuestions={setQuestions}
      setDataQuestions={setDataQuestions}
      dataQuestions={dataQuestions}
      allDataIn={allDataIn}
      setAllDataIn={setAllDataIn}
      configurations={configurations}
      setShowMainContainer={setShowMainContainer}
        
      />
      <ThankYou
        emailData={emailData}
        setDataUser={setDataUser}
        setEmailData={setEmailData}
        setShowFindForm={setShowFindForm}
        setShowThankYou={setShowThankYou}
        clientId={clientId}
        typData={typData}
        showThankYou={showThankYou}
        setShowMainContainer={setShowMainContainer}
        colors={colors}
      />
    </div>
  );
};
export default MainForm;
