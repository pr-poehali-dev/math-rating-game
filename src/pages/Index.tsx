import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import StudentCard from '@/components/StudentCard';
import HomeworkManagement from '@/components/HomeworkManagement';
import AchievementsSection from '@/components/AchievementsSection';

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

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const getTotalRating = (student: Student) => {
    return student.total_rating;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch students
        const studentsResponse = await fetch('https://functions.poehali.dev/98f71d83-65a5-49cc-89fa-16b29da8d6cb?endpoint=students');
        const studentsData = await studentsResponse.json();
        
        // Fetch achievements
        const achievementsResponse = await fetch('https://functions.poehali.dev/98f71d83-65a5-49cc-89fa-16b29da8d6cb?endpoint=achievements');
        const achievementsData = await achievementsResponse.json();
        
        setStudents(studentsData.students || []);
        setAchievements(achievementsData.achievements || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const updateStudentPoints = async (studentId: number, category: 'homework_score' | 'activity_score' | 'answers_score', delta: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const newValue = Math.max(0, Math.min(100, student[category] + delta));
    
    try {
      const response = await fetch('https://functions.poehali.dev/98f71d83-65a5-49cc-89fa-16b29da8d6cb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          homework_score: category === 'homework_score' ? newValue : student.homework_score,
          activity_score: category === 'activity_score' ? newValue : student.activity_score,
          answers_score: category === 'answers_score' ? newValue : student.answers_score,
        }),
      });
      
      if (response.ok) {
        setStudents(prev => prev.map(student => {
          if (student.id === studentId) {
            return { ...student, [category]: newValue };
          }
          return student;
        }));
      }
    } catch (error) {
      console.error('Error updating student points:', error);
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">Загрузка данных...</div>
              </div>
            ) : (
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
            )}
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