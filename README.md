<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 11x Engine — Multi-Model AI Comparison Tool

Compare responses from GPT-4o, Claude, Gemini, and more — side by side, in real time.

---

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- A code editor (see Step 1 below)
- An [OpenRouter](https://openrouter.ai) account
- A [Firebase](https://console.firebase.google.com) project

---

## Step 1 — Download the code

**Option A: Clone with Git**
```bash
git clone https://github.com/khizerjk87/11xEngine.git
cd 11xEngine
```

**Option B: Download ZIP**
1. Go to [github.com/khizerjk87/11xEngine](https://github.com/khizerjk87/11xEngine)
2. Click the green **"Code"** button → **"Download ZIP"**
3. Extract the ZIP to a folder of your choice

---

## Step 2 — Open in your code editor

Once you have the folder, open it in your editor:

| Editor | How to open |
|---|---|
| **Cursor** | File → Open Folder → select the `11xEngine` folder |
| **Windsurf** | File → Open Folder → select the `11xEngine` folder |
| **VS Code** | File → Open Folder → select the `11xEngine` folder |
| **Antigravity** | File → Open Folder → select the `11xEngine` folder |

Or from the terminal inside any of these editors:
```bash
code .         # VS Code
cursor .       # Cursor
windsurf .     # Windsurf
```

---

## Step 3 — Set up your environment file

In the root of the project, copy the example file:

```bash
cp .env.local.example .env.local
```

On Windows (Command Prompt):
```cmd
copy .env.local.example .env.local
```

Then open `.env.local` — you'll fill in the values in the next two steps.

---

## Step 4 — Get your OpenRouter API key

OpenRouter gives you access to GPT-4o, Claude, Gemini, and many other models through a single API.

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account
2. Navigate to **Keys** → click **"Create Key"**
3. Give it a name and click **Create**
4. Copy the key and paste it into `.env.local`:

```
OPENROUTER_API_KEY=your_key_here
```

> You'll need to add credits at [openrouter.ai/credits](https://openrouter.ai/credits) to use paid models. Many models have free tiers.

---

## Step 5 — Connect your Firebase project

Firebase handles user authentication and saving chat history.

### 5a — Create a Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → enter a name → click through to **"Create project"**

### 5b — Enable Authentication
1. In the left sidebar → **Build → Authentication → Get started**
2. Under **Sign-in providers**, click **Google** → toggle **Enable** → add a support email → **Save**

### 5c — Create a Firestore Database
1. In the left sidebar → **Build → Firestore Database → Create database**
2. Choose **"Start in production mode"** → pick a region → **Enable**
3. Go to the **Rules** tab and replace the contents with:
```
rules_version = '2';
service cloud.firestore.rules {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
4. Click **Publish**

### 5d — Register a Web App and copy config
1. From the project overview, click the **`</>`** (Web) icon
2. Enter an app nickname → **Register app**
3. You'll see a `firebaseConfig` object — copy each value into `.env.local`:

```
FIREBASE_API_KEY=          ← apiKey
FIREBASE_AUTH_DOMAIN=      ← authDomain
FIREBASE_PROJECT_ID=       ← projectId
FIREBASE_STORAGE_BUCKET=   ← storageBucket
FIREBASE_MESSAGING_SENDER_ID= ← messagingSenderId
FIREBASE_APP_ID=           ← appId
FIREBASE_MEASUREMENT_ID=   ← measurementId
```

---

## Step 6 — Install dependencies and run

Open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Your `.env.local` should look like this when complete

```
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=your_gemini_key_or_leave_blank

FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> `.env.local` is gitignored and will never be committed. Your keys stay on your machine only.
