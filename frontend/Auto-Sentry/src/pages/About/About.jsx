import React from 'react';
import './About.css';

const About = (props) => {
  const placeholderAboutData = {
    paragraph: "We are a company committed to excellence. Our team is dedicated to providing top-notch services to our clients.",
    Why: ["Expert Team", "Quality Services", "Customer Focused", "Innovative Solutions"],
    Why2: ["Competitive Pricing", "24/7 Support", "Global Reach", "Sustainable Practices"]
  };

  const placeholderServicesData = [
    { icon: "fa fa-shopping-cart", name: "E-Commerce", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim." },
    { icon: "fa fa-laptop", name: "Web Development", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim." },
    { icon: "fa fa-lock", name: "Web Security", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim." }
  ];

  const aboutData = props.aboutData || placeholderAboutData;

  const servicesData = props.servicesData || placeholderServicesData;

  return (
    <>
      <div id="about" className="about-section">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-6 image-column">
              <img src="img/about.jpg" className="responsive-image" alt="About Us" />
            </div>
            <div className="col-xs-12 col-md-6 text-column">
              <div className="about-text">
                <h2>About Us</h2>
                <p>{aboutData.paragraph}</p>
                <h3>Why Choose Us?</h3>
                <div className="list-style">
                  <div className="col list-column">
                    <ul>
                      {aboutData.Why.map((d, i) => (
                        <li key={`${d}-${i}`}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col list-column">
                    <ul>
                      {aboutData.Why2.map((d, i) => (
                        <li key={`${d}-${i}`}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="services" className="services-section text-center">
        <div className="container">
          <div className="section-title">
            <h2>Our Services</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
              dapibus leonec.
            </p>
          </div>
          <div className="row">
            {servicesData
              ? servicesData.map((d, i) => (
                  <div key={`${d.name}-${i}`} className="col-md-4 service-item">
                    <i className={d.icon}></i>
                    <div className="service-desc">
                      <h3>{d.name}</h3>
                      <p>{d.text}</p>
                    </div>
                  </div>
                ))
              : "loading"}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
