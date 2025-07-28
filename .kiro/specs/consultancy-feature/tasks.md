# Implementation Plan

- [x] 1. Set up consultancy page structure and routing
  - Create the main consultancy page component at `app/consultancy/page.tsx`
  - Configure Next.js routing to handle the consultancy page route
  - Set up basic page layout with semantic HTML structure using welcome page color theme
  - Import and apply welcome page CSS variables and gradient classes
  - _Requirements: 1.1, 1.3, 7.1, 7.2_

- [x] 2. Update welcome page to include consultancy feature card
  - Modify `lib/welcome-content.ts` to include Live Consultancy feature in the features array
  - Update the feature card with appropriate icon, title, and description
  - Add navigation handler for consultancy feature card click
  - Ensure consultancy card uses consistent styling with other feature cards
  - _Requirements: 1.1, 1.2, 1.4, 7.3, 7.4_

- [x] 3. Create consultancy hero section component
  - Build `ConsultancyHero` component with gradient headline and value proposition
  - Implement feature highlights section (video calls, expert mentors, flexible scheduling)
  - Add primary CTA button to browse mentors using welcome page button styling
  - Include statistics display for active mentors and completed sessions
  - Apply welcome page background gradient and text styling
  - _Requirements: 1.4, 7.1, 7.2, 7.5_

- [ ] 4. Implement mentor card component with availability status
  - Create `MentorCard` component displaying mentor profile information
  - Add mentor avatar with availability status indicator (available, busy, offline)
  - Display mentor expertise tags with color coding using welcome page accent colors
  - Include rating display with star icons and session count
  - Add "Request Session" button with gradient styling matching welcome page
  - Implement hover effects and glow animations consistent with welcome page
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.3, 7.4, 7.6_

- [ ] 5. Create mentor grid layout and filtering
  - Build `MentorGrid` component to display available mentors in responsive grid
  - Implement filtering by department, expertise, and availability status
  - Add search functionality for mentor names and specializations
  - Create loading states and empty states with welcome page styling
  - Ensure responsive design works across mobile, tablet, and desktop
  - _Requirements: 2.1, 2.2, 2.4, 7.5_

- [ ] 6. Implement session request form component
  - Create `SessionRequestForm` component with topic selection dropdown
  - Add custom message textarea with character limit validation
  - Implement preferred format selection (video/chat) with radio buttons
  - Add preferred time slots selection with calendar picker integration
  - Include duration preference selection (30/60/90 minutes)
  - Apply form validation and error handling with welcome page error styling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.3, 7.4_

- [ ] 7. Create session request page and routing
  - Build session request page at `app/consultancy/request/[mentorId]/page.tsx`
  - Display mentor profile summary with consistent card styling
  - Integrate SessionRequestForm component
  - Add form submission handling and success/error states
  - Implement navigation back to mentor grid
  - _Requirements: 3.1, 3.6, 3.7, 7.1, 7.5_

- [ ] 8. Implement session management database operations
  - Create database functions for session CRUD operations in `lib/consultancy.ts`
  - Implement session request creation with proper data validation
  - Add session status update functions (requested, accepted, scheduled, etc.)
  - Create mentor availability checking functions
  - Add error handling and transaction management
  - _Requirements: 3.6, 3.7, 4.4, 4.5_

- [ ] 9. Build session history and management page
  - Create sessions page at `app/consultancy/sessions/page.tsx`
  - Implement `SessionHistory` component with filterable session list
  - Display upcoming sessions with join buttons and session details
  - Show completed sessions with feedback options
  - Add session cancellation and rescheduling functionality
  - Apply welcome page styling to all session cards and buttons
  - _Requirements: 6.1, 6.2, 4.1, 4.2, 7.1, 7.3_

- [ ] 10. Create notification system for session updates
  - Implement real-time notifications using Supabase realtime subscriptions
  - Create notification components with welcome page styling
  - Add notification handlers for session requests, acceptances, and reminders
  - Implement browser push notifications for session alerts
  - Create notification history and management interface
  - _Requirements: 3.6, 4.1, 4.6_

- [ ] 11. Implement video session interface with Jitsi integration
  - Create video session page at `app/consultancy/session/[id]/page.tsx`
  - Integrate Jitsi Meet iframe for video consultations
  - Build custom video controls overlay with welcome page styling
  - Implement session timer and participant status indicators
  - Add chat panel integration with collapsible design
  - Create session end functionality with automatic status updates
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.6_

- [ ] 12. Build feedback system for completed sessions
  - Create `FeedbackForm` component for session rating and comments
  - Implement 5-star rating system with interactive star icons
  - Add detailed feedback textarea with character limits
  - Include additional rating categories (session quality, mentor helpfulness)
  - Create feedback submission handling and success states
  - Display feedback in mentor profiles and session history
  - _Requirements: 6.3, 6.4, 6.5, 6.6, 7.3_

- [ ] 13. Implement mentor dashboard for session management
  - Create mentor dashboard page for managing consultation requests
  - Build request queue component showing pending session requests
  - Add request acceptance/decline functionality with reason options
  - Implement session scheduling interface with calendar integration
  - Create mentor availability management system
  - Apply consistent styling with welcome page theme
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.1_

- [ ] 14. Add responsive design and mobile optimization
  - Ensure all consultancy pages work properly on mobile devices
  - Optimize video interface for mobile touch interactions
  - Test and adjust mentor card grid layout for different screen sizes
  - Implement mobile-friendly session request form
  - Verify welcome page color theme consistency across all breakpoints
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 15. Implement error handling and loading states
  - Add comprehensive error boundaries for all consultancy components
  - Create loading skeletons with welcome page styling
  - Implement retry mechanisms for failed video connections
  - Add fallback states for offline scenarios
  - Create user-friendly error messages with consistent styling
  - _Requirements: 5.2, 5.3, 7.1, 7.3_

- [ ] 16. Add accessibility features and testing
  - Implement proper ARIA labels and semantic HTML throughout
  - Ensure keyboard navigation works for all interactive elements
  - Add screen reader support for video session controls
  - Test color contrast ratios meet WCAG guidelines with welcome page colors
  - Implement focus indicators consistent with welcome page styling
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 17. Create integration tests and performance optimization
  - Write end-to-end tests for complete session flow
  - Test video integration functionality across different browsers
  - Implement performance monitoring for video session quality
  - Optimize database queries for mentor search and session history
  - Add caching strategies for mentor profiles and availability data
  - _Requirements: 2.1, 3.1, 5.1, 6.1_

- [ ] 18. Final integration and deployment preparation
  - Test complete user flow from welcome page to session completion
  - Verify all components use welcome page color theme consistently
  - Conduct cross-browser testing for video functionality
  - Optimize bundle size and implement code splitting for video components
  - Create deployment configuration and environment variable setup
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_