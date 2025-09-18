import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

interface HomeworkManagementProps {
  students: Student[];
  homeworks: Homework[];
  newHomework: {
    title: string;
    description: string;
    difficulty: string;
    points: number;
  };
  onNewHomeworkChange: (field: string, value: string | number) => void;
  onCreateHomework: () => void;
  onGradeSubmission: (studentId: number, homeworkId: number, grade: number, feedback: string) => void;
}

const HomeworkManagement: React.FC<HomeworkManagementProps> = ({
  students,
  homeworks,
  newHomework,
  onNewHomeworkChange,
  onCreateHomework,
  onGradeSubmission
}) => {
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

  return (
    <div className="space-y-6">
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
                  onChange={(e) => onNewHomeworkChange('title', e.target.value)}
                  placeholder="Например: Решение логарифмов"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={newHomework.description}
                  onChange={(e) => onNewHomeworkChange('description', e.target.value)}
                  placeholder="Подробное описание задания..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Сложность</label>
                  <Select
                    value={newHomework.difficulty}
                    onValueChange={(value) => onNewHomeworkChange('difficulty', value)}
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
                    onChange={(e) => onNewHomeworkChange('points', parseInt(e.target.value) || 10)}
                    min={1}
                    max={50}
                  />
                </div>
              </div>
              <Button onClick={onCreateHomework} className="w-full bg-game-turquoise hover:bg-game-turquoise/90">
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
                                          onClick={() => onGradeSubmission(student.id, homework.id, homework.points, 'Хорошо!')}
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
    </div>
  );
};

export default HomeworkManagement;