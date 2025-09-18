-- Заполнение таблицы достижений
INSERT INTO achievements (id, title, description, icon, points, color) VALUES
('first-place', 'Первое место', 'Лучший результат в группе', '🏆', 100, 'bg-game-orange'),
('homework-master', 'Мастер ДЗ', 'Выполнил 10 домашних заданий подряд', '📚', 50, 'bg-game-turquoise'),
('active-student', 'Активист', 'Самый активный на уроках', '🙋‍♀️', 75, 'bg-game-purple'),
('rising-star', 'Восходящая звезда', 'Лучший прогресс за месяц', '⭐', 60, 'bg-game-yellow');

-- Добавление учеников
INSERT INTO students (name, avatar, level) VALUES
('Илья', '🧑‍🎓', 5),
('Даша', '👩‍🎓', 6),
('Вика', '👩‍🔬', 4),
('Настя', '👩‍💻', 5);

-- Добавление рейтингов для учеников
INSERT INTO student_ratings (student_id, homework_score, activity_score, answers_score) VALUES
(1, 85, 78, 92),
(2, 92, 88, 85),
(3, 76, 95, 80),
(4, 88, 82, 90);

-- Добавление достижений ученикам
INSERT INTO student_achievements (student_id, achievement_id) VALUES
(1, 'first-place'),
(1, 'homework-master'),
(2, 'homework-master'),
(2, 'active-student'),
(3, 'active-student'),
(4, 'rising-star');