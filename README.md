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

The app includes automated GitHub Actions deployment. Follow these simple steps:

### Setup (One-Time)

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
4. That's it! The workflow will automatically deploy on every push

### Automatic Deployment

The app will automatically build and deploy to GitHub Pages whenever you push to this branch. The workflow:
- Installs dependencies
- Builds the production version
- Deploys to: `https://shajin-sha.github.io/co-tracker/`

### Manual Deployment

If you need to deploy manually or trigger a deployment:
1. Go to **Actions** tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow**

### Important Note

The production build is configured with the base path `/co-tracker/` to work with GitHub Pages. If you deploy elsewhere, update the `base` setting in `vite.config.js`.

## Tech Stack

- React 19
- Vite 7
- LocalStorage for persistence
- Responsive CSS with gradients

## License

MIT
