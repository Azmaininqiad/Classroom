'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { WelcomeButton } from '@/components/WelcomeButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AuthDialog from '@/components/AuthDialog';
import { 
  welcomePageContent, 
  getGradientClasses, 
  getTagColorClasses,
  type FeatureContent 
} from '@/lib/welcome-content';
import { FeatureCard } from '@/components/FeatureCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LazyWrapper } from '@/components/LazyWrapper';
import { createPerformanceMonitor } from '@/lib/performance';
import {
  Brain,
  Users,
  BookOpen,
  MessageSquare,
  GraduationCap,
  CheckCircle,
  Zap,
  Globe,
  Target,
  Play,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Performance monitoring
  const performanceMonitor = useMemo(() => createPerformanceMonitor(), []);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
      
      // Mark load complete and start monitoring
      performanceMonitor.markLoadComplete();
      performanceMonitor.measureCoreWebVitals();
    };

    checkUser();
  }, [performanceMonitor]);

  useEffect(() => {
    if (!loading) {
      performanceMonitor.markRenderComplete();
      performanceMonitor.logMetrics();
    }
  }, [loading, performanceMonitor]);

  const handleAuthSuccess = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleGetStarted = useCallback(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthOpen(true);
    }
  }, [user, router]);

  const handleWatchDemo = useCallback(() => {
    // TODO: Implement demo functionality
    console.log('Watch demo clicked');
  }, []);

  const handleSmartClassroom = useCallback(() => {
    router.push('/classroom');
  }, [router]);

  const handleAIGrading = useCallback(() => {
    router.push('/mcqgeneration');
  }, [router]);

  const handleSocialLearning = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleCourseCreation = useCallback(() => {
    router.push('/coursepage');
  }, [router]);

  const handleChatbot = useCallback(() => {
    router.push('/chatbot');
  }, [router]);

  const handleConsultancy = useCallback(() => {
    router.push('/consultancy');
  }, [router]);

  const featureHandlers = useMemo(() => ({
    'smart-classroom': handleSmartClassroom,
    'ai-grading': handleAIGrading,
    'social-learning': handleSocialLearning,
    'course-creation': handleCourseCreation,
    'live-consultancy': handleConsultancy,
  }), [handleSmartClassroom, handleAIGrading, handleSocialLearning, handleCourseCreation, handleConsultancy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#1e1b3a]" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6a00]" aria-hidden="true"></div>
        <span className="sr-only">Loading welcome page...</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff6a00]/20 to-[#ff1b9c]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a05eff]/20 to-[#ff6a00]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#ff1b9c]/10 to-[#a05eff]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md" role="banner">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-1.5 sm:p-2 rounded-lg" aria-hidden="true">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">oneedu</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] hover:from-[#ff6a00]/90 hover:to-[#ff1b9c]/90 text-white border-none text-sm sm:text-base px-3 sm:px-4 py-2 focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => setAuthOpen(true)}
                  variant="outline"
                  className="border-[#a05eff] text-[#a05eff] hover:bg-[#a05eff] hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2 focus:ring-2 focus:ring-[#a05eff] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10" role="main">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-labelledby="hero-heading">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <Badge className="bg-gradient-to-r from-[#ff6a00]/20 to-[#ff1b9c]/20 border-[#ff6a00]/30 text-[#ff6a00] hover:bg-gradient-to-r hover:from-[#ff6a00]/30 hover:to-[#ff1b9c]/30 text-xs sm:text-sm" role="status" aria-label={welcomePageContent.hero.badge.ariaLabel}>
                <welcomePageContent.hero.badge.icon className="w-3 h-3 mr-1" aria-hidden="true" />
                {welcomePageContent.hero.badge.text}
              </Badge>

              {/* Main Headline */}
              <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] bg-clip-text text-transparent">
                  {welcomePageContent.hero.headline.primary}
                </span>
                <br />
                {welcomePageContent.hero.headline.secondary}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {welcomePageContent.hero.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start" role="group" aria-label="Primary actions">
                <WelcomeButton
                  onClick={handleGetStarted}
                  variant="primary"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                  aria-label={user ? "Go to dashboard to get started" : welcomePageContent.hero.ctaButtons.primary.ariaLabel}
                >
                  {welcomePageContent.hero.ctaButtons.primary.text}
                  <welcomePageContent.hero.ctaButtons.primary.icon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </WelcomeButton>
                <WelcomeButton
                  onClick={handleWatchDemo}
                  variant="secondary"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto focus:ring-2 focus:ring-[#a05eff] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                  aria-label={welcomePageContent.hero.ctaButtons.secondary.ariaLabel}
                >
                  <welcomePageContent.hero.ctaButtons.secondary.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  {welcomePageContent.hero.ctaButtons.secondary.text}
                </WelcomeButton>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative order-first lg:order-last">
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 backdrop-blur-sm">
                {/* Animated network visualization */}
                <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-[#ff6a00]/10 via-[#ff1b9c]/10 to-[#a05eff]/10 rounded-xl relative overflow-hidden">
                  {/* Floating particles */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse`}
                        style={{
                          background: ['#ff6a00', '#ff1b9c', '#a05eff'][i % 3],
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Central AI icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-4 sm:p-5 lg:p-6 rounded-full">
                      <Brain className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-labelledby="features-heading">
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              {welcomePageContent.featuresSection.title.split('oneedu')[0]}
              <span className="bg-gradient-to-r from-[#ff6a00] to-[#a05eff] bg-clip-text text-transparent">
                oneedu
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {welcomePageContent.featuresSection.description}
            </p>
          </div>

          {/* Feature Cards */}
          <LazyWrapper>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20" role="list" aria-label="Platform features">
              {welcomePageContent.features.map((feature) => (
                <ErrorBoundary key={feature.id}>
                  <FeatureCard
                    feature={feature}
                    onButtonClick={featureHandlers[feature.id as keyof typeof featureHandlers] || (() => {})}
                  />
                </ErrorBoundary>
              ))}
            </div>
          </LazyWrapper>
        </section>

        {/* AI Chatbot Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <Badge className="bg-gradient-to-r from-[#a05eff]/20 to-[#ff6a00]/20 border-[#a05eff]/30 text-[#a05eff] text-xs sm:text-sm">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Learning Assistant
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Meet your personal{' '}
                <span className="bg-gradient-to-r from-[#a05eff] to-[#ff6a00] bg-clip-text text-transparent">
                  AI teacher
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                Get instant answers, personalized explanations, and 24/7 support from our advanced AI chatbot.
                It's like having a knowledgeable teacher available whenever you need help.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 justify-center lg:justify-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#a05eff] rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Instant answers to any question</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 justify-center lg:justify-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ff6a00] rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Personalized learning recommendations</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 justify-center lg:justify-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ff1b9c] rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Multi-language support</span>
                </div>
              </div>
              <div className="flex justify-center lg:justify-start">
                <WelcomeButton
                  onClick={handleChatbot}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-fit text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                >
                  <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Chat with AI Teacher
                </WelcomeButton>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 p-3 sm:p-4 lg:p-6">
                <CardContent className="p-0">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Chat messages */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#a05eff] to-[#ff6a00] rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="bg-[#a05eff]/20 rounded-lg p-2 sm:p-3 max-w-xs">
                          <p className="text-xs sm:text-sm text-white">Hi! I'm your AI teacher. How can I help you learn today?</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 justify-end">
                        <div className="bg-[#ff6a00]/20 rounded-lg p-2 sm:p-3 max-w-xs">
                          <p className="text-xs sm:text-sm text-white">Can you explain quantum physics?</p>
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#a05eff] to-[#ff6a00] rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="bg-[#a05eff]/20 rounded-lg p-2 sm:p-3 max-w-xs">
                          <p className="text-xs sm:text-sm text-white">Absolutely! Quantum physics is the study of matter and energy at the smallest scales...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Trusted by educators worldwide
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Join thousands of institutions and millions of learners who have transformed their education experience
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] bg-clip-text text-transparent mb-1 sm:mb-2">
                10M+
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ff1b9c] to-[#a05eff] bg-clip-text text-transparent mb-1 sm:mb-2">
                50K+
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#a05eff] to-[#ff6a00] bg-clip-text text-transparent mb-1 sm:mb-2">
                1K+
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#a05eff] bg-clip-text text-transparent mb-1 sm:mb-2">
                95%
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg">Success Rate</div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              What our users say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Real stories from educators and students who have transformed their learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 h-full">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] rounded-full"></div>
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-sm sm:text-base">
                    "oneedu has completely transformed how I teach. The AI grading system saves me hours every week,
                    and my students are more engaged than ever."
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base">Dr. Sarah Johnson</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Professor, MIT</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 h-full">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-[#a05eff] to-[#ff1b9c] rounded-full"></div>
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-sm sm:text-base">
                    "The social learning features helped me connect with students from around the world.
                    It's like having a global classroom at my fingertips."
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#a05eff] to-[#ff1b9c] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base">Maria Rodriguez</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Student, Stanford</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-r from-[#ff1b9c] to-[#a05eff] rounded-full"></div>
                    ))}
                  </div>
                  <p className="text-gray-300 italic">
                    "The auto course creation feature is incredible. I can generate comprehensive learning materials
                    in minutes instead of hours."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#ff1b9c] to-[#a05eff] rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Prof. Michael Chen</div>
                      <div className="text-gray-400 text-sm">Harvard University</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about oneedu and how it can transform your learning experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">How does AI grading work?</h3>
                <p className="text-gray-300">
                  Our AI grading system uses advanced natural language processing to evaluate student responses,
                  provide detailed feedback, and ensure consistent grading standards across all assignments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Is oneedu suitable for all education levels?</h3>
                <p className="text-gray-300">
                  Yes! oneedu is designed to support learners from K-12 through higher education and corporate training.
                  Our AI adapts to different learning levels and curriculum requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">How secure is student data?</h3>
                <p className="text-gray-300">
                  We take data security seriously. All student information is encrypted, stored securely,
                  and we comply with FERPA, GDPR, and other privacy regulations to protect user data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Can I integrate oneedu with existing systems?</h3>
                <p className="text-gray-300">
                  Absolutely! oneedu offers robust API integration capabilities and supports popular LMS platforms
                  like Canvas, Blackboard, and Moodle for seamless workflow integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-bold text-white">
                    Ready to transform education?
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Join thousands of educators and students who are already experiencing
                    the future of learning with oneedu.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WelcomeButton
                    onClick={handleGetStarted}
                    variant="primary"
                    size="lg"
                    className="text-lg px-12 py-4"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {user ? 'Go to Dashboard' : 'Start Learning Today'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </WelcomeButton>
                  <WelcomeButton
                    onClick={handleWatchDemo}
                    variant="secondary"
                    size="lg"
                    className="text-lg px-12 py-4"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </WelcomeButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 oneedu. All rights reserved. The next-generation AI education ecosystem.</p>
          </div>
        </div>
      </footer>

        {/* Auth Dialog */}
        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </ErrorBoundary>
  );
}