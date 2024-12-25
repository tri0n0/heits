import './App.css';
import { useState, useRef, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import logo from './assets/images/1.png';
import { generateRandomPosts } from './utils/postGenerator';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';
import Login from './components/Login';
import { useAuth } from './contexts/AuthContext';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Add title to document
document.title = 'heits';

// Add this after your imports
const profilePic = 'https://i.pravatar.cc/150'; // Default avatar URL

// Or if you want to use a local image:
// import profilePic from './assets/images/default-avatar.png';

const topics = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'food', name: 'Food', icon: '🍳' },
  { id: 'travel', name: 'Travel', icon: '✈️' }
];

const popularCommunities = [
  { id: 1, name: 'TechTalks', members: '2.5M', icon: '💻' },
  { id: 2, name: 'GamingHub', members: '1.8M', icon: '🎮' },
  { id: 3, name: 'ScienceGeeks', members: '1.2M', icon: '🔬' },
  { id: 4, name: 'ArtistsUnite', members: '900K', icon: '🎨' },
  { id: 5, name: 'MusicLovers', members: '1.5M', icon: '🎵' }
];

// Add this helper function
const extractUsername = (email) => {
  if (!email) return 'User';
  // Extract everything before @ and remove special characters
  return email.split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
};

function App() {
  const [posts, setPosts] = useState(() => {
    // Try to get posts from localStorage
    const savedPosts = localStorage.getItem('allPosts');
    if (savedPosts) {
      try {
        return JSON.parse(savedPosts);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        return [];
      }
    }
    return [];
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [editedContent, setEditedContent] = useState({
    title: '',
    description: ''
  });
  const [newPost, setNewPost] = useState({ 
    type: 'text', 
    title: '',
    content: '',
    description: '',
    votes: 0,
    comments: []
  });
  const fileInputRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [joinedCommunities, setJoinedCommunities] = useState(
    JSON.parse(localStorage.getItem('joinedCommunities')) || []
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated: authIsAuthenticated, logout } = useAuth();
  const [staticAvatar] = useState(() => {
    // First try to get from session storage (for current session persistence)
    const sessionAvatar = sessionStorage.getItem('navbarAvatar');
    if (sessionAvatar) return sessionAvatar;
    
    // If not in session, try local storage
    const localAvatar = localStorage.getItem('navbarAvatar');
    if (localAvatar) return localAvatar;
    
    // If no stored avatar, create new one
    const newAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    // Store in both storages
    sessionStorage.setItem('navbarAvatar', newAvatar);
    localStorage.setItem('navbarAvatar', newAvatar);
    return newAvatar;
  });

  // Add this useEffect to handle post persistence
  useEffect(() => {
    // Save posts whenever they change
    try {
      localStorage.setItem('allPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  }, [posts]);

  // Add this function to handle initial load
  const loadSavedPosts = () => {
    try {
      const savedPosts = localStorage.getItem('allPosts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  // Add this useEffect to load posts on component mount
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      
      // Convert file to base64
      const base64 = await convertFileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      
      setMediaPreview(previewUrl);
      setNewPost(prev => ({
        ...prev,
        type: fileType,
        content: base64,  // Store as base64
        mediaUrl: base64, // Store as base64
        mediaType: file.type
      }));
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim()) {
      alert('Please add a title');
      return;
    }

    try {
      // Get email from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const username = extractUsername(userEmail);

      const post = {
        id: Date.now(),
        title: newPost.title,
        description: newPost.description,
        type: newPost.type,
        mediaUrl: newPost.mediaUrl,
        mediaType: newPost.mediaType,
        author: username, // Use extracted username here
        timestamp: new Date().toISOString(),
        votes: 0,
        comments: [],
        avatar: staticAvatar,
        isUserPost: true,
        topic: selectedTopic
      };

      const updatedPosts = [post, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('allPosts', JSON.stringify(updatedPosts));
      
      setNewPost({ 
        type: 'text', 
        title: '',
        content: '',
        description: '',
        votes: 0,
        comments: []
      });
      setMediaPreview(null);
      setShowPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditedContent({
      title: post.title,
      description: post.description,
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType
    });
  };

  const handleEditFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const base64 = await convertFileToBase64(file);
      
      setEditedContent(prev => ({
        ...prev,
        mediaUrl: base64,
        mediaType: file.type,
        type: fileType
      }));
    }
  };

  const handleSaveEdit = () => {
    const updatedPosts = posts.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          title: editedContent.title,
          description: editedContent.description,
          mediaUrl: editedContent.mediaUrl || post.mediaUrl,
          mediaType: editedContent.mediaType || post.mediaType
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('allPosts', JSON.stringify(updatedPosts));
    setEditingPost(null);
    setEditedContent({ title: '', description: '', mediaUrl: '', mediaType: '' });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
    }
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId);
    if (topicId === null) {
      // Show all posts if no topic is selected
      const savedPosts = localStorage.getItem('allPosts');
      setPosts(savedPosts ? JSON.parse(savedPosts) : []);
    } else {
      // Filter posts by topic
      const savedPosts = localStorage.getItem('allPosts');
      const allPosts = savedPosts ? JSON.parse(savedPosts) : [];
      const filteredPosts = allPosts.filter(post => post.topic === topicId);
      setPosts(filteredPosts);
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('joinedCommunities');
    setIsAuthenticated(false);
    setUser(null);
    setJoinedCommunities([]);
  };

  const handleJoinCommunity = (communityId) => {
    setJoinedCommunities(prev => {
      const newJoined = prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId];
      localStorage.setItem('joinedCommunities', JSON.stringify(newJoined));
      return newJoined;
    });
  };

  // Add this useEffect to handle body scrolling
  useEffect(() => {
    if (showPostForm) {
      document.body.classList.add('form-open');
    } else {
      document.body.classList.remove('form-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('form-open');
    };
  }, [showPostForm]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <h1 className="navbar-title">heits</h1>
          </div>
          <div className="navbar-right">
            {authIsAuthenticated && (
              <>
                <button 
                  className="navbar-create-post"
                  onClick={() => setShowPostForm(true)}
                >
                  <span>+</span> Create Post
                </button>
                <div className="navbar-user">
                  <img 
                    src={staticAvatar}
                    alt="User avatar" 
                    className="navbar-avatar"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  />
                  {showUserMenu && (
                    <div className="user-menu">
                      <button onClick={logout}>Logout</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <div className="App">
        {/* Left Sidebar - Topics */}
        <div className="sidebar">
          <div className="topics-section">
            <h2>Topics</h2>
            <div className="topics-list">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  className={`topic-button ${selectedTopic === topic.id ? 'active' : ''}`}
                  onClick={() => handleTopicClick(topic.id)}
                >
                  <span className="topic-icon">{topic.icon}</span>
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Post form and posts */}
          {showPostForm && (
            <div className="post-form-overlay" onClick={(e) => {
              if (e.target.className === 'post-form-overlay') {
                setShowPostForm(false);
              }
            }}>
              <div className="post-form-container">
                <button 
                  className="post-form-close" 
                  onClick={() => setShowPostForm(false)}
                  aria-label="Close form"
                >
                  ×
                </button>
                <div className="title-section">
                  <h1 className="navbar-title post-form-title">heits</h1>
                  <p className="post-form-motto">Share your story, inspire the world</p>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  setShowPostForm(false); // Close form after submission
                }}>
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '15px',
                      backgroundColor: '#363636',
                      border: '1px solid #4a4a4a',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />

                  <div className="post-type-tabs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('text')}
                      className={activeTab === 'text' ? 'active' : ''}
                    >
                      📝 Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('media')}
                      className={activeTab === 'media' ? 'active' : ''}
                    >
                      📁 Media
                    </button>
                  </div>

                  <div className="post-content-section">
                    {activeTab === 'media' && (
                      <div className="media-upload-section">
                        <div className="media-buttons">
                          <button type="button" onClick={() => fileInputRef.current?.click()}>
                            🖼️ Upload Media
                          </button>
                        </div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                          accept="image/*,video/*,audio/*"
                        />

                        {mediaPreview && (
                          <div className="media-preview">
                            {newPost.type === 'image' && (
                              <img src={mediaPreview} alt="Preview" />
                            )}
                            {newPost.type === 'video' && (
                              <video controls>
                                <source src={mediaPreview} type={newPost.content?.type} />
                              </video>
                            )}
                            {newPost.type === 'audio' && (
                              <audio controls>
                                <source src={mediaPreview} type={newPost.content?.type} />
                              </audio>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <textarea
                      placeholder={activeTab === 'text' ? "Write your post content..." : "Add a description for your post..."}
                      value={newPost.description}
                      onChange={(e) => setNewPost(prev => ({...prev, description: e.target.value}))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#363636',
                        border: '1px solid #4a4a4a',
                        borderRadius: '8px',
                        color: '#ffffff',
                        marginTop: '15px',
                        minHeight: '150px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setShowPostForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">Post</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.avatar} alt={`${post.author}'s avatar`} className="post-avatar" />
                <div className="post-user-info">
                  <span className="post-user-name">@{post.author}</span>
                  <span className="post-timestamp">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {post.isUserPost && (
                  <div className="post-actions">
                    <button onClick={() => handleEditClick(post)}>✏️ Edit</button>
                    <button onClick={() => handleDeletePost(post.id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>

              {editingPost?.id === post.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedContent.title}
                    onChange={(e) => setEditedContent(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Edit title..."
                    className="post-form-input"
                  />
                  
                  <div className="edit-media-section">
                    {post.type !== 'text' && (
                      <div className="current-media">
                        <p>Current Media:</p>
                        {post.type === 'image' && (
                          <img src={post.mediaUrl} alt="Current" className="edit-media-preview" />
                        )}
                        {post.type === 'video' && (
                          <video controls className="edit-media-preview">
                            <source src={post.mediaUrl} type={post.mediaType} />
                          </video>
                        )}
                      </div>
                    )}
                    
                    <div className="edit-media-upload">
                      <input
                        type="file"
                        onChange={handleEditFileChange}
                        accept="image/*,video/*"
                        className="edit-file-input"
                      />
                      {editedContent.mediaUrl && editedContent.mediaUrl !== post.mediaUrl && (
                        <div className="new-media-preview">
                          <p>New Media:</p>
                          {editedContent.mediaType?.includes('image') ? (
                            <img src={editedContent.mediaUrl} alt="New" className="edit-media-preview" />
                          ) : editedContent.mediaType?.includes('video') ? (
                            <video controls className="edit-media-preview">
                              <source src={editedContent.mediaUrl} type={editedContent.mediaType} />
                            </video>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={editedContent.description}
                    onChange={(e) => setEditedContent(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Edit description..."
                    className="post-form-input"
                  />
                  
                  <div className="edit-actions">
                    <button onClick={() => setEditingPost(null)}>Cancel</button>
                    <button onClick={handleSaveEdit}>Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  {post.type !== 'text' && post.mediaUrl && (
                    <div className="post-media">
                      {post.type === 'image' && <img src={post.mediaUrl} alt={post.title} />}
                      {post.type === 'video' && (
                        <video controls>
                          <source src={post.mediaUrl} type={post.mediaType} />
                        </video>
                      )}
                    </div>
                  )}
                  <div className="post-description">
                    <p>{post.description}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right Sidebar - Communities */}
        <div className="right-sidebar">
          <div className="communities-section">
            <h2>Popular Communities</h2>
            <div className="communities-list">
              {popularCommunities.map(community => (
                <div key={community.id} className="community-item">
                  <span className="community-icon">{community.icon}</span>
                  <div className="community-info">
                    <h3>{community.name}</h3>
                    <p>{community.members} members</p>
                  </div>
                  <button
                    className={`join-button ${joinedCommunities.includes(community.id) ? 'joined' : ''}`}
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    {joinedCommunities.includes(community.id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Chatbot onCreatePost={(postContent) => {
        const newPost = {
          ...postContent,
          id: Date.now(),
          author: 'AI Assistant',
          timestamp: new Date(),
          votes: 0,
          comments: []
        };
        setPosts(prev => [newPost, ...prev]);
      }} />

      {showLogin && !isAuthenticated && (
        <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}

export default App;