import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '💭',
    color: '#0079d3',
    rules: '',
    isPrivate: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your community creation logic here
    // You can use Context or Redux to manage communities state
    navigate('/communities');
  };

  return (
    <div className="create-community-container">
      <h1>Create a Community</h1>
      <form onSubmit={handleSubmit} className="create-community-form">
        <div className="form-group">
          <label>Community Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="h/yourcommunity"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="What's your community about?"
            required
          />
        </div>
        <div className="form-group">
          <label>Community Icon</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({...formData, icon: e.target.value})}
            placeholder="Enter an emoji"
          />
        </div>
        <div className="form-group">
          <label>Theme Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Community Rules</label>
          <textarea
            value={formData.rules}
            onChange={(e) => setFormData({...formData, rules: e.target.value})}
            placeholder="Set your community guidelines"
          />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
          />
          <label>Private Community</label>
        </div>
        <button type="submit" className="create-button">Create Community</button>
      </form>
    </div>
  );
};

export default CreateCommunity;
