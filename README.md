# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Building for iOS/Android with Capacitor

To build native iOS/Android apps, follow these steps:

```sh
# Step 1: Clone and install dependencies
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install

# Step 2: Build the web app
npm run build

# Step 3: Initialize Capacitor (if not already done)
npx cap init

# Step 4: Add platforms
npx cap add ios
npx cap add android

# Step 5: Sync the web build to native projects
npx cap sync

# Step 6: Open in native IDE
npx cap open ios      # Opens Xcode (Mac required)
npx cap open android  # Opens Android Studio

# After making code changes, rebuild and sync:
npm run build && npx cap sync
```

### Capacitor Responsiveness Patch

For optimal display on all devices, ensure these are in place:

1. **Viewport meta tag** (in index.html):
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

2. **Safe area CSS** (in index.css):
```css
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
}

body {
  min-height: 100dvh;
}
```

3. **Bottom padding** for scrollable content:
```css
padding-bottom: calc(110px + var(--safe-bottom));
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
