import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  avatar: string;
  homework: number;
  activity: number;
  answers: number;
  achievements: string[];
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

const Index = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Илья',
      avatar: '🧑‍🎓',
      homework: 85,
      activity: 78,
      answers: 92,
      achievements: ['first-place', 'homework-master'],
      level: 5
    },
    {
      id: 2,
      name: 'Даша',
      avatar: '👩‍🎓',
      homework: 92,
      activity: 88,
      answers: 85,
      achievements: ['homework-master', 'active-student'],
      level: 6
    },
    {
      id: 3,
      name: 'Вика',
      avatar: '👩‍🔬',
      homework: 76,
      activity: 95,
      answers: 80,
      achievements: ['active-student'],
      level: 4
    },
    {
      id: 4,
      name: 'Настя',
      avatar: '👩‍💻',
      homework: 88,
      activity: 82,
      answers: 90,
      achievements: ['rising-star'],
      level: 5
    }
  ]);

  const achievements: Achievement[] = [
    {
      id: 'first-place',
      title: 'Первое место',
      icon: '🏆',
      description: 'Лучший результат в группе',
      points: 100,
      color: 'bg-game-orange'
    },
    {
      id: 'homework-master',
      title: 'Мастер ДЗ',
      icon: '📚',
      description: 'Выполнил 10 домашних заданий подряд',
      points: 50,
      color: 'bg-game-turquoise'
    },
    {
      id: 'active-student',
      title: 'Активист',
      icon: '🙋‍♀️',
      description: 'Самый активный на уроках',
      points: 75,
      color: 'bg-game-purple'
    },
    {
      id: 'rising-star',
      title: 'Восходящая звезда',
      icon: '⭐',
      description: 'Лучший прогресс за месяц',
      points: 60,
      color: 'bg-game-yellow'
    }
  ];

  const getTotalRating = (student: Student) => {
    return Math.round((student.homework + student.activity + student.answers) / 3);
  };

  const updateStudentPoints = (studentId: number, category: 'homework' | 'activity' | 'answers', delta: number) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const newValue = Math.max(0, Math.min(100, student[category] + delta));
        return { ...student, [category]: newValue };
      }
      return student;
    }));
  };

  const getAchievementInfo = (achievementId: string) => {
    return achievements.find(a => a.id === achievementId);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };

  const sortedStudents = [...students].sort((a, b) => getTotalRating(b) - getTotalRating(a));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Рейтинг учеников математики
          </h1>
          <p className="text-gray-600 text-lg">Отслеживайте прогресс и мотивируйте достижениями</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
          {sortedStudents.map((student, index) => {
            const totalRating = getTotalRating(student);
            const position = index + 1;
            
            return (
              <Card key={student.id} className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
                          onClick={() => updateStudentPoints(student.id, 'homework', -5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-12 text-center font-semibold">{student.homework}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStudentPoints(student.id, 'homework', 5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                    </div>
                    <Progress value={student.homework} className="h-2" />
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
                          onClick={() => updateStudentPoints(student.id, 'answers', -5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-12 text-center font-semibold">{student.answers}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStudentPoints(student.id, 'answers', 5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                    </div>
                    <Progress value={student.answers} className="h-2" />
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
                          onClick={() => updateStudentPoints(student.id, 'activity', -5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-12 text-center font-semibold">{student.activity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStudentPoints(student.id, 'activity', 5)}
                          className="w-8 h-8 p-0"
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                    </div>
                    <Progress value={student.activity} className="h-2" />
                  </div>

                  {student.achievements.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">Достижения:</div>
                      <div className="flex flex-wrap gap-2">
                        {student.achievements.map(achievementId => {
                          const achievement = getAchievementInfo(achievementId);
                          if (!achievement) return null;
                          
                          return (
                            <div
                              key={achievementId}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-medium ${achievement.color} animate-pulse-glow`}
                            >
                              <span>{achievement.icon}</span>
                              <span>{achievement.title}</span>
                              <span className="text-xs opacity-75">+{achievement.points}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
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
    </div>
  );
};

export default Index;