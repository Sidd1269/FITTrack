# GymTracker Pro 💪

A comprehensive mobile-first web application for tracking gym workouts, monitoring progress, and getting personalized fitness insights.

## Features

### 🏋️ Workout Tracking
- Log exercises with sets, reps, and weights
- Track rest times between sets
- Save and organize workout sessions
- Quick exercise addition and modification

### 📊 Progress Analytics
- Visual progress charts and graphs
- Training volume tracking over time
- Exercise performance analytics
- Weekly and monthly progress views

### 🎯 Smart Insights
- Personalized workout suggestions
- Progress recommendations
- Performance trend analysis
- Goal tracking and milestones

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Offline capability with local storage
- Progressive Web App (PWA) ready

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with React integration
- **Backend**: Firebase (Firestore, Authentication)
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-tracking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (optional)
   - Copy your Firebase config

4. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Logging a Workout
1. Click the "Track" tab in the bottom navigation
2. Enter a workout name and select the date
3. Add exercises by typing the exercise name
4. For each exercise, add sets with reps, weight, and rest time
5. Save your workout

### Viewing Progress
1. Navigate to the "Progress" tab
2. View your training statistics and charts
3. Filter by time range (7, 30, or 90 days)
4. Get personalized suggestions for improvement

### Workout History
1. Go to the "History" tab
2. Browse all your past workouts
3. Click on any workout to view details
4. Delete workouts if needed

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── WorkoutForm.tsx    # Workout logging form
│   ├── ProgressDashboard.tsx # Analytics dashboard
│   └── RecentWorkouts.tsx # Workout history
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   └── workoutService.ts  # Workout data management
└── public/               # Static assets
```

## Features Roadmap

### Phase 1 (Current)
- [x] Basic workout logging
- [x] Progress tracking with charts
- [x] Local storage for data persistence
- [x] Mobile-responsive UI

### Phase 2 (Next)
- [ ] Firebase integration for cloud storage
- [ ] User authentication
- [ ] Exercise database with suggestions
- [ ] Calorie tracking integration
- [ ] Workout templates and routines

### Phase 3 (Future)
- [ ] Social features and sharing
- [ ] AI-powered workout recommendations
- [ ] Nutrition tracking
- [ ] Wearable device integration
- [ ] Advanced analytics and insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Training! 🏋️‍♂️💪**
