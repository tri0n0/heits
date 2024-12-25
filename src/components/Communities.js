import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Communities = () => {
  const [communities] = useState([
    { id: 1, name: 'h/gaming', members: 3.5e6, icon: '🎮', color: '#FF4500', description: 'A community for gaming enthusiasts' },
    { id: 2, name: 'h/technology', members: 2.8e6, icon: '💻', color: '#00D8FF', description: 'Latest in tech and innovation' },
    { id: 3, name: 'h/science', members: 2.2e6, icon: '🔬', color: '#7CFF00', description: 'Exploring scientific discoveries' },
    { id: 4, name: 'h/music', members: 1.9e6, icon: '🎵', color: '#FF00FF', description: 'For music lovers' },
    { id: 5, name: 'h/books', members: 1.5e6, icon: '📚', color: '#FFB000', description: 'Book discussions and recommendations' },
    // Add more communities as needed
  ]);

  const [joinedCommunities, setJoinedCommunities] = useState(new Set());

  const handleJoin = (communityId) => {
    setJoinedCommunities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(communityId)) {
        newSet.delete(communityId);
      } else {
        newSet.add(communityId);
      }
      return newSet;
    });
  };

  return (
    <div className="communities-page">
      <h1>All Communities</h1>
      <div className="communities-grid">
        {communities.map(community => (
          <div key={community.id} className="community-card" style={{ borderColor: community.color }}>
            <div className="community-header" style={{ backgroundColor: community.color + '15' }}>
              <span className="community-icon">{community.icon}</span>
              <h2>{community.name}</h2>
            </div>
            <div className="community-info">
              <p>{community.description}</p>
              <p className="member-count">{(community.members / 1e6).toFixed(1)}M members</p>
            </div>
            <div className="community-actions">
              <button 
                className={`join-button ${joinedCommunities.has(community.id) ? 'joined' : ''}`}
                onClick={() => handleJoin(community.id)}
              >
                {joinedCommunities.has(community.id) ? 'Joined' : 'Join'}
              </button>
              <Link to={`/community/${community.id}`} className="visit-button">
                Visit Community
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Communities; 