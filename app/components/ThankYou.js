import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/cjs/Button";
import Share from "./Share";

const ThankYou = ({
  showThankYou,
  setShowFindForm,
  setShowThankYou,
  typData,
}) => {
  const click = (e) => {
    e.preventDefault();
    setShowThankYou(true);
    setShowFindForm(false);
  };
  return (
    <div hidden={showThankYou} className={"container typ-container"}>
      <form name="fm-tym" onSubmit={click}>
        <div className="typ-content">
          <h3>
            {typData.data?.docs[0]
              ? typData.data?.docs[0].thankYouMessage
              : typData.thankYouMessage}
          </h3>
          <h5>
            {typData.data?.docs[0]
              ? typData.data?.docs[0].secondThankYouMessage
              : typData.secondThankYouMessage}
          </h5>
          <Button
            id="repeatButton-typView"
            type={"submit"}
            onClick={click}
            variant={"dark"}
            className="capitalize-style"
          >
            {typData.data?.docs[0]
              ? typData.data?.docs[0].repeatButtonTyp
              : typData.repeatButtonTyp}
          </Button>
          <h5>
            {typData.data?.docs[0]
              ? typData.data?.docs[0].shareLabel
              : typData.shareLabel}
          </h5>
          <Share
            shareUrl={typData.data?.docs[0].shareUrl}
            shareMessage={typData.data?.docs[0].shareMessage}
          />
        </div>
      </form>
    </div>
  );
};

export default ThankYou;