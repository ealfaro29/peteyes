# 🚀 Deployment Guide

## GitHub Pages (Recommended)

GitHub Pages provides free HTTPS hosting, which is required for camera access.

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/ealfaro29/peteyes
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 2: Wait for Deployment

- GitHub will automatically build and deploy your site
- Wait 1-2 minutes for the deployment to complete
- Your site will be available at: **https://ealfaro29.github.io/peteyes**

### Step 3: Verify

Open https://ealfaro29.github.io/peteyes in your browser to test.

---

## Alternative: Netlify (One-Click Deploy)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ealfaro29/peteyes)

1. Click the button above
2. Sign in to Netlify
3. Authorize GitHub access
4. Click "Deploy site"
5. Your site will be live at a custom Netlify URL

---

## Alternative: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `ealfaro29/peteyes`
5. Click "Deploy"
6. Your site will be live at a custom Vercel URL

---

## Custom Domain (Optional)

If you have a custom domain:

### For GitHub Pages:
1. Add a `CNAME` file with your domain
2. Configure DNS with your provider
3. Update in repository settings

### For Netlify/Vercel:
1. Go to domain settings
2. Add your custom domain
3. Update DNS records as instructed

---

## Testing on iPhone

Once deployed:

1. Open Safari on your iPhone
2. Navigate to your deployed URL (e.g., https://ealfaro29.github.io/peteyes)
3. Tap the **Share** button
4. Select **Add to Home Screen**
5. Tap **Add**

The app will now appear on your home screen like a native app!

---

## Important Notes

- ✅ HTTPS is **required** for camera access
- ✅ All deployment options above provide HTTPS
- ✅ Service worker will cache the app for offline use
- ✅ PWA features work best in Safari (iOS) and Chrome (Android)

---

## Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS
- Check browser permissions for camera access
- Try in a different browser (Safari for iOS, Chrome for Android)

### PWA Not Installing
- Ensure you're using HTTPS
- Try clearing browser cache
- Check that manifest.json is accessible

### Service Worker Issues
- Clear browser cache
- Check console for errors
- Ensure all files are cached correctly in sw.js

---

## Next Steps

After deployment, consider:
- 📱 Testing on multiple devices
- 🎨 Customizing colors/design
- 🐾 Adding more animals (bird, rabbit, etc.)
- 📊 Adding analytics (privacy-friendly)
- 🌐 Adding translations
