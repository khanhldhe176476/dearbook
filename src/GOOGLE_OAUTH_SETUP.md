# 🔐 GOOGLE OAUTH INTEGRATION

## 📋 Current Implementation (Demo)

Hiện tại, Bookify sử dụng **mock Google OAuth flow** cho demo purposes. User experience:

1. Click "Đăng nhập với Google"
2. Modal popup với thông tin user mẫu
3. Xác nhận → Đăng nhập thành công

---

## ⚡ Components

### **1. GoogleSignInButton.tsx**
- Beautiful Google-branded button
- Hover effects với shimmer animation
- Official Google colors
- Responsive design

### **2. GoogleOAuthModal.tsx**
- Professional OAuth consent screen
- Shows user info (name, email, avatar)
- Lists permissions
- Loading state during authentication
- Demo mode notice

### **3. LoginScreen.tsx**
- Integrated Google button
- "Or continue with" divider
- Handles OAuth flow
- Stores user data

---

## 🚀 Production Setup Guide

### **Step 1: Get Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Bookify"
3. Enable **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback
   https://bookify.vn/auth/google/callback
   ```

You'll get:
```
Client ID:     xxxxx.apps.googleusercontent.com
Client Secret: xxxxx
```

---

### **Step 2: Install Google OAuth Library**

```bash
npm install @react-oauth/google
```

---

### **Step 3: Update App.tsx**

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Your app content */}
    </GoogleOAuthProvider>
  );
}
```

---

### **Step 4: Update LoginScreen.tsx**

```tsx
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const { email, name, picture } = userInfo.data;

        // Send to your backend to create/login user
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, picture, googleToken: tokenResponse.access_token }),
        });

        const { user, token } = await response.json();

        // Save JWT token
        localStorage.setItem('auth_token', token);

        // Login to app
        onLogin(email, 'google-oauth', name);
      } catch (error) {
        console.error('Google login error:', error);
        alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
      }
    },
    onError: () => {
      alert('Đăng nhập Google thất bại');
    },
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  // ... rest of component
}
```

---

### **Step 5: Backend API (Node.js Example)**

```javascript
// /api/auth/google
app.post('/api/auth/google', async (req, res) => {
  const { email, name, picture, googleToken } = req.body;

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        authProvider: 'google',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});
```

---

### **Step 6: Environment Variables**

Create `.env` file:

```bash
# Frontend
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Backend
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
JWT_SECRET=your-secret-key-here
```

---

## 🔒 Security Best Practices

### **1. HTTPS Only**
```javascript
// Redirect HTTP to HTTPS
if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

### **2. Token Storage**
```javascript
// Use httpOnly cookies instead of localStorage for JWT
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### **3. CSRF Protection**
```javascript
// Add CSRF token to requests
import { csrf } from 'csrf-protection';
app.use(csrf());
```

### **4. Rate Limiting**
```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/google', authLimiter, async (req, res) => {
  // ...
});
```

---

## 📊 User Flow

```
User clicks "Google Sign In"
         ↓
Google OAuth popup opens
         ↓
User selects Google account
         ↓
Google redirects with auth code
         ↓
Frontend exchanges code for token
         ↓
Backend verifies token with Google
         ↓
Backend creates/finds user in DB
         ↓
Backend generates JWT token
         ↓
Frontend stores token
         ↓
User logged in to Bookify
```

---

## 🎨 UI/UX Features

### **GoogleSignInButton:**
- ✅ Official Google branding
- ✅ Hover shimmer effect
- ✅ Loading state
- ✅ Disabled state
- ✅ Responsive sizing

### **GoogleOAuthModal:**
- ✅ Professional consent screen
- ✅ User avatar/info preview
- ✅ Permission list
- ✅ Cancel/Continue actions
- ✅ Loading animation
- ✅ Demo mode notice

---

## 🐛 Error Handling

