import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Simulate fetching community data
    const communityData = {
      id,
      name: 'h/technology',
      description: 'A community for tech enthusiasts',
      members: 15000,
      posts: [
        { id: 1, title: 'Latest in AI', content: 'Discussion about AI advancements...' },
        // Add more posts
      ],
      rules: [
        'Be respectful',
        'No spam',
        'Follow community guidelines'
      ]
    };
    setCommunity(communityData);
  }, [id]);

  if (!community) return <div>Loading...</div>;

  return (
    <div className="community-detail-page">
      <div className="community-header">
        <h1>{community.name}</h1>
        <button 
          className={`join-button ${isJoined ? 'joined' : ''}`}
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
      
      <div className="community-content">
        <div className="main-content">
          <div className="posts-section">
            {community.posts.map(post => (
              <div key={post.id} className="community-post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar">
          <div className="about-community">
            <h3>About Community</h3>
            <p>{community.description}</p>
            <div className="member-count">
              {community.members.toLocaleString()} members
            </div>
          </div>
          
          <div className="rules-section">
            <h3>Community Rules</h3>
            <ul>
              {community.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
