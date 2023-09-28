import React, {useState} from 'react'
import Button from "react-bootstrap/cjs/Button";
import Modal from 'react-bootstrap/Modal';

const ListSelect = ({emails,setShowList,setShowListSelect,setAllDataIn, mp, dataUser,  setEmailData,  setShowFindForm, setShowEmailForm}) => {
    const [checklistStates, setChecklistStates] = useState(Array(emails?.length).fill(true));
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async() => setShow(true);
    const toggleChecklist = (index) => {
      const newChecklistStates = [...checklistStates];
      newChecklistStates[index] = !newChecklistStates[index];
      setChecklistStates(newChecklistStates);
    };
    //console.log(emails)
  const back = (e) => {
    e.preventDefault;
    setShowListSelect(true)
    setShowList(false)
  }
    const click = async() => {
      console.log(emails)
      const selectedMps = await emails.filter((email, index) => checklistStates[index]);
      const selectedEmails = await selectedMps.map((mp) => mp.email ? mp.email.trim() : mp.contact.trim());
      console.log(selectedEmails, 'allDataIn')
      if(checklistStates.every(state => !state)) {
        handleShow();
        setShowEmailForm(true);
        setShowFindForm(false);

      } else {
        setAllDataIn(selectedEmails);
        setEmailData({
          ...dataUser
        });
        setShowEmailForm(false);
        setShowFindForm(true);
        setShowListSelect(true)
      }
    };
    return (
        <>
        <div className={'buttonsContainer'}>
            {emails?.map((email, index) => (
                <label key={index} className='list-mp-row' >
                    <input
                    id="representativeList-checkbox"
                    type='checkbox'
                    checked={checklistStates[index]}
                    onChange={() => toggleChecklist(index)}
                    />
                    <h5>{email.name}</h5>
                </label>
            ))}
        </div>
        <div className='btn-container-checklist'>
            <div className={'buttons'}>
                <div>
                    <Button id="representativeList-button" className='list-button' size={'md'} variant={'dark'} onClick={click}>
                    Proceed to Email
                    </Button>
                </div>
                <div>
                    <Button id="representativeList-button" className='list-button' size={'md'} variant={'dark'} onClick={back}>
                    back
                    </Button>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={handleClose}>
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


