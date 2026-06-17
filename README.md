# AI Voice Agent Interview Platform

A modern, AI-powered interview practice platform that enables users to conduct realistic voice interviews with an AI interviewer. Built with Next.js, Firebase, and Vapi AI for real-time voice interactions.

## 🚀 Features

### Core Functionality
- **AI-Powered Voice Interviews**: Conduct realistic interviews with an AI interviewer using natural voice conversations
- **Real-time Speech Recognition**: Powered by Deepgram for accurate transcriptions
- **Natural Voice Synthesis**: Uses 11labs for human-like AI voice responses
- **Interview Generation**: AI-generated interview questions based on role, level, and tech stack
- **Comprehensive Feedback**: Detailed scoring and feedback across multiple categories
- **User Authentication**: Secure Firebase-based authentication system

### Interview Types
- **Technical Interviews**: Focus on technical skills and knowledge
- **Behavioral Interviews**: Assess soft skills and cultural fit
- **Mixed Interviews**: Combination of technical and behavioral questions

### Feedback System
- **Communication Skills**: Evaluation of verbal communication abilities
- **Technical Knowledge**: Assessment of domain-specific expertise
- **Problem Solving**: Analysis of logical thinking and solution approaches
- **Cultural Fit**: Evaluation of team compatibility and values alignment
- **Confidence and Clarity**: Assessment of presentation and self-assurance

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Backend & AI
- **Firebase**: Authentication and database
- **Vapi AI**: Voice AI platform for real-time conversations
- **Google AI SDK**: AI-powered question generation
- **Deepgram**: Speech-to-text transcription
- **11labs**: Text-to-speech synthesis

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundling for development


## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-voice-agent-interview-platform.git
   cd ai-voice-agent-interview-platform/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Download service account key and add to environment variables

4. **Configure Vapi AI**
   - Sign up for Vapi AI
   - Create a workflow for interview generation
   - Add API key to environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Starting an Interview

1. **Navigate to the interview page**
   - Click "Start an Interview" on the homepage
   - Or visit `/interview` directly

2. **Configure interview parameters**
   - Select job role (e.g., Frontend Developer)
   - Choose experience level (Junior, Mid, Senior)
   - Specify interview type (Technical, Behavioral, Mixed)
   - Add relevant tech stack
   - Set number of questions

3. **Begin the interview**
   - Click "Start Call" to begin
   - Speak naturally with the AI interviewer
   - Answer questions as you would in a real interview

### Reviewing Feedback

1. **Access feedback after interview completion**
   - Navigate to `/interview/[id]/feedback`
   - View detailed scoring across categories
   - Review strengths and areas for improvement

2. **Track interview history**
   - View all past interviews on the homepage
   - Access feedback for any completed interview


**Built with ❤️ using Next.js, Firebase, and Vapi AI**
