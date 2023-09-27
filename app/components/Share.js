import Head from "next/head";
import { LinkedinIcon, LinkedinShareButton,FacebookShareButton, TwitterShareButton,WhatsappShareButton,FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import "./share.css";
const Share = ({shareMessage,shareUrl }) => {  
  return (
    <div >
      <FacebookShareButton url={shareUrl? shareUrl: 'Fill this in your dashboard'} quote={shareMessage? shareMessage.replace(/"/g, '&quot;') :  'Fill this in your dashboard'} hashtag="#yodecidocomomemuevo" className="share-buttons">
      <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl? shareUrl: 'Fill this in your dashboard'} title={shareMessage? shareMessage : 'Fill this in your dashboard'}className="share-buttons">
      <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl? shareUrl: 'Fill this in your dashboard'} title={shareMessage? shareMessage : 'Fill this in your dashboard'} className="share-buttons">
      <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <LinkedinShareButton url={shareUrl? shareUrl: 'Fill this in your dashboard'} title={shareMessage? shareMessage : 'Fill this in your dashboard'} className="share-buttons">
      <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
      <Head>
        {/* Script de Facebook */}
        <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0&appId={tu-app-id}" nonce="abcdefg" />
        {/* Script de Twitter */}
        <script async defer src="https://platform.twitter.com/widgets.js" />
        {/* Script de WhatsApp */}
        <script async defer src="https://cdn.jsdelivr.net/npm/@widgetbot/share-widget@1.1.0/whatsapp.js" />
      </Head>
    </div>
  );
};
export default Share;