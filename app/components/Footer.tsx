import React from 'react';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-content">
      {/* Copyright Section */}
      <span>&copy; 2026 <a href="https://www.hqaim.com" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>HQAIM Inc.</a> All rights reserved.</span>
      
      {/* Links Section */}
      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;
