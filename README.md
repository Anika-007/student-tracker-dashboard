# Student Tracker - Teacher Dashboard

A comprehensive full-stack web application for teachers to track and analyze student academic and behavioral data over time.

## 🎯 Features

### Core Functionality
- **Teacher Dashboard**: Input and manage student data with intuitive forms
- **Data Synthesis**: Visualize performance trends with interactive charts
- **AI Insights**: Automatic generation of actionable insights for students and sections
- **Real-time Updates**: Data syncs instantly across the application
- **No-Login Mode**: Use the app without authentication, data saved locally
- **Seamless Login**: Sign in anytime to sync local data to the cloud
- **Google Sheets Export**: Export all data to Google Sheets with one click

### Data Management
- **Hierarchical Structure**: Grade → Section → Student
- **Academic Tracking**: Record unit test scores with timestamps
- **Behavioral Tracking**: Self and peer descriptive words (2-4 words each)
- **Edit & Delete**: Full CRUD operations on all data
- **Persistent Storage**: Firebase Firestore for authenticated users, localStorage for guests

### Visualizations
- **Student-Level Charts**: Line graphs showing performance over time
- **Section-Level Charts**: Class averages and comparative bar charts
- **Behavioral Analysis**: Word frequency visualization
- **Trend Analysis**: Automatic detection of improvement or decline

### AI Insights
- **Student Insights**: Performance trends, strengths, weaknesses, recommendations
- **Section Insights**: Class average, top performers, students needing attention
- **Smart Analysis**: Considers both academic and behavioral data

## 🛠️ Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: TailwindCSS with custom animations
- **Charts**: Recharts for data visualization
- **Backend**: Firebase (Firestore + Authentication)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI**: OpenAI API (optional)
- **Export**: Google Sheets API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- (Optional) OpenAI API key for enhanced AI insights
- (Optional) Google Cloud project for Sheets export

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
cd /Users/AM70864/CascadeProjects/student-tracker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in method
4. Enable **Firestore Database** → Start in production mode
5. Go to Project Settings → General → Your apps
6. Copy your Firebase config

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: For enhanced AI insights
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: For Google Sheets export
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Firestore Security Rules

In Firebase Console → Firestore Database → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /students/{studentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /testScores/{scoreId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /behavioralData/{entryId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. (Optional) Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Copy the Client ID to your `.env` file

### 6. (Optional) OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env` file

## 🎮 Running the Application

### Development Mode

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Getting Started

1. **No Login Required**: Start using immediately without authentication
2. **Add Students**: Click "Add Student" and fill in name, grade, section
3. **Select Student**: Click on a student from the list
4. **Add Data**:
   - Click "Add Score" to record test results
   - Click "Add Entry" to record behavioral data
5. **View Insights**: Navigate to "Data Synthesis" page

### Data Synthesis

1. Choose between **Section View** or **Student View**
2. Select grade and section (and student if in Student View)
3. View:
   - Interactive charts
   - AI-generated insights
   - Performance trends
   - Behavioral patterns

### Signing In

1. Click "Sign In" in the top right
2. Create an account or sign in
3. **Your existing data will be automatically synced** to your account
4. Access your data from any device

### Exporting to Google Sheets

1. Go to Data Synthesis page
2. Click "Export to Google Sheets"
3. Authorize with Google
4. Data will be exported to a new spreadsheet with:
   - Students table
   - Test Scores table
   - Behavioral Data table

## 🗂️ Project Structure

```
student-tracker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx       # Main layout with navigation
│   │   ├── AuthModal.jsx    # Login/signup modal
│   │   ├── StudentForm.jsx  # Add/edit student form
│   │   ├── TestScoreForm.jsx
│   │   └── BehavioralForm.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── DataContext.jsx  # Data management & real-time updates
│   ├── pages/               # Main application pages
│   │   ├── Dashboard.jsx    # Teacher dashboard
│   │   └── DataSynthesis.jsx # Charts & insights
│   ├── utils/               # Utility functions
│   │   ├── sessionManager.js # Local storage management
│   │   ├── aiInsights.js    # AI insight generation
│   │   └── googleSheets.js  # Google Sheets integration
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # This file
```

## 🔑 Key Features Explained

### No-Login Behavior

- Data is stored in `localStorage` with a unique session ID
- When user signs in, session data is automatically migrated to Firestore
- No data loss occurs during the transition
- Users can continue working seamlessly

### Real-Time Updates

- Firebase Firestore listeners automatically update UI
- Changes reflect immediately across all components
- No manual refresh needed

### AI Insights

The app generates insights by analyzing:
- **Academic trends**: Score progression, averages, consistency
- **Behavioral patterns**: Word frequency, sentiment indicators
- **Performance metrics**: Improvement/decline detection
- **Recommendations**: Actionable suggestions for teachers

If OpenAI API key is provided, enhanced AI insights are generated.

### Data Schema

**Students Collection:**
```javascript
{
  id: string,
  name: string,
  grade: string,
  section: string,
  userId: string
}
```

**Test Scores Collection:**
```javascript
{
  id: string,
  studentId: string,
  testName: string,
  score: number,
  date: string,
  userId: string
}
```

**Behavioral Data Collection:**
```javascript
{
  id: string,
  studentId: string,
  selfWords: string[],
  peerWords: string[],
  date: string,
  userId: string
}
```

## 🎨 UI/UX Features

- **Clean Design**: Minimal, teacher-friendly interface
- **Smooth Animations**: Fade-in and slide-up transitions
- **Responsive**: Works on desktop, tablet, and mobile
- **Color-Coded**: Different colors for different data types
- **Hover Effects**: Interactive feedback on all buttons
- **Loading States**: Clear indicators during operations

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify `.env` file has correct credentials
- Check Firebase project is active
- Ensure Firestore is enabled

### Charts Not Displaying
- Ensure students have test scores recorded
- Check browser console for errors
- Verify date formats are valid

### Google Sheets Export Not Working
- Verify Google Client ID is correct
- Check authorized origins in Google Cloud Console
- Ensure Google Sheets API is enabled

### Data Not Syncing After Login
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for errors

## 📝 License

This project is created for educational purposes.

## 🤝 Support

For issues or questions, check the browser console for error messages and verify all configuration steps are completed.

---

**Built with ❤️ for teachers**