```tsx
const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    await googleLogin();
  } catch (error) {
    if (error.code === 'popup_closed_by_user') {
      // User closed popup - do nothing
      return;
    }
    
    if (error.code === 'access_denied') {
      toast.error('Bạn đã từ chối quyền truy cập');
      return;
    }

    // Generic error
    toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
    console.error('Google OAuth error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📱 Mobile Considerations

### **iOS Safari:**
- Use popup instead of redirect for better UX
- Handle popup blockers gracefully

### **Android Chrome:**
- Test "One Tap" sign-in
- Handle back button properly

```tsx
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  useOneTap // Enable One Tap on Android
  theme="filled_blue"
  size="large"
  text="continue_with"
  shape="rectangular"
/>
```

---

## 🧪 Testing

### **Unit Tests:**
```tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from './LoginScreen';

test('Google sign in button triggers OAuth flow', async () => {
  const mockOnLogin = jest.fn();
  const { getByText } = render(<LoginScreen onLogin={mockOnLogin} />);
  
  const googleBtn = getByText('Đăng nhập với Google');
  fireEvent.click(googleBtn);
  
  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalledWith(
      expect.any(String),
      'google-oauth',
      expect.any(String)
    );
  });
});
```

### **Integration Tests:**
```javascript
// Test OAuth callback endpoint
describe('POST /api/auth/google', () => {
  it('should create new user on first Google login', async () => {
    const response = await request(app)
      .post('/api/auth/google')
      .send({
        email: 'newuser@gmail.com',
        name: 'New User',
        googleToken: 'mock-token',
      });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('newuser@gmail.com');
    expect(response.body.token).toBeDefined();
  });
});
```

---

## 📈 Analytics

Track Google sign-in events:

```javascript
// Google Analytics
gtag('event', 'login', {
  method: 'Google',
});

// Mixpanel
mixpanel.track('User Login', {
  method: 'Google',
  platform: 'web',
});

// Custom backend logging
logger.info('Google OAuth login', {
  email: user.email,
  timestamp: new Date(),
  userAgent: req.headers['user-agent'],
});
```

---

## 🔄 Alternative: Firebase Auth

For faster setup, use Firebase Authentication:

```bash
npm install firebase
```

```tsx
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "xxxxx",
  authDomain: "bookify.firebaseapp.com",
  projectId: "bookify",
  // ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    onLogin(user.email, 'google-oauth', user.displayName);
  } catch (error) {
    console.error('Firebase auth error:', error);
  }
};
```

**Benefits:**
- ✅ No backend needed
- ✅ Handles token refresh automatically
- ✅ Built-in session management
- ✅ Free tier: 10k authentications/month

---

## 🎯 Success Metrics

Track these KPIs after implementation:

- **Google sign-in rate:** % of users choosing Google vs email/password
- **OAuth completion rate:** % who complete OAuth flow after clicking button
- **Error rate:** % of failed OAuth attempts
- **Time to login:** Average time from click to logged in
- **Returning user rate:** % who successfully login again

**Expected results:**
- 40-60% of users prefer Google sign-in
- 90%+ OAuth completion rate
- <2% error rate
- <5 seconds time to login

---

## ✅ Checklist

Before going to production:

- [ ] Get Google OAuth credentials
- [ ] Add authorized redirect URIs
- [ ] Install @react-oauth/google library
- [ ] Update frontend with real OAuth
- [ ] Create backend API endpoint
- [ ] Verify Google tokens server-side
- [ ] Store user in database
- [ ] Generate JWT tokens
- [ ] Set up HTTPS
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Test on mobile devices
- [ ] Add error handling
- [ ] Set up analytics
- [ ] Test with real Google accounts
- [ ] Remove demo mode notice

---

## 🎉 Current Demo Features

The current mock implementation includes:

✅ Beautiful Google-branded button with animations
✅ Professional OAuth consent modal
✅ User info preview (name, email)
✅ Permission list display
✅ Loading states
✅ Error handling UI
✅ Responsive design
✅ Demo mode notice

**Ready to swap with real OAuth in production!** 🚀
