import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  submissions: HomeworkSubmission[];
}

interface HomeworkSubmission {
  studentId: number;
  homeworkId: number;
  answer: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('ratings');
  const [newHomework, setNewHomework] = useState({ title: '', description: '', difficulty: 'medium', points: 10 });
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

  const [homeworks, setHomeworks] = useState<Homework[]>([
    {
      id: 1,
      title: 'Решение квадратных уравнений',
      description: 'Решить 5 квадратных уравнений разной сложности. Показать все шаги решения.',
      dueDate: '2025-09-25',
      difficulty: 'medium',
      points: 15,
      submissions: [
        { studentId: 1, homeworkId: 1, answer: 'x1=2, x2=-3 для первого уравнения...', submittedAt: '2025-09-20', status: 'pending' },
        { studentId: 2, homeworkId: 1, answer: 'Решение: D=25, x1=2, x2=-3...', submittedAt: '2025-09-19', grade: 14, feedback: 'Отличная работа!', status: 'graded' }
      ]
    },
    {
      id: 2,
      title: 'Построение графиков функций',
      description: 'Построить графики функций y=x², y=2x+1, y=sin(x). Определить точки пересечения.',
      dueDate: '2025-09-30',
      difficulty: 'hard',
      points: 20,
      submissions: [
        { studentId: 3, homeworkId: 2, answer: 'График y=x² - парабола...', submittedAt: '2025-09-22', status: 'pending' }
      ]
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

  const createHomework = () => {
    if (!newHomework.title.trim()) return;
    
    const homework: Homework = {
      id: homeworks.length + 1,
      title: newHomework.title,
      description: newHomework.description,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      difficulty: newHomework.difficulty as 'easy' | 'medium' | 'hard',
      points: newHomework.points,
      submissions: []
    };
    
    setHomeworks(prev => [...prev, homework]);
    setNewHomework({ title: '', description: '', difficulty: 'medium', points: 10 });
  };

  const gradeSubmission = (studentId: number, homeworkId: number, grade: number, feedback: string) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        return {
          ...hw,
          submissions: hw.submissions.map(sub => {
            if (sub.studentId === studentId) {
              return { ...sub, grade, feedback, status: 'graded' as const };
            }
            return sub;
          })
        };
      }
      return hw;
    }));
    
    updateStudentPoints(studentId, 'homework', grade);
  };

  const getSubmissionForStudent = (studentId: number, homeworkId: number) => {
    const homework = homeworks.find(hw => hw.id === homeworkId);
    return homework?.submissions.find(sub => sub.studentId === studentId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSubmissionStats = (homeworkId: number) => {
    const homework = homeworks.find(hw => hw.id === homeworkId);
    if (!homework) return { submitted: 0, total: students.length, graded: 0 };
    
    const submitted = homework.submissions.length;
    const graded = homework.submissions.filter(sub => sub.status === 'graded').length;
    
    return { submitted, total: students.length, graded };
  };

  const sortedStudents = [...students].sort((a, b) => getTotalRating(b) - getTotalRating(a));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Система управления обучением
          </h1>
          <p className="text-gray-600 text-lg">Рейтинги, задания и достижения в одном месте</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Icon name="Trophy" size={18} />
              Рейтинги
            </TabsTrigger>
            <TabsTrigger value="homework" className="flex items-center gap-2">
              <Icon name="BookOpen" size={18} />
              Домашние задания
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Icon name="Award" size={18} />
              Достижения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
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
          </TabsContent>

          <TabsContent value="homework" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Управление заданиями</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-game-orange hover:bg-game-orange/90">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать задание
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Новое домашнее задание</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Название задания</label>
                      <Input
                        value={newHomework.title}
                        onChange={(e) => setNewHomework(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Например: Решение логарифмов"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Описание</label>
                      <Textarea
                        value={newHomework.description}
                        onChange={(e) => setNewHomework(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Подробное описание задания..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Сложность</label>
                        <Select
                          value={newHomework.difficulty}
                          onValueChange={(value) => setNewHomework(prev => ({ ...prev, difficulty: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Легкая</SelectItem>
                            <SelectItem value="medium">Средняя</SelectItem>
                            <SelectItem value="hard">Сложная</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Баллы</label>
                        <Input
                          type="number"
                          value={newHomework.points}
                          onChange={(e) => setNewHomework(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                          min={1}
                          max={50}
                        />
                      </div>
                    </div>
                    <Button onClick={createHomework} className="w-full bg-game-turquoise hover:bg-game-turquoise/90">
                      Создать задание
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {homeworks.map(homework => {
                const stats = getSubmissionStats(homework.id);
                return (
                  <Card key={homework.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-2 h-full ${getDifficultyColor(homework.difficulty)}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                            {homework.title}
                          </CardTitle>
                          <p className="text-gray-600 text-sm mb-3">{homework.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              <span>До {new Date(homework.dueDate).toLocaleDateString('ru-RU')}</span>
                            </div>
                            <Badge className={`${getDifficultyColor(homework.difficulty)} text-white`}>
                              {homework.difficulty === 'easy' ? 'Легкая' : 
                               homework.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                            </Badge>
                            <Badge variant="secondary">
                              {homework.points} баллов
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-game-turquoise">
                            {stats.submitted}/{stats.total}
                          </div>
                          <div className="text-xs text-gray-500">сдано</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Проверено: {stats.graded}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Ответы учеников:</h4>
                        <div className="grid gap-3">
                          {students.map(student => {
                            const submission = getSubmissionForStudent(student.id, homework.id);
                            return (
                              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{student.avatar}</span>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                    {submission && (
                                      <div className="text-xs text-gray-500">
                                        Сдано {new Date(submission.submittedAt).toLocaleDateString('ru-RU')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {submission ? (
                                    <>
                                      <Badge 
                                        variant={submission.status === 'graded' ? 'default' : 'secondary'}
                                        className={submission.status === 'graded' ? 'bg-green-500' : ''}
                                      >
                                        {submission.status === 'graded' 
                                          ? `Оценено: ${submission.grade}/${homework.points}` 
                                          : 'На проверке'
                                        }
                                      </Badge>
                                      {submission.status === 'pending' && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                              <Icon name="Eye" size={14} />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Ответ {student.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div>
                                                <label className="text-sm font-medium">Ответ ученика:</label>
                                                <div className="p-3 bg-gray-100 rounded mt-1 text-sm">
                                                  {submission.answer}
                                                </div>
                                              </div>
                                              <Button 
                                                className="w-full bg-game-purple hover:bg-game-purple/90"
                                                onClick={() => gradeSubmission(student.id, homework.id, homework.points, 'Хорошо!')}
                                              >
                                                Оценить работу
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </>
                                  ) : (
                                    <Badge variant="outline">Не сдано</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;