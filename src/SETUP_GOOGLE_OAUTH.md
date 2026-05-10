# 🚀 SETUP GOOGLE OAUTH - QUICK START (DearBook)

## ✅ Status: REAL GOOGLE OAUTH ENABLED

The app is now using **real Google OAuth 2.0** authentication!

---

## 📋 Prerequisites

1. **Google Account** (any Gmail account)
2. **Google Cloud Project** (free)
3. **5 minutes** of setup time

---

## 🔧 Step-by-Step Setup

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name: **"DearBook"**
4. Click **"Create"**

---

### **Step 2: Enable Google+ API**

1. In the project dashboard, click **"APIs & Services"**
2. Click **"Enable APIs and Services"**
3. Search for **"Google+ API"**
4. Click **"Enable"**

---

### **Step 3: Create OAuth Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure consent screen:
   - User Type: **External**
   - App name: **DearBook**
   - User support email: **your-email@gmail.com**
   - Developer contact: **your-email@gmail.com**
   - Click **"Save and Continue"** through all steps
4. Back to **"Create OAuth client ID"**:
   - Application type: **Web application**
   - Name: **DearBook Web Client**

---

### **Step 4: Configure Authorized Origins**

Add these URLs to **"Authorized JavaScript origins"**:

```
http://localhost:5173
http://localhost:3000
```

*(Add your production domain later)*

---

### **Step 5: Configure Redirect URIs**

Add these URLs to **"Authorized redirect URIs"**:

```
http://localhost:5173
http://localhost:3000
```

---

### **Step 6: Get Your Client ID**

1. Click **"Create"**
2. Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
3. You can ignore the Client Secret for now (not needed for frontend OAuth)

---

### **Step 7: Configure App**

**Option A - Use Environment Variable:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

**Option B - Hardcode (Quick Test):**

1. Open `App.tsx`
2. Replace this line:
   ```tsx
   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1058878076287-o26ufqrvr7ocnl7jk7n16k0q3pdi7vdo.apps.googleusercontent.com';
   ```
   
   With your Client ID:
   ```tsx
   const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
   ```

---

## 🧪 Testing

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Open browser:** `http://localhost:5173`

3. **Click "Đăng nhập với Google"**

4. **Google popup will open:**
   - Select your Google account
   - Grant permissions
   - App redirects back

5. **Success!** You should be logged in with your real Google account

---

## ✅ What Happens During Login

```
User clicks "Đăng nhập với Google"
         ↓
Google OAuth popup opens
         ↓
User selects Google account
         ↓
User grants permissions to Bookify
         ↓
Google returns access token
         ↓
App fetches user info from Google API
  - Email: user@gmail.com
  - Name: User Name
  - Picture: profile photo URL
         ↓
App stores user data in localStorage
         ↓
User logged in to Bookify! 🎉
```

---

## 🔍 Debugging

### **Problem: "Invalid Client ID"**

**Solution:**
- Check that you copied the full Client ID
- Make sure there's no extra spaces
- Restart dev server after changing `.env`

### **Problem: "redirect_uri_mismatch"**

**Solution:**
- Go back to Google Cloud Console
- Add `http://localhost:5173` to Authorized JavaScript origins
- Add `http://localhost:5173` to Authorized redirect URIs
- Make sure you saved the changes

### **Problem: "Access blocked: This app's request is invalid"**

**Solution:**
- Complete the OAuth consent screen configuration
- Add test users in Google Cloud Console (if app is not published)
- Or publish the app (for public use)

### **Problem: Popup blocked**

**Solution:**
- Allow popups in browser settings
- Or user clicks manually after seeing popup blocked message

---

## 🔐 Security Notes

### **Current Setup (Development):**
- ✅ Client-side OAuth (safe for SPAs)
- ✅ HTTPS not required for localhost
- ✅ Access token stored in localStorage
- ✅ Token expires automatically

### **Production Recommendations:**
- 🔒 Use HTTPS (required by Google)
- 🔒 Implement backend token verification
- 🔒 Use httpOnly cookies for session
- 🔒 Add CSRF protection
- 🔒 Implement token refresh flow
- 🔒 Add rate limiting

---

## 📊 Data Collected

When user logs in with Google, we receive:

```json
{
  "email": "user@gmail.com",
  "name": "User Name",
  "picture": "https://lh3.googleusercontent.com/...",
  "email_verified": true,
  "locale": "vi"
}
```

**We store:**
- ✅ Email (for account identification)
- ✅ Name (for personalization)
- ✅ Picture URL (optional, for avatar)

**We DO NOT store:**
- ❌ Google password
- ❌ Access tokens permanently
- ❌ Any other Google data

---

## 🌐 Publishing Your App

### **For Testing (Private):**

1. OAuth consent screen → **External**
2. Publishing status → **Testing**
3. Add test users (up to 100):
   - Add your Gmail addresses
   - Only these users can login

### **For Production (Public):**

1. Complete all OAuth consent screen fields
2. Add privacy policy URL
3. Add terms of service URL
4. Submit for verification
5. Google will review (1-2 weeks)
6. Once approved, anyone can login

---

## 📝 OAuth Consent Screen Tips

**Required fields:**
- App name: **Bookify**
- User support email: **your-email@gmail.com**
- App domain: **bookify.vn**
- Developer contact: **your-email@gmail.com**

**Scopes (what app asks for):**
- `profile` - Basic profile info
- `email` - Email address

**Optional but recommended:**
- App logo (512x512 PNG)
- Privacy policy URL
- Terms of service URL

---

## 🎉 Success!

Once setup is complete, users can:

✅ **Login with Google** in one click
✅ **No password needed** - Google handles security
✅ **Profile auto-filled** - name, email from Google
✅ **Fast signup** - new users created automatically
✅ **Secure** - OAuth 2.0 industry standard

---

## 🆘 Need Help?

### **Official Docs:**
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)

### **Common Issues:**
- [redirect_uri_mismatch](https://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch)
- [Invalid Client ID](https://stackoverflow.com/questions/38818041/google-oauth-invalid-client-error)

### **Video Tutorial:**
- Search YouTube: "React Google OAuth 2023"

---

## 🔄 Fallback

If Google OAuth doesn't work, users can still:
- ✅ Login with email/password (demo mode)
- ✅ All features still work
- ✅ No functionality lost

---

**Happy coding! 🚀**
