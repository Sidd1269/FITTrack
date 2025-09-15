# Firebase Authentication Setup

## Steps to Enable Authentication in Your Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `gymtracker-a1468`

2. **Enable Authentication**
   - In the left sidebar, click on "Authentication"
   - Click "Get started"
   - Go to the "Sign-in method" tab
   - Enable "Email/Password" authentication:
     - Click on "Email/Password"
     - Toggle "Enable" to ON
     - Click "Save"

3. **Create a Demo User (Optional)**
   - Go to "Users" tab in Authentication
   - Click "Add user"
   - Email: `demo@gymtracker.com`
   - Password: `demo123`
   - Click "Add user"

4. **Configure Firestore Rules (Optional)**
   - Go to "Firestore Database"
   - Click on "Rules" tab
   - Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own workout data
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Your App is Now Ready!

Once you've enabled Email/Password authentication in Firebase Console:

1. **Restart your development server**
2. **Visit http://localhost:3002**
3. **Click "Sign In / Sign Up"**
4. **Create a new account or use the demo credentials**

## Demo Credentials
- **Email**: demo@gymtracker.com
- **Password**: demo123

## Features Available After Authentication:
- ✅ User registration and login
- ✅ Personal workout data storage
- ✅ User profile management
- ✅ Secure data access
- ✅ Sign out functionality
