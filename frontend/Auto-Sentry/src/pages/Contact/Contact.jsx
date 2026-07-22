import { useState } from 'react';
import { toast } from 'react-toastify';
import './Contact.css';
import {
  FaMapMarkerAlt, FaEnvelope, FaPhone,
  FaGithub, FaLinkedin, FaPaperPlane,
} from 'react-icons/fa';
import linkedinImage from '../../assets/linkedin.png';
import githubImage   from '../../assets/github.png';

const CONTACT_INFO = [
  {
    icon: <FaMapMarkerAlt />,
    label: 'Location',
    value: 'Kerala, India',
    color: '#5de0a5',
  },
  {
    icon: <FaEnvelope />,
    label: 'Email',
    value: 'example@autosentry.com',
    color: '#15cdfc',
    href: 'mailto:example@autosentry.com',
  },
  {
    icon: <FaPhone />,
    label: 'Phone',
    value: '+91 99999 xxxxx',
    color: '#a78bfa',
    href: 'tel:+9199999xxxxx',
  },
];

const FAQS = [
  { q: 'Is Auto Sentry free to use?',        a: 'Yes — Auto Sentry is completely free. Sign up with your existing Google account and start tracking immediately.' },
  { q: 'How do I add my vehicle?',            a: 'After logging in, head to My Garage and click "Add Vehicle". Fill in the make, model, year, and VIN — it takes under a minute.' },
  { q: 'Can I track multiple vehicles?',      a: 'Absolutely. You can add as many vehicles as you need, each with their own maintenance task list and service history.' },
  { q: 'Where is my data stored?',            a: 'Vehicle and task data is stored in MongoDB Atlas. Service history images are stored securely in Firebase Storage.' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending]   = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate send
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 800);
  };

  return (
    <div className="ct-page">

      {/* ── HEADER ── */}
      <div className="ct-header">
        <div className="ct-header-bg" aria-hidden="true" />
        <div className="ct-container ct-header-inner">
          <span className="ct-eyebrow">Get in Touch</span>
          <h1 className="ct-title">Contact Us</h1>
          <p className="ct-subtitle">
            Have a question, found a bug, or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ct-body">
        <div className="ct-container ct-body-inner">

          {/* Left — contact info */}
          <div className="ct-info-col">
            <div className="ct-info-card">
              <h2>Let's talk</h2>
              <p className="ct-info-intro">
                Whether you need help getting started, have feedback about a feature, 
                or just want to connect — reach out through any of the channels below.
              </p>

              <div className="ct-contact-items">
                {CONTACT_INFO.map(item => (
                  <div className="ct-contact-item" key={item.label}>
                    <div className="ct-contact-icon" style={{ background: `${item.color}1a`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="ct-contact-label">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="ct-contact-value">{item.value}</a>
                        : <p className="ct-contact-value">{item.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className="ct-divider" />

              <p className="ct-social-label">Follow the project</p>
              <div className="ct-social-links">
                <a href="https://github.com/akhilk49" target="_blank" rel="noreferrer" className="ct-social-btn" aria-label="GitHub">
                  <img src={githubImage}   alt="GitHub"   />
                </a>
                <a href="https://www.linkedin.com/in/akhil-k-kurian-2a473a281/" target="_blank" rel="noreferrer" className="ct-social-btn" aria-label="LinkedIn">
                  <img src={linkedinImage} alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="ct-form-col">
            <div className="ct-form-card">
              <div className="ct-form-card-header">
                <FaPaperPlane className="ct-form-icon" />
                <h2>Send a message</h2>
              </div>
              <form onSubmit={handleSubmit} className="ct-form">
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label htmlFor="ct-name">Name <span className="ct-required">*</span></label>
                    <input
                      id="ct-name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-email">Email <span className="ct-required">*</span></label>
                    <input
                      id="ct-email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-subject">Subject</label>
                  <input
                    id="ct-subject"
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-message">Message <span className="ct-required">*</span></label>
                  <textarea
                    id="ct-message"
                    name="message"
                    placeholder="Tell us what's on your mind…"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="ct-submit-btn" disabled={sending}>
                  {sending
                    ? 'Sending…'
                    : <><FaPaperPlane /> Send Message</>
                  }
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="ct-faq">
        <div className="ct-container">
          <div className="ct-faq-head">
            <span className="ct-eyebrow">Quick Answers</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="ct-faq-grid">
            {FAQS.map(f => (
              <div className="ct-faq-item" key={f.q}>
                <h3 className="ct-faq-q">{f.q}</h3>
                <p  className="ct-faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
