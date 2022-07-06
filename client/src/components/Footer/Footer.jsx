import './../../App.css';
import twitterLogo from "./../../assets/twitter-logo.svg";
import React from "react";

const TWITTER_HANDLE = 'HARUKI05758694';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

/**
 * Footerコンポーネント
 */
const Footer = () => {
    return (
        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
            >
                {`built on @${TWITTER_HANDLE}`}
            </a>
      </div>
    )
}

export default Footer;