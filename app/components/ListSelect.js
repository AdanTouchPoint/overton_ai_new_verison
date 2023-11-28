import React, {useState} from 'react'
import Button from "react-bootstrap/cjs/Button";
import Modal from 'react-bootstrap/Modal';

const ListSelect = ({emails,setShowList,setShowListSelect,setAllDataIn, mp, dataUser,  setEmailData,  setShowFindForm, setShowEmailForm, setShowMainContainer, showMainContainer}) => {
    const [checklistStates, setChecklistStates] = useState(Array(emails?.length).fill(true));
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async() => setShow(true);
    const toggleChecklist = (index) => {
      const newChecklistStates = [...checklistStates];
      newChecklistStates[index] = !newChecklistStates[index];
      setChecklistStates(newChecklistStates);
    };
    // console.log(emails)
  const back = (e) => {
    e.preventDefault;
    setShowListSelect(true)
    setShowList(false)
  }
    const click = async() => {
      // console.log(emails)
      const selectedMps = await emails.filter((email, index) => checklistStates[index]);
      const selectedEmails = await selectedMps.map((mp) => mp.email ? mp.email.trim() : mp.contact.trim());
      // console.log(selectedEmails, 'allDataIn')
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
                    checked={checklistStates[index] || true}
                    onChange={() => toggleChecklist(index)}
                    className='form-check-input'
                    // defaultChecked
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


