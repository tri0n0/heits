import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyB8J8CQgiHm9-LlzmyPSG7sJ56wgS2qBds');

const userNames = [
  'TechExplorer', 'CreativeMinds', 'DigitalNomad', 'CuriositySeeker',
  'InnovationGuru', 'MindfulThinker', 'FutureVision', 'InsightfulSoul',
  'KnowledgeSeeker', 'WisdomSharer', 'GlobalCitizen', 'ThoughtLeader'
];

const getRandomAvatar = () => `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;

const imageCategories = {
  Technology: [
    'programming-setup',
    'coding-workspace',
    'modern-technology',
    'artificial-intelligence',
    'computer-hardware'
  ],
  Science: [
    'scientific-laboratory',
    'space-exploration',
    'quantum-physics',
    'molecular-biology',
    'scientific-research'
  ],
  Gaming: [
    'gaming-setup',
    'esports-arena',
    'gaming-console',
    'gaming-keyboard',
    'gaming-streaming'
  ],
  News: [
    'breaking-news',
    'journalism',
    'press-conference',
    'news-studio',
    'media-broadcast'
  ],
  Entertainment: [
    'concert-stage',
    'movie-premiere',
    'film-production',
    'music-studio',
    'entertainment-event'
  ]
};

const cleanText = (text) => {
  return text.replace(/\*/g, '').trim();
};

const getRelevantImage = (category, title) => {
  const keywords = imageCategories[category];
  const titleWords = title.toLowerCase().split(' ')
    .filter(word => word.length > 3)
    .slice(0, 2)
    .join(',');
  
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  return `https://source.unsplash.com/featured/1200x800?${randomKeyword},${titleWords}`;
};

const topicImageCategories = {
  gaming: [
    'gaming-setup', 'esports', 'video-games', 'gaming-console', 
    'gaming-pc', 'gaming-accessories'
  ],
  technology: [
    'programming', 'artificial-intelligence', 'cybersecurity',
    'blockchain', 'robotics', 'smart-devices'
  ],
  entertainment: [
    'movies', 'tv-shows', 'celebrities', 'streaming',
    'theater', 'film-production'
  ],
  social: [
    'social-media', 'influencer', 'digital-marketing',
    'content-creation', 'community'
  ],
  education: [
    'learning', 'classroom', 'online-education', 'study',
    'books', 'research'
  ],
  art: [
    'digital-art', 'graphic-design', 'illustration',
    'creative-workspace', 'art-studio'
  ],
  music: [
    'music-studio', 'concert', 'musical-instruments',
    'music-production', 'musicians'
  ],
  news: [
    'breaking-news', 'journalism', 'current-events',
    'news-studio', 'media'
  ],
  sports: [
    'athletics', 'stadium', 'sports-equipment',
    'training', 'competition'
  ]
};

const topics = [
  { id: 'gaming', name: 'Gaming' },
  { id: 'technology', name: 'Technology' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'social', name: 'Social Media' },
  { id: 'education', name: 'Education' },
  { id: 'art', name: 'Art & Design' },
  { id: 'music', name: 'Music' },
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' }
];

export const generateRandomPosts = async (count = 5, topic = 'all') => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const posts = [];

  try {
    // Generate posts sequentially to ensure reliability
    for (let i = 0; i < count; i++) {
      const currentTopic = topic === 'all' 
        ? topics[Math.floor(Math.random() * topics.length)].id
        : topic;

      const prompt = `Create a social media post about ${currentTopic} with this exact structure:
        Title: [write an engaging title]
        Content: [write 2-3 sentences about the topic]
        Description: [write 1-2 sentences providing context]
        
        Make it informative and engaging.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      const titleMatch = text.match(/Title:\s*(.*?)(?=Content:|$)/s);
      const contentMatch = text.match(/Content:\s*(.*?)(?=Description:|$)/s);
      const descriptionMatch = text.match(/Description:\s*(.*?)$/s);

      // Get image for the post
      const imageKeywords = topicImageCategories[currentTopic] || ['general'];
      const randomImageKeyword = imageKeywords[Math.floor(Math.random() * imageKeywords.length)];
      const imageUrl = `https://source.unsplash.com/featured/800x400?${randomImageKeyword}`;

      const post = {
        id: Date.now() + i,
        title: titleMatch ? cleanText(titleMatch[1]) : `Trending in ${currentTopic}`,
        content: contentMatch ? cleanText(contentMatch[1]) : 'Generated content',
        description: descriptionMatch ? cleanText(descriptionMatch[1]) : `Latest updates in ${currentTopic}`,
        category: currentTopic,
        author: userNames[Math.floor(Math.random() * userNames.length)],
        avatar: getRandomAvatar(),
        image: imageUrl,
        timestamp: new Date(),
        votes: Math.floor(Math.random() * 100),
        comments: [],
        shares: Math.floor(Math.random() * 10),
        type: 'rich',
        isAutoGenerated: true
      };

      console.log('Generated post:', post); // Debug log
      posts.push(post);

      // Add small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Error generating posts:', error);
  }

  return posts;
};
