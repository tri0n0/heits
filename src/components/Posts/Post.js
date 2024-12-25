import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an auth context

const Post = ({ post, onVote }) => {
  const [voteStatus, setVoteStatus] = useState(0); // 0: no vote, 1: upvote, -1: downvote
  const [localScore, setLocalScore] = useState(post.votes);
  const { currentUser } = useAuth();

  // Load user's previous vote from localStorage
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${post.id}_${currentUser?.id}`);
    if (savedVote) {
      setVoteStatus(parseInt(savedVote));
    }
  }, [post.id, currentUser]);

  const handleVote = (direction) => {
    if (!currentUser) return; // Prevent voting if not logged in

    const newVoteStatus = voteStatus === direction ? 0 : direction;
    
    // Update local storage
    localStorage.setItem(`vote_${post.id}_${currentUser.id}`, newVoteStatus.toString());
    
    // Update UI
    setVoteStatus(newVoteStatus);
    setLocalScore(prev => prev - voteStatus + newVoteStatus);
    
    // Notify parent component
    onVote(post.id, newVoteStatus);
  };

  return (
    <div className="post-card">
      <div className="vote-section">
        <button 
          className={`vote-button ${voteStatus === 1 ? 'voted' : ''}`}
          onClick={() => handleVote(1)}
          disabled={!currentUser}
        >
          ▲
        </button>
        <span className="vote-count">{localScore}</span>
        <button 
          className={`vote-button ${voteStatus === -1 ? 'voted' : ''}`}
          onClick={() => handleVote(-1)}
          disabled={!currentUser}
        >
          ▼
        </button>
      </div>
      {/* Rest of post content */}
    </div>
  );
};

export default Post; 