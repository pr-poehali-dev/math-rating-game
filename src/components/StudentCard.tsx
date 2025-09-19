import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  avatar: string;
  homework_score: number;
  activity_score: number;
  answers_score: number;
  total_rating: number;
  achievements: Achievement[];
  level: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  points: number;
  color: string;
}

interface StudentCardProps {
  student: Student;
  position: number;
  totalRating: number;
  achievements: Achievement[];
  onUpdatePoints: (studentId: number, category: 'homework_score' | 'activity_score' | 'answers_score', delta: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  position,
  totalRating,
  achievements,
  onUpdatePoints
}) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className={`absolute top-0 left-0 w-2 h-full ${
        position === 1 ? 'bg-game-orange' : 
        position === 2 ? 'bg-game-turquoise' : 
        position === 3 ? 'bg-game-purple' : 'bg-gray-300'
      }`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{student.avatar}</div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                {student.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{getRankIcon(position)}</span>
                <Badge variant="secondary" className="text-sm">
                  Уровень {student.level}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-game-orange">{totalRating}</div>
            <div className="text-sm text-gray-500">рейтинг</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="BookOpen" size={16} className="text-game-turquoise" />
              <span className="text-sm font-medium">Домашние задания</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'homework_score', -5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Minus" size={14} />
              </Button>
              <span className="w-12 text-center font-semibold">{student.homework_score}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'homework_score', 5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>
          <Progress value={student.homework_score} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="MessageCircle" size={16} className="text-game-purple" />
              <span className="text-sm font-medium">Ответы на уроке</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'answers_score', -5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Minus" size={14} />
              </Button>
              <span className="w-12 text-center font-semibold">{student.answers_score}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'answers_score', 5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>
          <Progress value={student.answers_score} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-game-yellow" />
              <span className="text-sm font-medium">Активность</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'activity_score', -5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Minus" size={14} />
              </Button>
              <span className="w-12 text-center font-semibold">{student.activity_score}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdatePoints(student.id, 'activity_score', 5)}
                className="w-8 h-8 p-0"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>
          <Progress value={student.activity_score} className="h-2" />
        </div>

        {student.achievements.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Достижения:</div>
            <div className="flex flex-wrap gap-2">
              {student.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-medium ${achievement.color} animate-pulse-glow`}
                >
                  <span>{achievement.icon}</span>
                  <span>{achievement.title}</span>
                  <span className="text-xs opacity-75">+{achievement.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCard;