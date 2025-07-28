# Consultancy Feature Design Document

## Overview

The consultancy feature design creates a comprehensive video consultation system that seamlessly integrates with the existing oneedu platform. The design maintains visual consistency with the welcome page's dark theme and orange-pink gradient color scheme while providing robust functionality for mentor-student interactions. The system supports mentor discovery, session scheduling, video consultations, and feedback management through an intuitive and accessible interface.

## Architecture

### System Architecture
```
┌─────────────────────────────────────────┐
│ Frontend (Next.js + React)              │
├─────────────────────────────────────────┤
│ ├─ Consultancy Pages                    │
│ ├─ Video Integration (Jitsi/Agora)      │
│ ├─ Real-time Notifications              │
│ └─ State Management                     │
├─────────────────────────────────────────┤
│ Backend Services                        │
├─────────────────────────────────────────┤
│ ├─ Session Management API               │
│ ├─ Notification Service                 │
│ ├─ Video Service Integration            │
│ └─ Feedback System                      │
├─────────────────────────────────────────┤
│ Database (Supabase)                     │
├─────────────────────────────────────────┤
│ ├─ Sessions Table                       │
│ ├─ Mentors Table (existing)             │
│ ├─ Feedback Table (existing)            │
│ └─ Notifications Table                  │
└─────────────────────────────────────────┘
```

### Page Structure
```
┌─────────────────────────────────────────┐
│ Welcome Page                            │
│ └─ Live Consultancy Feature Card        │
│    └─ Navigate to /consultancy          │
├─────────────────────────────────────────┤
│ Consultancy Main Page (/consultancy)    │
│ ├─ Hero Section                         │
│ ├─ Available Mentors Grid               │
│ └─ How It Works Section                 │
├─────────────────────────────────────────┤
│ Session Request (/consultancy/request)  │
│ ├─ Mentor Profile Summary               │
│ ├─ Request Form                         │
│ └─ Scheduling Interface                 │
├─────────────────────────────────────────┤
│ Session Management (/consultancy/sessions) │
│ ├─ Upcoming Sessions                    │
│ ├─ Session History                      │
│ └─ Join Session Interface               │
├─────────────────────────────────────────┤
│ Video Session (/consultancy/session/[id]) │
│ ├─ Video Interface                      │
│ ├─ Chat Panel                           │
│ └─ Session Controls                     │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### Core Components

#### ConsultancyHero Component
**Purpose:** Main landing section for consultancy feature
**Elements:**
- Gradient headline with consultancy value proposition
- Feature highlights (video calls, expert mentors, flexible scheduling)
- Primary CTA button to browse mentors
- Statistics display (active mentors, sessions completed)

**Styling:**
- Background: Same gradient as welcome page (`#0b0f19` to `#1e1b3a`)
- Headline: Orange-pink gradient text (`#ff6a00` to `#ff1b9c`)
- Cards: Glass effect with white/10 opacity borders

#### MentorCard Component
**Purpose:** Display mentor information in grid layout
**Structure:**
```tsx
interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    avatar_url?: string;
    department: string;
    expertise_tags: string[];
    availability_status: 'available' | 'busy' | 'offline';
    rating: number;
    total_sessions: number;
  };
  onRequestSession: (mentorId: string) => void;
}
```

**Card Design:**
- Semi-transparent background with gradient border
- Avatar with availability status indicator
- Expertise tags with color coding
- Rating display with star icons
- "Request Session" button with gradient styling

#### SessionRequestForm Component
**Purpose:** Handle consultation session requests
**Form Fields:**
- Topic selection (dropdown with predefined options)
- Custom message (textarea)
- Preferred format (video/chat radio buttons)
- Preferred time slots (calendar picker)
- Duration preference (30/60/90 minutes)

**Validation:**
- Required fields: topic, preferred format
- Message length limit: 500 characters
- Time slot must be in the future
- Mentor availability check

#### VideoSessionInterface Component
**Purpose:** Manage video consultation sessions
**Integration Options:**
1. **Jitsi Meet** (Recommended for open-source solution)
   - Fully encrypted, no account needed
   - Custom URL generation
   - Screen sharing capabilities
   - Integrated chat functionality

2. **Agora SDK** (Alternative for advanced features)
   - High-quality video/audio
   - Advanced controls and customization
   - Better mobile support

**Interface Elements:**
- Video display area (mentor and student)
- Audio/video toggle controls
- Screen sharing button
- Chat panel (collapsible)
- Session timer
- End session button

#### SessionHistory Component
**Purpose:** Display past and upcoming sessions
**Features:**
- Filterable session list (upcoming, completed, cancelled)
- Session details modal
- Feedback submission for completed sessions
- Reschedule/cancel options for upcoming sessions

### Data Models

#### Extended Session Model
```typescript
interface ConsultancySession {
  id: string;
  student_id: string;
  mentor_id: string;
  topic: string;
  message?: string;
  preferred_format: 'video' | 'chat';
  duration: number; // minutes
  status: 'requested' | 'accepted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at?: Date;
  started_at?: Date;
  ended_at?: Date;
  video_room_id?: string;
  created_at: Date;
  updated_at: Date;
}
```

