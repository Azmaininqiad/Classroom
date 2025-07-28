import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WelcomeButton } from '@/components/WelcomeButton';
import { CheckCircle, ArrowRight, Globe, Zap } from 'lucide-react';
import { FeatureContent, getTagColorClasses, getGradientClasses } from '@/lib/welcome-content';

interface FeatureCardProps {
  feature: FeatureContent;
  onButtonClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onButtonClick }) => {
  const renderVisual = () => {
    const baseClasses = "w-full lg:w-48 xl:w-64 h-32 sm:h-40 lg:h-48 bg-gradient-to-br rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0";
    
    switch (feature.visualType) {
      case 'chart':
        return (
          <div className={`${baseClasses} from-[#a05eff]/10 to-[#ff1b9c]/10`} aria-hidden="true">
            <div className="text-center space-y-2 sm:space-y-4">
              <div className="bg-gradient-to-r from-[#a05eff] to-[#ff1b9c] p-2 sm:p-3 rounded-full mx-auto w-fit">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-white">{feature.visualData?.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{feature.visualData?.label}</div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className={`${baseClasses} from-[#ff6a00]/10 to-[#ff1b9c]/10`} aria-hidden="true">
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-2 sm:p-3 rounded-full mx-auto w-fit">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">{feature.visualData?.label}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} from-[#ff6a00]/10 to-[#a05eff]/10`} aria-hidden="true">
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-[#ff6a00] to-[#a05eff] p-2 sm:p-3 rounded-full mx-auto w-fit">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">{feature.visualData?.label}</p>
            </div>
          </div>
        );
    }
  };

  const renderFeatureList = () => {
    if (feature.tags) {
      return (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4" role="list" aria-label={`${feature.title} features`}>
          {feature.tags.map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className={`${getTagColorClasses(tag.color)} text-xs sm:text-sm`}
              role="listitem"
            >
              {tag.text}
            </Badge>
          ))}
        </div>
      );
    }

    if (feature.features) {
      return (
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          {feature.features.map((featureText, index) => (
            <div key={index} className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{featureText}</span>
            </div>
          ))}
        </div>
      );
    }

    if (feature.id === 'social-learning') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-[#ff1b9c] flex-shrink-0" />
            <span>Global Community</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#a05eff] flex-shrink-0" />
            <span>Real-time Chat</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="group" role="listitem">
      <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 hover:border-[#ff6a00]/50 transition-all duration-300 overflow-hidden h-full focus-within:ring-2 focus-within:ring-[#ff6a00] focus-within:ring-offset-2 focus-within:ring-offset-[#0b0f19]">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-1.5 sm:p-2 rounded-lg flex-shrink-0" aria-hidden="true">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                {feature.description}
              </p>
              {renderFeatureList()}
              <WelcomeButton
                onClick={onButtonClick}
                variant="secondary"
                size="sm"
                className="w-full sm:w-fit text-sm sm:text-base focus:ring-2 focus:ring-[#a05eff] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                aria-label={feature.buttonAriaLabel}
              >
                {feature.buttonText}
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </WelcomeButton>
            </div>
            {renderVisual()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};