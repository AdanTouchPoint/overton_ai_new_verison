import React, {useState} from 'react'
import Button from "react-bootstrap/cjs/Button";
import Modal from 'react-bootstrap/Modal';
import { fetchLeads } from '../assets/petitions/fetchLeads';

const ListSelect = ({emails,setShowList,setShowListSelect,setAllDataIn, mp, dataUser,  setEmailData,  setShowFindForm, setShowEmailForm, setShowMainContainer, showMainContainer, emailData, leads, setLeads, backendURLBase, endpoints, clientId}) => {
  const [checklistStates, setChecklistStates] = useState(emails?.map(() => true) || []);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async() => setShow(true);
    const toggleChecklist = (index) => {
      const newChecklistStates = [...checklistStates];
      newChecklistStates[index] = !newChecklistStates[index];
      setChecklistStates(newChecklistStates);
      // console.log(checklistStates)
    };
    // console.log(emails)
  const back = (e) => {
    e.preventDefault();
    setShowListSelect(true)
    setShowList(false)
  }
    const click = async() => {
      const selectedMps = await emails.filter((email, index) => checklistStates[index]);
      const selectedEmails = await selectedMps.map((mp) => mp.email ? mp.email.trim() : mp.contact.trim());
      //  console.log(selectedEmails, 'allDataIn')
      if(checklistStates.every(state => !state)) {
        handleShow();
        setShowEmailForm(true);
        setShowFindForm(true);

      } else {
        setAllDataIn(selectedEmails);
        setEmailData({
          ...dataUser
        });
        setShowEmailForm(false);
        setShowFindForm(true);
        setShowListSelect(true);
        setShowMainContainer(true);
        fetchLeads(
          true,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          'NA',
          'Multiples-representatives-selected-lead'
        );
        setLeads(leads + 1)
      }
    };
    return (
        <>
        <div className={'buttons-list-container list-container'}>
            {emails?.map((email, index) => (
                <label key={index} className='list-mp-row' >
                    <input
                        id="representativeList-checkbox"
                        type='checkbox'
                        checked={checklistStates[index]}
                        onChange={() => toggleChecklist(index)}
                        className='form-check-input'
                    />
                    <h5 className='list-mp-row-info'>
                      {email.name} 
                      <span>{email.govt_type}, {email.party}</span>
                    </h5>
                    
                </label>
            ))}
        </div>
        <div className='btn-container-checklist'>
            
                <div>
                    <Button id="representativeList-button" className='back-button' size={'lg'}  onClick={back}>
                    Back
                    </Button>
                </div>
                <div>
                    <Button id="representativeList-button" className='continue-button' size={'lg'}  onClick={click}>
                    Continue
                    </Button>
                </div>
            
        </div>
        <Modal show={show} onHide={handleClose} className='advice-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Advice</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please check the box of at least one representative</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default ListSelect


