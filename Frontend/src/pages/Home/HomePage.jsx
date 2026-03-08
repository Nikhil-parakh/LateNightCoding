import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import heroImage from "../../assets/images/hero.jpg";
import aboutImage from "../../assets/images/about.jpg";
import serviceImage from "../../assets/images/service1.jpg";
import "../../styles/home.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="landing-topbar">
        <div className="container">
          <span>📍 GLS University Law Garden, Ahmedabad</span>
          <span>📞 +91 9876XXXXXX</span>
          <span>✉ info@salesify.com</span>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="container nav-flex">
          <h2 className="logo">Salesify</h2>

          <ul className="menu">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Pages</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>

          <button className="btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero">
        <div className="container hero-flex">
          <div className="hero-text" data-aos="fade-right">
            <h4>BEST MARKETING SERVICE</h4>

            <h1>
              Make The Easiest <br />
              Solution For You
            </h1>

            <p>
              Completely optimize enterprise-level solutions with strategic
              initiatives.
            </p>

            <button
              className="btn-outline"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>

          <div className="hero-image" data-aos="fade-right">
            <img src={heroImage} alt="hero" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="landing-about">
        <div className="container about-flex">
          <div className="about-img" data-aos="zoom-in">
            <img src={aboutImage} alt="about" />
          </div>

          <div className="about-text" data-aos="fade-left">
            <h4>ABOUT OUR COMPANY</h4>

            <h2>We Are Increasing Business Success With Technology</h2>

            <p>
              Dynamically redefine B2B markets with highly efficient methods.
            </p>

            <button className="btn-outline">About More</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="landing-services">
        <div className="container">
          <h2 className="title">We Provide Exclusive Service</h2>

          <div className="service-grid">
            <div className="service-card" data-aos="fade-up">
              <h3>UI/UX Design</h3>
              <p>Creative design solutions.</p>
            </div>

            <div
              className="service-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3>Digital Marketing</h3>
              <p>Boost your online presence.</p>
            </div>

            <div
              className="service-card"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3>Business Analysis</h3>
              <p>Improve business strategy.</p>
            </div>

            <div
              className="service-card"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h3>Software Services</h3>
              <p>Modern software solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="landing-experience">
        <div className="container exp-flex">
          <div className="exp-text" data-aos="fade-right">
            <h2>More Than 24+ Years Experience</h2>

            <p>
              We provide IT services with high quality products and solutions.
            </p>

            <button className="btn-outline">Learn More</button>
          </div>

          <div className="exp-img" data-aos="zoom-in">
            <img src={serviceImage} alt="exp" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
