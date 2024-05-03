import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaHome } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import linkedinImage from "../../assets/linkedin.png";
import githubImage from "../../assets/github.png";
import instagramImage from "../../assets/instagram.png";
import trackimg from "../../assets/trackimg.png";
import scheduleimg from "../../assets/scheduleimg.png";
import maintainimg from "../../assets/maintainimg.jpg";

import "./Home.css";

const Home = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <div className="home">
      <div className="parent1">
        <div className="circlepar1"></div>
        <div className="par1">
          <div className="sec1">
            <h1>Ditch The Spreadsheets.</h1>
            <h2>Smart Car Care Starts Here.</h2>
            <p>
              Say goodbye to lost receipts and missed service intervals. Our car
              maintenance <br />
              tracker keeps everything organized, reminding you of upcoming
              appointments to avoid costly repairs and keep your car running
              smoothly.
            </p>
            {!isAuthenticated && (
              <button
                className="homeactbtn1"
                onClick={() => loginWithRedirect()}
              >
                Get Started
              </button>
            )}
            {isAuthenticated && (
              <button className="homeactbtn1">
                <NavLink to="/garage">My Garage</NavLink>
              </button>
            )}
            <button className="homeactbtn2">
              <NavLink to={`/about`}>Explore</NavLink>
            </button>
          </div>
          <div className="sec2"></div>
        </div>
      </div>
      <div className="parent2">
        <div className="par2sec1">
          <p className="
          our-service">Our Services</p>
          <p className="maintanice-tracker">
            Track, Maintain, and Save with Our Vehicle Maintenance Tracker!
          </p>
        </div>
        <div className="par2sec2">
          <div className="coolfeature">
            <div className="image-div">
             <img src={trackimg} alt="trackimg" />
            </div>
            <div className="tile-preview">
              <p className="tile-name ">Track</p>
              <p className="subtitle">Effortless Maintenance Tracking Made Simple</p>
              <NavLink to={`/`}>
                Explore Page <HiOutlineArrowSmRight />
              </NavLink>
            </div>
          </div>
          <div className="coolfeature">
            <div className="image-div">
              <img src={maintainimg} alt="maintainimg" />
            </div>
            <div className="tile-preview">
              <p className="tile-name ">Maintain</p>
              <p className="subtitle">Streamline Your Vehicle Maintenance Routine</p>
              <NavLink to={`/`}>
                Explore Page <HiOutlineArrowSmRight />
              </NavLink>
            </div>
          </div>
          <div className="coolfeature">
            <div className="image-div">
              <img src={scheduleimg} alt="scheduleimg" />
            </div>
            <div className="tile-preview">
              <p className="tile-name ">Schedule</p>
              <p className="subtitle">Never Miss a Service Appointment Again with Easy Scheduling</p>
              <NavLink to={`/`}>
                Explore Page <HiOutlineArrowSmRight />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
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
                  <NavLink to={`/about`}>About</NavLink>
                </li>
                <li>
                  <NavLink to={`/services`}>Services</NavLink>
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
              <ul className="sociallinks">
                <li>
                  <NavLink to={`https://github.com/akhilk49`}>
                    <img src={githubImage} alt="Github" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`https://www.linkedin.com/in/akhil-k-kurian-2a473a281/`}
                  >
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
};

export default Home;