#### Mentor Availability Model
```typescript
interface MentorAvailability {
  id: string;
  mentor_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_active: boolean;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}
```

#### Session Feedback Model (extends existing)
```typescript
interface SessionFeedback {
  id: string;
  session_id: string;
  student_id: string;
  mentor_id: string;
  rating: number; // 1-5
  feedback_text?: string;
  would_recommend: boolean;
  session_quality: number; // 1-5
  mentor_helpfulness: number; // 1-5
  created_at: Date;
}
```

## Visual Design System

### Color Palette (Consistent with Welcome Page)
- **Primary Gradient:** `linear-gradient(90deg, #ff6a00, #ff1b9c)`
- **Background Gradient:** `linear-gradient(135deg, #0b0f19 0%, #1e1b3a 100%)`
- **Accent Purple:** `#a05eff`
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#a0a0a0`
- **Card Background:** `rgba(255, 255, 255, 0.05)`
- **Border:** `rgba(255, 255, 255, 0.1)`
- **Success Green:** `#10b981`
- **Warning Orange:** `#f59e0b`
- **Error Red:** `#ef4444`

### Status Indicators
- **Available:** Green dot with pulse animation
- **Busy:** Orange dot with steady glow
- **Offline:** Gray dot with reduced opacity
- **In Session:** Blue dot with animated ring

### Typography (Consistent with Welcome Page)
- **Page Headlines:** 48px (desktop) / 32px (mobile), font-weight: 700
- **Section Titles:** 32px (desktop) / 24px (mobile), font-weight: 600
- **Card Titles:** 20px, font-weight: 600
- **Body Text:** 16px, font-weight: 400
- **Button Text:** 16px, font-weight: 600
- **Caption Text:** 14px, font-weight: 400

### Component Styling

#### Mentor Cards
```css
.mentor-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mentor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 30px rgba(255, 106, 0, 0.2);
  border-color: rgba(255, 106, 0, 0.3);
}
```

#### Status Badges
```css
.status-available {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-busy {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-offline {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}
```

#### Video Interface
```css
.video-container {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.video-controls {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.control-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: rgba(255, 106, 0, 0.2);
  border-color: rgba(255, 106, 0, 0.4);
}
```

## Error Handling

### Session Management Errors
- **Mentor Unavailable:** Display alternative mentor suggestions
- **Scheduling Conflicts:** Show available time slots
- **Video Connection Issues:** Provide fallback to chat mode
- **Session Timeout:** Auto-save session notes and provide reconnection option

### Video Integration Errors
- **Camera/Microphone Access:** Clear permission request with fallback options
- **Network Issues:** Adaptive quality settings and connection status indicator
- **Browser Compatibility:** Feature detection with graceful degradation
- **Mobile Optimization:** Touch-friendly controls and responsive layout

### Fallback Strategies
- **Video Failure:** Automatic fallback to audio-only mode
- **Complete Connection Loss:** Save session state and provide rejoin option
- **Mentor Disconnection:** Notification system and automatic session extension
- **Browser Crashes:** Session recovery with saved state

## Testing Strategy

### Functional Testing
- **Session Flow:** End-to-end testing of request → schedule → conduct → feedback
- **Video Integration:** Cross-browser video calling functionality
- **Real-time Features:** Notification delivery and session state synchronization
- **Mobile Responsiveness:** Touch interactions and mobile video performance

### Performance Testing
- **Video Quality:** Bandwidth adaptation and quality optimization
- **Concurrent Sessions:** Load testing with multiple simultaneous video calls
- **Database Performance:** Query optimization for mentor search and session history
- **Real-time Updates:** WebSocket connection stability and message delivery

### User Experience Testing
- **Accessibility:** Screen reader compatibility and keyboard navigation
- **Visual Consistency:** Color contrast and theme adherence across all pages
- **User Flow:** Intuitive navigation and clear call-to-action placement
- **Error Recovery:** User-friendly error messages and recovery options

### Security Testing
- **Video Privacy:** End-to-end encryption verification
- **Session Access:** Authorization checks for session participants only
- **Data Protection:** Personal information handling and storage security
- **Authentication:** Secure user verification and session management

## Implementation Notes

### Video Integration Approach
**Recommended: Jitsi Meet Integration**
- Embed Jitsi Meet iframe for video sessions
- Custom room generation: `consultancy-${sessionId}-${timestamp}`
- JWT token authentication for secure room access
- Custom UI overlay for session controls

### Real-time Features
- **WebSocket Integration:** For live notifications and session updates
- **Supabase Realtime:** For session status changes and mentor availability
- **Push Notifications:** Browser notifications for session reminders

### Mobile Optimization
- **Responsive Design:** Mobile-first approach with touch-friendly controls
- **PWA Features:** Offline capability for session history and mentor profiles
- **Native App Integration:** Deep linking support for mobile app transitions

### Performance Optimization
- **Lazy Loading:** Mentor profiles and session history pagination
- **Image Optimization:** Avatar and profile image compression
- **Caching Strategy:** Mentor availability and session data caching
- **Bundle Splitting:** Separate video components for on-demand loading