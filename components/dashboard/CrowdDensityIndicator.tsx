import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { Card } from '../ui/Card';

type DensityLevel = 'low' | 'moderate' | 'high' | 'extreme';

const CrowdDensityIndicator: React.FC = () => {
  const { translations } = useLocalization();
  const [level, setLevel] = useState<DensityLevel>('moderate');

  useEffect(() => {
    const levels: DensityLevel[] = ['low', 'moderate', 'high', 'extreme'];
    const interval = setInterval(() => {
      const nextIndex = (levels.indexOf(level) + 1) % levels.length;
      setLevel(levels[nextIndex]);
    }, 7000); // Change level every 7 seconds to simulate real-time updates

    return () => clearInterval(interval);
  }, [level]);

  const getLevelInfo = (currentLevel: DensityLevel) => {
    switch (currentLevel) {
      case 'low':
        return {
          text: translations.dashboard.crowdDensity.low,
          color: 'bg-green-500',
          width: 'w-1/4',
        };
      case 'moderate':
        return {
          text: translations.dashboard.crowdDensity.moderate,
          color: 'bg-yellow-500',
          width: 'w-2/4',
        };
      case 'high':
        return {
          text: translations.dashboard.crowdDensity.high,
          color: 'bg-orange-500',
          width: 'w-3/4',
        };
      case 'extreme':
        return {
          text: translations.dashboard.crowdDensity.extreme,
          color: 'bg-red-500',
          width: 'w-full',
        };
      default:
        return {
          text: '',
          color: 'bg-gray-500',
          width: 'w-0',
        };
    }
  };

  const { text, color, width } = getLevelInfo(level);

  return (
    <Card className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold flex-shrink-0">
          {translations.dashboard.crowdDensity.title}:{' '}
          <span className={`px-2 py-1 rounded text-white ${color}`}>{text}</span>
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 flex-grow">
          <div
            className={`h-4 rounded-full transition-all duration-500 ease-in-out ${color}`}
            style={{ width: width.replace('w-', '').replace('/', '%') }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default CrowdDensityIndicator;
