import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";
import linkedinImage from "../../assets/linkedin.png";
import githubImage from "../../assets/github.png";
import instagramImage from "../../assets/instagram.png";
import trackimg from "../../assets/trackimg.png";
import scheduleimg from "../../assets/scheduleimg.png";
import maintainimg from "../../assets/maintainimg.jpg";
import "./Home.css";

const Home = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      toast.success("Subscribed!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email");
    }
  };

  const services = [
    { img: trackimg,    alt: "Track your vehicle",    name: "Track",    desc: "Log every service, part change and inspection in one place.", link: "/garage" },
    { img: maintainimg, alt: "Maintain your vehicle", name: "Maintain", desc: "Stay ahead of wear with smart maintenance reminders.",         link: "/services" },
    { img: scheduleimg, alt: "Schedule your service", name: "Schedule", desc: "Book appointments that sync straight to Google Calendar.",    link: "/Googlecalender" },
  ];

  const stats = [
    { num: "10K+", label: "Vehicles Tracked" },
    { num: "98%",  label: "Customer Satisfaction" },
    { num: "50K+", label: "Tasks Completed" },
    { num: "24/7", label: "Always Available" },
  ];

  const features = [
    "Connect with top vehicle maintenance advisors.",
    "Get reminders before service intervals are missed.",
    "Keep a clean digital history that boosts resale value.",
  ];

  const testimonials = [
    { initials: "JM", name: "James Mitchell", role: "Toyota Camry Owner",  text: "Auto Sentry completely changed how I manage my cars. I used to miss oil changes all the time — now I get reminders before it's ever an issue." },
    { initials: "SR", name: "Sophia Ramirez", role: "Honda CR-V Owner",     text: "The Google Calendar integration is a game changer. I schedule service appointments directly from the dashboard and they show up right in my calendar." },
    { initials: "DK", name: "David Kim",      role: "Fleet Manager",        text: "I manage a small fleet of delivery vehicles. Auto Sentry keeps every maintenance log in one place — no more spreadsheets, no more guesswork." },
  ];

  const posts = [
    { tag: "Maintenance",   title: "5 Signs Your Car Needs an Oil Change Right Now",          excerpt: "Don't wait for the warning light. These early signs could save you from a costly engine repair down the road.",                          date: "June 2025" },
    { tag: "Tips & Tricks", title: "How to Build a Vehicle Maintenance Schedule That Works",  excerpt: "A consistent schedule is the single best thing you can do for your car's longevity. Here's how to set one up in minutes.",               date: "May 2025" },
    { tag: "Technology",    title: "Why Digital Service Records Beat Paper Every Time",       excerpt: "From resale value to warranty claims, a clean digital history of your vehicle is more valuable than most people realise.",               date: "April 2025" },
  ];

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow hero-glow--tr" aria-hidden="true" />
        <div className="hero-glow hero-glow--bl" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">Vehicle Maintenance Simplified</span>
            <h1>
              Ditch The<br />
              <span className="hero-accent">Spreadsheets.</span>
            </h1>
            <p className="hero-sub">
              Say goodbye to lost receipts and missed service intervals. Auto Sentry
              keeps everything organised, so you never face a costly surprise repair.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <NavLink to="/garage" className="btn btn-primary">
                  My Garage <HiArrowRight />
                </NavLink>
              ) : (
                <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
                  Get Started <HiArrowRight />
                </button>
              )}
              <NavLink to="/about" className="btn btn-ghost">Learn More</NavLink>
            </div>
            <div className="hero-trust">
              <span>✓ Free to use</span>
              <span>✓ No credit card</span>
              <span>✓ Google Calendar sync</span>
            </div>
          </div>

          <div className="hero-card-stack" aria-hidden="true">
            <div className="hcard hcard--main">
              <div className="hcard-header">
                <span className="hcard-dot hcard-dot--green" />
                <span className="hcard-dot hcard-dot--yellow" />
                <span className="hcard-dot hcard-dot--red" />
              </div>
              <div className="hcard-row">
                <span className="hcard-label">Next Service</span>
                <span className="hcard-badge hcard-badge--warn">Due in 3 days</span>
              </div>
              <div className="hcard-vehicle">2022 Toyota Camry</div>
              <div className="hcard-row hcard-row--muted">
                <span>Oil Change</span>
                <span>5,000 km</span>
              </div>
              <div className="hcard-progress">
                <div className="hcard-progress-fill" style={{ width: "72%" }} />
              </div>
              <div className="hcard-row hcard-row--muted hcard-row--small">
                <span>Last: Jan 2025</span>
                <span>72% of interval</span>
              </div>
            </div>
            <div className="hcard hcard--mini">
              <span className="hcard-mini-icon">🔧</span>
              <div>
                <div className="hcard-mini-title">Brake Check</div>
                <div className="hcard-mini-sub">Scheduled · Mar 15</div>
              </div>
            </div>
            <div className="hcard hcard--stat">
              <span className="hcard-stat-num">98%</span>
              <span className="hcard-stat-lbl">On-time rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">What We Offer</span>
            <h2 className="section-title">
              Track, Maintain &amp; Schedule —<br />all in one dashboard
            </h2>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <div className="service-card" key={s.name}>
                <div className="service-img-wrap">
                  <img src={s.img} alt={s.alt} />
                  <span className="service-badge">{s.name}</span>
                </div>
                <div className="service-body">
                  <p className="service-desc">{s.desc}</p>
                  <NavLink to={s.link} className="service-link">
                    Explore <HiArrowRight />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS + FEATURES ── */}
      <section className="stats-features">
        <div className="stats-panel">
          <div className="stats-label">By the numbers</div>
          <div className="stats-grid">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <span className="stat-number">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="features-panel">
          <span className="section-eyebrow section-eyebrow--dark">Why Auto Sentry</span>
          <h2>
            Everything you need to keep your vehicles running at their best.
          </h2>
          <ul className="feature-list">
            {features.map((f) => (
              <li key={f}>
                <span className="check-wrap"><FaCheck className="check-icon" /></span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <NavLink to="/about" className="btn btn-dark">
            Explore Features <HiArrowRight />
          </NavLink>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="section-eyebrow section-eyebrow--light">Real Users</span>
            <h2 className="section-title section-title--light">What Our Customers Say</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="blog">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="section-eyebrow">From the Blog</span>
            <h2 className="section-title">Tips, Guides &amp; Insights</h2>
          </div>
          <div className="blog-grid">
            {posts.map((b) => (
              <article className="blog-card" key={b.title}>
                <div className="blog-card-top">
                  <span className="blog-tag">{b.tag}</span>
                  <span className="blog-date">{b.date}</span>
                </div>
                <h3 className="blog-title">{b.title}</h3>
                <p className="blog-excerpt">{b.excerpt}</p>
                <button className="blog-read-more">Read more <HiArrowRight /></button>
              </article>
            ))}
          </div>
          <div className="blog-footer">
            <button className="btn btn-outline-dark">View All Posts</button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-bg-shape" aria-hidden="true" />
            <div className="newsletter-content">
              <span className="section-eyebrow section-eyebrow--light">Stay in the Loop</span>
              <h2>Get the latest auto care tips in your inbox.</h2>
              <p>Join thousands of car owners who trust Auto Sentry for maintenance advice.</p>
              <div className="subscribe-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                />
                <button type="button" onClick={handleNewsletterSubmit}>
                  Subscribe
                </button>
              </div>
              <p className="newsletter-note">No spam. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <h3 className="footer-logo">Auto Sentry</h3>
            <p>
              Effortlessly track car maintenance with our user-friendly platform.
              Join our community and discover hassle-free car care.
            </p>
            <p className="footer-copy">© 2025 Auto Sentry. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Pages</h4>
              <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/services">Services</NavLink></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><FaMapMarkerAlt className="footer-icon" /> India</li>
                <li><IoIosMail className="footer-icon" /> example@info.com</li>
                <li><FaPhone className="footer-icon" /> 99999xxxxx</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <ul className="social-links">
                <li>
                  <a href="https://github.com/akhilk49" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <img src={githubImage} alt="GitHub" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/akhil-k-kurian-2a473a281/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <img src={linkedinImage} alt="LinkedIn" />
                  </a>
                </li>
                <li>
                  <a href="/" aria-label="Instagram">
                    <img src={instagramImage} alt="Instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
