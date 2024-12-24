# Deployment Guide

## Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Test the production build locally:
```bash
npm run preview
# or
yarn preview
```

## Deployment Options

### 1. Vercel (Recommended)

The easiest way to deploy:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure your environment variables
5. Deploy

### 2. Netlify

Another great option:

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Configure your environment variables
5. Deploy

### 3. GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## Installing on Devices

### iPad

1. Open Safari and navigate to your deployed app
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name your app and tap "Add"

### Chromebook

1. Open Chrome and navigate to your deployed app
2. Click the install icon in the address bar (or three dots menu)
3. Click "Install"

## Environment Variables

Create a `.env` file with these variables:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

## PWA Features

The app includes:
- Offline functionality
- Home screen installation
- Push notifications (if enabled)
- Responsive design
- Touch optimization

## Performance Optimization

1. Images are pre-cached
2. Critical CSS is inlined
3. JavaScript is split into chunks
4. Assets are compressed

## Security Considerations

1. Use HTTPS
2. Configure CSP headers
3. Enable CORS appropriately
4. Sanitize user input
5. Implement rate limiting

## Troubleshooting

### Common Issues

1. White screen after installation:
   - Clear browser cache
   - Reinstall the app

2. Offline mode not working:
   - Check if service worker is registered
   - Clear browser cache

3. Push notifications not working:
   - Check browser permissions
   - Verify SSL certificate

### Debug Mode

Add to URL for debug info:
```
?debug=true
```

## Monitoring

1. Use browser developer tools
2. Check service worker status
3. Monitor network requests
4. Check console for errors

## Updates

The app will automatically update when:
1. A new version is deployed
2. The service worker detects changes
3. The user refreshes the page

## Support

For issues:
1. Check browser compatibility
2. Verify internet connection
3. Clear cache and cookies
4. Reinstall if necessary
