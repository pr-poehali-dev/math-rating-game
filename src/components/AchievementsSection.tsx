import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  points: number;
  color: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon name="Award" size={24} className="text-game-orange" />
            Система достижений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg text-white ${achievement.color} transition-transform hover:scale-105`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-bold text-lg mb-1">{achievement.title}</div>
                  <div className="text-sm opacity-90 mb-2">{achievement.description}</div>
                  <Badge variant="secondary" className="bg-white text-gray-800">
                    +{achievement.points} баллов
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon name="Calculator" size={24} className="text-game-turquoise" />
            Быстрый калькулятор
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              <Button variant="outline" className="aspect-square">7</Button>
              <Button variant="outline" className="aspect-square">8</Button>
              <Button variant="outline" className="aspect-square">9</Button>
              <Button variant="outline" className="aspect-square">÷</Button>
              <Button variant="outline" className="aspect-square">4</Button>
              <Button variant="outline" className="aspect-square">5</Button>
              <Button variant="outline" className="aspect-square">6</Button>
              <Button variant="outline" className="aspect-square">×</Button>
              <Button variant="outline" className="aspect-square">1</Button>
              <Button variant="outline" className="aspect-square">2</Button>
              <Button variant="outline" className="aspect-square">3</Button>
              <Button variant="outline" className="aspect-square">-</Button>
              <Button variant="outline" className="aspect-square col-span-2">0</Button>
              <Button variant="outline" className="aspect-square">.</Button>
              <Button variant="outline" className="aspect-square">+</Button>
            </div>
            <Button className="w-full mt-2 bg-game-orange hover:bg-game-orange/90 text-white">
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsSection;