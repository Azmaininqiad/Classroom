'use client';

import { Badge } from '@/components/ui/badge';
import { WelcomeButton } from '@/components/WelcomeButton';
import { Video, Users, Calendar, Shield, Clock, Star } from 'lucide-react';

interface ConsultancyHeroProps {
  onBrowseMentors: () => void;
}

export default function ConsultancyHero({ onBrowseMentors }: ConsultancyHeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-labelledby="consultancy-hero-heading">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
          {/* Badge */}
          <Badge className="bg-gradient-to-r from-[#a05eff]/20 to-[#ff6a00]/20 border-[#a05eff]/30 text-[#a05eff] hover:bg-gradient-to-r hover:from-[#a05eff]/30 hover:to-[#ff6a00]/30 text-xs sm:text-sm" role="status" aria-label="Live video consultancy platform">
            <Video className="w-3 h-3 mr-1" aria-hidden="true" />
            Live Video Consultancy
          </Badge>

          {/* Main Headline */}
          <h1 id="consultancy-hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] bg-clip-text text-transparent">
              Connect with expert
            </span>
            <br />
            mentors instantly
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Get personalized guidance through secure video consultations with experienced mentors and counselors. 
            Schedule sessions that fit your schedule and receive expert advice tailored to your academic and career goals.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 my-8">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff6a00]/20 to-[#ff1b9c]/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-[#ff6a00]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-sm">HD Video Calls</div>
                <div className="text-gray-400 text-xs">Crystal clear quality</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff1b9c]/20 to-[#a05eff]/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#ff1b9c]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-sm">Expert Mentors</div>
                <div className="text-gray-400 text-xs">Verified professionals</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 bg-gradient-to-r from-[#a05eff]/20 to-[#ff6a00]/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#a05eff]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-sm">Flexible Scheduling</div>
                <div className="text-gray-400 text-xs">Book anytime</div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start">
            <WelcomeButton
              onClick={onBrowseMentors}
              variant="primary"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
              aria-label="Browse available mentors for consultation"
            >
              <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Browse Mentors
            </WelcomeButton>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative order-first lg:order-last">
          <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 backdrop-blur-sm">
            {/* Video consultation mockup */}
            <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-[#ff6a00]/10 via-[#ff1b9c]/10 to-[#a05eff]/10 rounded-xl relative overflow-hidden">
              {/* Mock video interface */}
              <div className="absolute inset-4 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] rounded-full flex items-center justify-center mx-auto">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white text-sm font-medium">Live Consultation</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Connected
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-1 text-xs text-white">
                <Clock className="w-3 h-3 inline mr-1" />
                45:30
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-3 py-1 text-xs text-white">
                <Shield className="w-3 h-3 inline mr-1" />
                Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Trusted by students worldwide
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join thousands of students who have received expert guidance through our platform
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Active Mentors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff1b9c] to-[#a05eff] bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Sessions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#a05eff] to-[#ff6a00] bg-clip-text text-transparent mb-2">
              4.9
            </div>
            <div className="text-gray-300 text-sm sm:text-base flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              Average Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#a05eff] bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}