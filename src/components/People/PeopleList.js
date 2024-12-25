import React, { useState, useEffect } from 'react';
import '../../styles/People.css';

const PeopleList = () => {
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const generatedUsers = generateUsers();
      setUsers(generatedUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const generateUsers = () => {
    const userNames = [
      'Emma Thompson', 'Liam Chen', 'Sofia Rodriguez', 'Noah Kim',
      'Olivia Patel', 'Lucas Silva', 'Ava Nguyen', 'Ethan Williams',
      'Isabella Garcia', 'Mason Lee', 'Mia Johnson', 'Alexander Wong',
      'Charlotte Davis', 'Benjamin Taylor', 'Amelia Martinez',
      'William Anderson', 'Harper Brown', 'James Wilson',
      'Evelyn Moore', 'Daniel Jackson'
    ];

    const interests = [
      'Technology', 'Art & Design', 'Photography', 'Writing',
      'Music', 'Travel', 'Gaming', 'Fitness', 'Cooking',
      'Reading', 'Science', 'Sports', 'Fashion', 'Film',
      'Education', 'Business', 'Nature', 'Health', 'Food', 'Coding'
    ];

    return userNames.map((name, index) => ({
      id: index + 1,
      name,
      username: `@${name.toLowerCase().replace(' ', '_')}`,
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      interests: [
        interests[Math.floor(Math.random() * interests.length)],
        interests[Math.floor(Math.random() * interests.length)]
      ],
      bio: `${name.split(' ')[0]} is passionate about ${
        interests[Math.floor(Math.random() * interests.length)]
      } and ${
        interests[Math.floor(Math.random() * interests.length)]
      }. Always learning, always growing.`
    }));
  };

  if (isLoading) {
    return (
      <div className="people-container">
        <h2>Loading People...</h2>
        <div className="people-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="user-card loading">
              <div className="user-card-header">
                <div className="user-avatar loading"></div>
                <div className="user-info">
                  <div className="loading-text"></div>
                  <div className="loading-text"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleFollow = (userId) => {
    setFollowingStatus(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="people-container">
      <h2>People You Might Know</h2>
      <div className="people-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div className="user-info">
                <h3>{user.name}</h3>
                <span className="username">{user.username}</span>
              </div>
              <button 
                className={`follow-button ${followingStatus[user.id] ? 'following' : ''}`}
                onClick={() => handleFollow(user.id)}
              >
                {followingStatus[user.id] ? 'Following' : 'Follow'}
              </button>
            </div>
            <p className="user-bio">{user.bio}</p>
            <div className="user-stats">
              <span>{user.followers.toLocaleString()} followers</span>
              <span>•</span>
              <span>{user.following.toLocaleString()} following</span>
            </div>
            <div className="user-interests">
              {user.interests.map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleList; 