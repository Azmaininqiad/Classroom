import { 
  Brain, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Target,
  GraduationCap,
  Video
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// TypeScript interfaces for content management
export interface BadgeContent {
  icon: LucideIcon;
  text: string;
  ariaLabel?: string;
}

export interface HeroContent {
  badge: BadgeContent;
  headline: {
    primary: string;
    secondary: string;
  };
  description: string;
  ctaButtons: {
    primary: {
      text: string;
      ariaLabel: string;
      icon: LucideIcon;
    };
    secondary: {
      text: string;
      ariaLabel: string;
      icon: LucideIcon;
    };
  };
}

export interface FeatureTag {
  text: string;
  color: 'orange' | 'pink' | 'purple';
}

export interface FeatureContent {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags?: FeatureTag[];
  features?: string[];
  buttonText: string;
  buttonAriaLabel: string;
  visualType: 'icon' | 'chart' | 'dashboard';
  visualData?: {
    value?: string;
    label?: string;
  };
}

export interface SectionContent {
  id: string;
  title: string;
  description: string;
  ariaLabel: string;
}

export interface StatisticContent {
  value: string;
  label: string;
  gradient: 'orange-pink' | 'pink-purple' | 'purple-orange' | 'orange-purple';
}

export interface TestimonialContent {
  id: string;
  rating: number;
  text: string;
  author: {
    name: string;
    title: string;
    avatar: LucideIcon;
  };
  gradient: 'orange-pink' | 'purple-pink';
}

export interface ChatbotSectionContent {
  badge: BadgeContent;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonAriaLabel: string;
}

export interface WelcomePageContent {
  hero: HeroContent;
  featuresSection: SectionContent;
  features: FeatureContent[];
  chatbotSection: ChatbotSectionContent;
  statisticsSection: SectionContent;
  statistics: StatisticContent[];
  testimonialsSection: SectionContent;
  testimonials: TestimonialContent[];
}

// Content configuration object
export const welcomePageContent: WelcomePageContent = {
  hero: {
    badge: {
      icon: Sparkles,
      text: "The future of education is here",
      ariaLabel: "Announcement: The future of education is here"
    },
    headline: {
      primary: "AI-powered education",
      secondary: "for the next generation"
    },
    description: "Generate comprehensive, media-rich courses on any topic in minutes. Transform how knowledge is created, shared, and consumed with the power of artificial intelligence.",
    ctaButtons: {
      primary: {
        text: "Get started for free",
        ariaLabel: "Sign up to get started for free",
        icon: ArrowRight
      },
      secondary: {
        text: "Watch demo",
        ariaLabel: "Watch product demonstration video",
        icon: Play
      }
    }
  },
  featuresSection: {
    id: "features",
    title: "There's nothing you can't teach with oneedu",
    description: "Our customers' words, not ours. From K-12 to higher education to corporate training.",
    ariaLabel: "Platform features"
  },
  features: [
    {
      id: "smart-classroom",
      icon: Users,
      title: "Smart Classroom Management",
      description: "Manage classes, assignments, and grades in one unified platform. AI-powered insights help track student progress and identify areas for improvement in real-time.",
      tags: [
        { text: "Real-time Analytics", color: "orange" },
        { text: "Grade Management", color: "pink" },
        { text: "Student Tracking", color: "purple" }
      ],
      buttonText: "Explore Classroom",
      buttonAriaLabel: "Explore Smart Classroom Management features",
      visualType: "dashboard",
      visualData: { label: "Interactive Dashboard" }
    },
    {
      id: "ai-grading",
      icon: Brain,
      title: "AI-Powered Grading",
      description: "Automate tasks like grading and providing instant answers to learner queries so you can focus on delivering high-quality content and enhancing the learning experience.",
      features: [
        "Instant feedback generation",
        "24/7 AI support available",
        "Personalized learning paths"
      ],
      buttonText: "Try AI Grading",
      buttonAriaLabel: "Try AI-Powered Grading features",
      visualType: "chart",
      visualData: { value: "75%", label: "Grade Accuracy" }
    },
    {
      id: "social-learning",
      icon: MessageSquare,
      title: "Social Learning Network",
      description: "Feed and profiles like social media to boost collaboration. Connect students, educators, and institutions in an engaging learning environment that promotes knowledge sharing.",
      features: [
        "Global Community",
        "Real-time Chat"
      ],
      buttonText: "Join Community",
      buttonAriaLabel: "Join Social Learning Community",
      visualType: "icon",
      visualData: { label: "Social Learning Hub" }
    },
    {
      id: "course-creation",
      icon: BookOpen,
      title: "Auto Course Creation",
      description: "Instantly generate full learning paths and quizzes. AI creates comprehensive course content, assessments, and interactive materials tailored to your curriculum needs.",
      features: [
        "Curriculum-aligned content",
        "Interactive assessments",
        "Multi-media integration"
      ],
      buttonText: "Create Course",
      buttonAriaLabel: "Create AI-Generated Course",
      visualType: "icon",
      visualData: { label: "Course Generator" }
    },
    {
      id: "live-consultancy",
      icon: Video,
      title: "Live Consultancy",
      description: "Schedule & conduct student counseling via video. Connect with expert mentors and counselors for personalized guidance through secure video consultations.",
      features: [
        "Expert mentor network",
        "Secure video sessions",
        "Flexible scheduling"
      ],
      buttonText: "Book Consultation",
      buttonAriaLabel: "Book Live Video Consultation",
      visualType: "icon",
      visualData: { label: "Video Consultation" }
    }
  ],
  chatbotSection: {
    badge: {
      icon: Brain,
      text: "AI-Powered Learning Assistant"
    },
    title: "Meet your personal AI teacher",
    description: "Get instant answers, personalized explanations, and 24/7 support from our advanced AI chatbot. It's like having a knowledgeable teacher available whenever you need help.",
    features: [
      "Instant answers to any question",
      "Personalized learning recommendations",
      "Multi-language support"
    ],
    buttonText: "Chat with AI Teacher",
    buttonAriaLabel: "Start chatting with AI teacher"
  },
  statisticsSection: {
    id: "statistics",
    title: "Trusted by educators worldwide",
    description: "Join thousands of institutions and millions of learners who have transformed their education experience",
    ariaLabel: "Platform statistics"
  },
  statistics: [
    { value: "10M+", label: "Active Students", gradient: "orange-pink" },
    { value: "50K+", label: "Expert Teachers", gradient: "pink-purple" },
    { value: "1K+", label: "Institutions", gradient: "purple-orange" },
    { value: "95%", label: "Success Rate", gradient: "orange-purple" }
  ],
  testimonialsSection: {
    id: "testimonials",
    title: "What our users say",
    description: "Real stories from educators and students who have transformed their learning experience",
    ariaLabel: "User testimonials"
  },
  testimonials: [
    {
      id: "testimonial-1",
      rating: 5,
      text: "oneedu has completely transformed how I teach. The AI grading system saves me hours every week, and my students are more engaged than ever.",
      author: {
        name: "Dr. Sarah Johnson",
        title: "Professor, MIT",
        avatar: Users
      },
      gradient: "orange-pink"
    },
    {
      id: "testimonial-2",
      rating: 5,
      text: "The social learning features helped me connect with students from around the world. It's like having a global classroom at my fingertips.",
      author: {
        name: "Maria Rodriguez",
        title: "Student, Stanford",
        avatar: Users
      },
      gradient: "purple-pink"
    }
  ]
};

// Utility functions for content management
export const getFeatureById = (id: string): FeatureContent | undefined => {
  return welcomePageContent.features.find(feature => feature.id === id);
};

export const getTestimonialById = (id: string): TestimonialContent | undefined => {
  return welcomePageContent.testimonials.find(testimonial => testimonial.id === id);
};

export const getGradientClasses = (gradient: string): string => {
  const gradientMap = {
    'orange-pink': 'from-[#ff6a00] to-[#ff1b9c]',
    'pink-purple': 'from-[#ff1b9c] to-[#a05eff]',
    'purple-orange': 'from-[#a05eff] to-[#ff6a00]',
    'orange-purple': 'from-[#ff6a00] to-[#a05eff]'
  };
  return gradientMap[gradient as keyof typeof gradientMap] || gradientMap['orange-pink'];
};

export const getTagColorClasses = (color: FeatureTag['color']): string => {
  const colorMap = {
    'orange': 'bg-[#ff6a00]/20 text-[#ff6a00] border-[#ff6a00]/30',
    'pink': 'bg-[#ff1b9c]/20 text-[#ff1b9c] border-[#ff1b9c]/30',
    'purple': 'bg-[#a05eff]/20 text-[#a05eff] border-[#a05eff]/30'
  };
  return colorMap[color];
};