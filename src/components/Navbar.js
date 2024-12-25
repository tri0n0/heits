import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userEmail }) => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="nav-right">
      <div 
        className="profile-container"
        onMouseEnter={() => setShowEmail(true)}
        onMouseLeave={() => setShowEmail(false)}
      >
        <button className="profile-button">
          <img src={profilePic} alt="Profile" />
        </button>
        {showEmail && (
          <div className="email-tooltip">
            {userEmail}
          </div>
        )}
      </div>
      <Link to="/people" className="nav-category-btn">
        Find People
      </Link>
    </div>
  );
};
