"""
Backend function for managing student ratings and achievements
Returns student data, ratings, and achievements from PostgreSQL database
"""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    """
    Business: Get student ratings and achievements data
    Args: event with httpMethod, queryStringParameters
          context with request_id, function_name
    Returns: HTTP response with student data
    """
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Get database connection
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database URL not configured'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            endpoint = params.get('endpoint', 'students')
            
            if endpoint == 'students':
                # Get all students with their ratings
                cur.execute("""
                    SELECT 
                        s.id, 
                        s.name, 
                        s.avatar, 
                        s.level,
                        sr.homework_score,
                        sr.activity_score,
                        sr.answers_score,
                        sr.total_rating
                    FROM students s 
                    JOIN student_ratings sr ON s.id = sr.student_id 
                    ORDER BY sr.total_rating DESC
                """)
                students = [dict(row) for row in cur.fetchall()]
                
                # Get achievements for each student
                for student in students:
                    cur.execute("""
                        SELECT 
                            a.id,
                            a.title,
                            a.description,
                            a.icon,
                            a.points,
                            a.color
                        FROM achievements a
                        JOIN student_achievements sa ON a.id = sa.achievement_id
                        WHERE sa.student_id = %s
                        ORDER BY a.points DESC
                    """, (student['id'],))
                    student['achievements'] = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'students': students})
                }
            
            elif endpoint == 'achievements':
                # Get all available achievements
                cur.execute("""
                    SELECT id, title, description, icon, points, color
                    FROM achievements
                    ORDER BY points DESC
                """)
                achievements = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'achievements': achievements})
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unknown endpoint'})
                }
        
        elif method == 'POST':
            # Update student rating
            body_data = json.loads(event.get('body', '{}'))
            student_id = body_data.get('student_id')
            homework_score = body_data.get('homework_score')
            activity_score = body_data.get('activity_score')
            answers_score = body_data.get('answers_score')
            
            if not all([student_id, homework_score is not None, activity_score is not None, answers_score is not None]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            # Update ratings
            cur.execute("""
                UPDATE student_ratings 
                SET homework_score = %s, activity_score = %s, answers_score = %s
                WHERE student_id = %s
            """, (homework_score, activity_score, answers_score, student_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Rating updated'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'conn' in locals():
            conn.close()