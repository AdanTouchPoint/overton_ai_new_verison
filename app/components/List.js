import React, { useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import { urlEncode } from '../assets/helpers/utilities';
import { useCompletion } from "ai/react";
import LoadingMainForm from "./LoadingMainForm";
import { Form } from "react-bootstrap";
import { generateEtags } from "@/next.config";

const List = ({
  setMany,
  mps,
  dataUser,
  setEmailData,
  setShowFindForm,
  setShowEmailForm,
  tweet,
  setShowList
}) => {
  const generateTweet = (completion) => {
    if (completion !== "" ) {
      const encoder =  urlEncode(completion);
      const tweetText =  `.${mps.twitter} ${encoder}`;
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`)
        return
    }
  return console.log("vacio")
  }
  const {
    complete,
    completion,
    isLoading,
  } = useCompletion({
    api: "/api/tweet",
  });
  const click = (e) => {
    e.preventDefault();
    setEmailData({
      ...dataUser,
      ...mps,
    });
    setMany(false)
    setShowEmailForm(false);
    setShowFindForm(true);
    setShowList(true)
  };
  const clickAI = async (e) => {
      e.preventDefault()
      const text = await complete(`write a tweet using this prompt: ${tweet}`)
      generateTweet(text)
    }
  const loading = (cl) => {
    return <LoadingMainForm cl={cl} />;
  };
  return (
    <div className={"buttonsContainer"}>
    {
    isLoading === true ? (
      loading("spinner.conatinerB")
    ) : (
      <div>
        {}
      <div className={"list-content-location"}>
        <div>
          <h3 className="capitalize-style"> {mps.name} </h3>
          <p>
            State: {mps.state ? mps.state : " ---"}, Party:
            {mps.party ? mps.party : " ---"}
          </p>
        </div>
      </div>
      <div className={"buttons"}>
    <div className="list-button">
          {mps.twitter && mps.clientId?.plan !== "basic" ? (
            <Button
              id="tweetList-button"
              className="list-button"
              size={"sm"}
              variant={"dark"}
              target={"blank"}
              onClick={clickAI}
            >
              Tweet
            </Button>
          ) : (
            <p className="list-notweeter-text">No Twitter</p>
          )}
        </div>

        <div className="list-button">
          {mps.email ? (
            <Button
              id="emailList-button"
              className="list-button"
              size={"sm"}
              variant={"dark"}
              target={"blank"}
              onClick={click}
            >
              Email
            </Button>
          ) : (
            <p className="list-notweeter-text">No Email</p>
          )}
        </div>
        <div className="list-button">
          {mps.phone && mps.clientId?.plan !== "basic" ? (
            <Button
              id="callList-button"
              className="list-button"
              size={"sm"}
              variant={"dark"}
              href={`tel:${mps.phone}`}
              target={"blank"}
            >
              Call
            </Button>
          ) : (
            <p className="list-notweeter-text">No Phone</p>
          )}
        </div>
      </div>
  </div>
    )
  }
   </div>  
  );
};

export default List;