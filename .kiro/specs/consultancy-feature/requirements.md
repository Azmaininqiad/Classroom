# Requirements Document

## Introduction

The consultancy feature extends the existing oneedu platform to provide live video consultation capabilities between students and mentors/counselors. This feature integrates seamlessly with the welcome page and maintains the established dark theme with orange-pink gradient color scheme. The consultancy system enables students to schedule, conduct, and manage video consultation sessions for academic guidance, career counseling, and personalized learning support.

## Requirements

### Requirement 1

**User Story:** As a student visiting the welcome page, I want to easily discover and access the consultancy feature, so that I can schedule video consultations with mentors and counselors.

#### Acceptance Criteria

1. WHEN a user views the welcome page THEN the system SHALL display the "Live Consultancy" feature card in the features section
2. WHEN the Live Consultancy card is displayed THEN the system SHALL show the description "Schedule & conduct student counseling via video"
3. WHEN a user clicks on the Live Consultancy feature card THEN the system SHALL navigate to the consultancy page
4. WHEN the consultancy feature is displayed THEN the system SHALL use the same color theme as the welcome page (dark navy/purple background with orange-pink gradients)

### Requirement 2

**User Story:** As a student, I want to browse available mentors and counselors, so that I can choose the most suitable person for my consultation needs.

#### Acceptance Criteria

1. WHEN a user accesses the consultancy page THEN the system SHALL display a list of available mentors and counselors
2. WHEN displaying mentors THEN the system SHALL show their profile information including name, expertise, department, and availability status
3. WHEN displaying mentors THEN the system SHALL show their profile picture or avatar
4. WHEN displaying mentors THEN the system SHALL indicate their current availability status (available, busy, offline)
5. WHEN displaying mentors THEN the system SHALL show their areas of expertise as tags
6. WHEN a mentor is available THEN the system SHALL allow students to request a consultation session

### Requirement 3

**User Story:** As a student, I want to request a consultation session with a specific mentor, so that I can get personalized guidance and support.

#### Acceptance Criteria

1. WHEN a student selects a mentor THEN the system SHALL display a session request form
2. WHEN filling the request form THEN the system SHALL require the student to specify the consultation topic
3. WHEN filling the request form THEN the system SHALL allow the student to provide additional context or message
4. WHEN filling the request form THEN the system SHALL allow the student to select preferred consultation format (video or chat)
5. WHEN filling the request form THEN the system SHALL allow the student to suggest preferred time slots
6. WHEN the form is submitted THEN the system SHALL send a notification to the selected mentor
7. WHEN the form is submitted THEN the system SHALL create a session record with "requested" status

### Requirement 4

**User Story:** As a mentor, I want to manage consultation requests and schedule sessions, so that I can provide effective guidance to students.

#### Acceptance Criteria

1. WHEN a mentor receives a consultation request THEN the system SHALL send a notification
2. WHEN a mentor views a request THEN the system SHALL display student information, topic, and preferred time
3. WHEN a mentor reviews a request THEN the system SHALL allow them to accept or decline the request
4. WHEN a mentor accepts a request THEN the system SHALL allow them to schedule a specific time for the session
5. WHEN a session is scheduled THEN the system SHALL update the session status to "scheduled"
6. WHEN a session is scheduled THEN the system SHALL send confirmation notifications to both parties

### Requirement 5

**User Story:** As a user (student or mentor), I want to conduct video consultations, so that I can have face-to-face interactions for better communication and guidance.

#### Acceptance Criteria

1. WHEN a scheduled session time arrives THEN the system SHALL provide a "Join Session" button for both participants
2. WHEN a user clicks "Join Session" THEN the system SHALL launch the video consultation interface
3. WHEN the video session is active THEN the system SHALL provide video and audio controls
4. WHEN the video session is active THEN the system SHALL provide chat functionality as backup communication
5. WHEN the session is completed THEN the system SHALL update the session status to "completed"
6. WHEN the session is completed THEN the system SHALL allow the student to provide feedback

### Requirement 6

**User Story:** As a student, I want to view my consultation history and provide feedback, so that I can track my progress and help improve the service quality.

#### Acceptance Criteria

1. WHEN a student accesses their consultation history THEN the system SHALL display all past and upcoming sessions
2. WHEN displaying session history THEN the system SHALL show session date, mentor name, topic, and status
3. WHEN a session is completed THEN the system SHALL allow the student to rate the session (1-5 stars)
4. WHEN providing feedback THEN the system SHALL allow the student to write detailed comments
5. WHEN feedback is submitted THEN the system SHALL store the feedback and associate it with the mentor's profile
6. WHEN viewing mentor profiles THEN the system SHALL display average ratings and recent feedback

### Requirement 7

**User Story:** As a user, I want the consultancy feature to maintain visual consistency with the welcome page, so that I have a seamless and cohesive experience across the platform.

#### Acceptance Criteria

1. WHEN the consultancy pages load THEN the system SHALL use the dark navy/purple background gradient (#0b0f19 to #1e1b3a)
2. WHEN displaying gradient elements THEN the system SHALL use the orange-pink gradient (#ff6a00 to #ff1b9c)
3. WHEN rendering buttons THEN the system SHALL use the primary gradient colors for main actions
4. WHEN rendering secondary buttons THEN the system SHALL use the purple accent color (#a05eff)
5. WHEN displaying cards and components THEN the system SHALL use the same glass effect and border styling as the welcome page
6. WHEN showing interactive elements THEN the system SHALL include the same glow effects and hover animations