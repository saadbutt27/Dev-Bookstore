import React from 'react';
import { Link } from 'react-router-dom';
import './footer-styles.css'; // Import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/1-removebg-preview_2.png" alt="BookStore Logo" className="footer-logo-image" />
                </div>
                <div className="footer-links">
                    <div className="link-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/signin">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                    </div>
                    <div className="link-section">
                        <h4>Social Media</h4>
                        <ul>
                            <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        </ul>
                    </div>
                    <div className="link-section">
                        <h4>Resources</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Readify Book Store. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
