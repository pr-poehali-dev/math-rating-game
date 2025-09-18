import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import StudentCard from '@/components/StudentCard';
import HomeworkManagement from '@/components/HomeworkManagement';
import AchievementsSection from '@/components/AchievementsSection';

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
  const [newHomework, setNewHomework] = useState({ 
    title: '', 
    description: '', 
    difficulty: 'medium', 
    points: 10 
  });

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
        { 
          studentId: 1, 
          homeworkId: 1, 
          answer: 'x1=2, x2=-3 для первого уравнения...', 
          submittedAt: '2025-09-20', 
          status: 'pending' 
        },
        { 
          studentId: 2, 
          homeworkId: 1, 
          answer: 'Решение: D=25, x1=2, x2=-3...', 
          submittedAt: '2025-09-19', 
          grade: 14, 
          feedback: 'Отличная работа!', 
          status: 'graded' 
        }
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
        { 
          studentId: 3, 
          homeworkId: 2, 
          answer: 'График y=x² - парабола...', 
          submittedAt: '2025-09-22', 
          status: 'pending' 
        }
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

  const handleNewHomeworkChange = (field: string, value: string | number) => {
    setNewHomework(prev => ({ ...prev, [field]: value }));
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
              {sortedStudents.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  position={index + 1}
                  totalRating={getTotalRating(student)}
                  achievements={achievements}
                  onUpdatePoints={updateStudentPoints}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="homework" className="space-y-6">
            <HomeworkManagement
              students={students}
              homeworks={homeworks}
              newHomework={newHomework}
              onNewHomeworkChange={handleNewHomeworkChange}
              onCreateHomework={createHomework}
              onGradeSubmission={gradeSubmission}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsSection achievements={achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;