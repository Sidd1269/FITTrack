# Google Sign-In Setup for Firebase

## Steps to Enable Google Sign-In in Your Firebase Project

### 1. Enable Google Authentication in Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `gymtracker-a1468`

2. **Enable Google Sign-In**
   - In the left sidebar, click on "Authentication"
   - Click "Get started" if you haven't already
   - Go to the "Sign-in method" tab
   - Find "Google" in the list and click on it
   - Toggle "Enable" to ON
   - Add a project support email (your email)
   - Click "Save"

### 2. Configure OAuth Consent Screen (if needed)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select the same project: `gymtracker-a1468`

2. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "GymTracker Pro"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (optional): your email

### 3. Add Authorized Domains

1. **In Firebase Console**
   - Go to Authentication → Settings
   - Add authorized domains:
     - `localhost` (for development)
     - Your production domain (when you deploy)

### 4. Test Google Sign-In

Once you've enabled Google sign-in:

1. **Refresh your app** at http://localhost:3000
2. **You should see a "Continue with Google" button**
3. **Click it to test the Google sign-in flow**

## Troubleshooting

### If Google Sign-In doesn't work:

1. **Check the browser console** for any error messages
2. **Verify the OAuth consent screen** is configured
3. **Make sure the domain is authorized** in Firebase
4. **Check that Google sign-in is enabled** in Firebase Authentication

### Common Issues:

- **"This app isn't verified"** - This is normal for development. Click "Advanced" → "Go to GymTracker Pro (unsafe)"
- **"Error 400: redirect_uri_mismatch"** - Make sure `localhost` is in authorized domains
- **"Error 403: access_denied"** - Check OAuth consent screen configuration

## Your App Now Has:

✅ **Google Sign-In Button** - Beautiful, professional Google sign-in
✅ **Email/Password Authentication** - Traditional sign-up and sign-in
✅ **Firebase Integration** - Secure, scalable authentication
✅ **User Profile Management** - Full user account features
✅ **Automatic Sign-In** - Users stay logged in between sessions

Once you enable Google sign-in in Firebase Console, refresh your app and you'll see the Google sign-in option!
