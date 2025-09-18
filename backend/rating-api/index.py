import json
import os
import psycopg2
from typing import Dict, Any, List, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления рейтингами учеников по математике
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id и другими атрибутами
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS OPTIONS запроса
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        # Подключение к БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        if method == 'GET':
            endpoint = event.get('queryStringParameters', {}).get('endpoint', 'students')
            
            if endpoint == 'students':
                # Получаем данные учеников с их достижениями
                cursor.execute("""
                    SELECT 
                        s.id, s.name, s.avatar, s.homework_score, s.activity_score, 
                        s.answers_score, s.total_rating, s.level,
                        COALESCE(
                            json_agg(
                                json_build_object(
                                    'id', a.id,
                                    'title', a.title,
                                    'icon', a.icon,
                                    'description', a.description,
                                    'points', a.points,
                                    'color', a.color
                                )
                            ) FILTER (WHERE a.id IS NOT NULL), 
                            '[]'::json
                        ) as achievements
                    FROM students s
                    LEFT JOIN student_achievements sa ON s.id = sa.student_id
                    LEFT JOIN achievements a ON sa.achievement_id = a.id
                    GROUP BY s.id, s.name, s.avatar, s.homework_score, s.activity_score, 
                             s.answers_score, s.total_rating, s.level
                    ORDER BY s.total_rating DESC
                """)
                
                rows = cursor.fetchall()
                students = []
                for row in rows:
                    students.append({
                        'id': row[0],
                        'name': row[1],
                        'avatar': row[2],
                        'homework_score': row[3],
                        'activity_score': row[4],
                        'answers_score': row[5],
                        'total_rating': row[6],
                        'level': row[7],
                        'achievements': row[8] if row[8] else []
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'students': students})
                }
            
            elif endpoint == 'achievements':
                cursor.execute("SELECT id, title, icon, description, points, color FROM achievements")
                rows = cursor.fetchall()
                achievements = []
                for row in rows:
                    achievements.append({
                        'id': row[0],
                        'title': row[1],
                        'icon': row[2],
                        'description': row[3],
                        'points': row[4],
                        'color': row[5]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'achievements': achievements})
                }
        
        elif method == 'POST':
            # Обновление баллов ученика
            body = json.loads(event.get('body', '{}'))
            student_id = body.get('student_id')
            homework_score = body.get('homework_score')
            activity_score = body.get('activity_score')
            answers_score = body.get('answers_score')
            
            if not student_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'student_id is required'})
                }
            
            # Обновляем баллы ученика
            cursor.execute("""
                UPDATE students 
                SET homework_score = %s, activity_score = %s, answers_score = %s
                WHERE id = %s
            """, (homework_score, activity_score, answers_score, student_id))
            
            # Проверяем достижения после обновления
            check_and_award_achievements(cursor, student_id)
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def check_and_award_achievements(cursor, student_id: int):
    """Проверяет и присваивает достижения ученику"""
    
    # Получаем текущие баллы ученика
    cursor.execute("""
        SELECT homework_score, activity_score, answers_score, total_rating 
        FROM students WHERE id = %s
    """, (student_id,))
    
    row = cursor.fetchone()
    if not row:
        return
    
    homework, activity, answers, total = row
    
    # Логика присвоения достижений
    achievements_to_award = []
    
    # Мастер ДЗ (если домашка >= 90)
    if homework >= 90:
        achievements_to_award.append('homework-master')
    
    # Активист (если активность >= 90)
    if activity >= 90:
        achievements_to_award.append('active-student')
    
    # Гений математики (если ответы >= 95)
    if answers >= 95:
        achievements_to_award.append('math-genius')
    
    # Идеальное ДЗ (если домашка = 100)
    if homework == 100:
        achievements_to_award.append('perfect-homework')
    
    # Первое место (проверяем лидерство)
    cursor.execute("SELECT COUNT(*) FROM students WHERE total_rating > %s", (total,))
    if cursor.fetchone()[0] == 0:  # Никто не лучше
        achievements_to_award.append('first-place')
    
    # Восходящая звезда (если все баллы >= 85)
    if homework >= 85 and activity >= 85 and answers >= 85:
        achievements_to_award.append('rising-star')
    
    # Присваиваем новые достижения
    for achievement_id in achievements_to_award:
        cursor.execute("""
            INSERT INTO student_achievements (student_id, achievement_id)
            VALUES (%s, %s)
            ON CONFLICT (student_id, achievement_id) DO NOTHING
        """, (student_id, achievement_id))