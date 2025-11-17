# SaaS Outreach Tracker

A simple, efficient tracker for managing cold outreach campaigns to reach your $500 MRR goal.

## Features

- **Dashboard Analytics**: Real-time funnel metrics and MRR tracking
- **Entry Management**: Modal popup form for adding/editing prospect entries
- **Searchable Niches**: 50+ predefined niches for targeted outreach
- **LocalStorage Persistence**: All data saved automatically in browser
- **Visual Funnel**: Track conversion rates at each stage
- **Goal Tracking**: Monitor progress toward $500 MRR target
- **Responsive Design**: Works on desktop and mobile

## Fields Tracked

Each outreach entry includes:
- Name & Profile Link
- Niche (searchable dropdown)
- Contact Type (DM/Email)
- First Message Date
- Replied (Y/N)
- Sent Concepts (Y/N)
- Signed Up (Y/N)
- Paid (Y/N)
- MRR Amount
- Notes

## Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Deploying to GitHub Pages

The app is pre-configured for GitHub Pages deployment. Follow these steps:

### Option 1: Using GitHub Settings (Recommended)

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: Select **Deploy from a branch**
   - Branch: Select **claude/saas-outreach-tracker-018ZrThAMYeVWw5XmwqdYKTD**
   - Folder: Select **/dist**
4. Click **Save**
5. GitHub will deploy your site to: `https://<username>.github.io/co-tracker/`

### Option 2: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` folder and are already committed to this branch

3. Configure GitHub Pages to use the `dist` folder from this branch

### Note

The production build is configured with the base path `/co-tracker/` to work with GitHub Pages. If you deploy elsewhere, update the `base` setting in `vite.config.js`.

## Tech Stack

- React 19
- Vite 7
- LocalStorage for persistence
- Responsive CSS with gradients

## License

MIT
