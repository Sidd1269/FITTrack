// Create demo user for testing
const demoUser = {
  id: '1',
  email: 'demo@gymtracker.com',
  displayName: 'Demo User'
};

// Save to localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('gymtracker_users', JSON.stringify([demoUser]));
  console.log('Demo user created!');
  console.log('Email: demo@gymtracker.com');
  console.log('Password: demo123 (any password works)');
} else {
  console.log('Run this in the browser console to create demo user');
}