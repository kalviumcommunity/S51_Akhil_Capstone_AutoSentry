import React from 'react'
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import linkedinImage from '../../assets/linkedin.png';
import githubImage from '../../assets/github.png';
import instagramImage from '../../assets/instagram.png';
import { FaInstagramSquare } from "react-icons/fa";
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="parent1">Home</div>
      <div className="parent2"></div>
      <div className="parent3"></div>
      <div className="parent4"></div>
      <div className="parent5"></div>
      <div className="parent6"></div>
      <div className="parent7"></div>
      <div className="footer">
      <div className="calltoaction">
        <div className="circle"></div>
        <div className="newsletter">
          <p>Want to know the latest news in the Auto industry?</p>
          <p>Subscribe to our newsletter!</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Your email address"></input>
            <button type="submit">Subscribe now</button>
          </div>
        </div>
      </div>
        <div className="footerch">
          <div className="footerabt">
            <h1>Auto Sentry</h1>
            <br />
            <p>
              Effortlessly track car maintenance with our <br />
              user-friendly interface. Join our launch party <br />
              and discover hassle-free car care on Facebook,
              <br /> iPad, and Twitter.
            </p>
            <br />
            <br />
            <p>All rights reserved.</p>
          </div>
          <div className="footerlinks">
            <div className="footer-column">
              <h3>Landings</h3>
              <ul>
                <li>
                  <NavLink to={`/`}>Home</NavLink>
                </li>
                <li>
                  <NavLink to={`/`}>About</NavLink>
                </li>
                <li>
                  <NavLink to={`/`}>Services</NavLink>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <ul>
                <li>
                  <FaHome /> India
                </li>
                <li>
                  <IoIosMail /> example@info.com
                </li>
                <li>
                  <FaPhone /> 99999xxxxx
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Follow</h3>
              <ul>
                <li>
                  <NavLink to={`https://github.com/akhilk49`}>
                  <img src={githubImage} alt="Github" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`https://www.linkedin.com/in/akhil-k-kurian-2a473a281/`}>
                    <img src={linkedinImage} alt="Image description" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/`}>
                  <img src={instagramImage} alt="Image description" />
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home