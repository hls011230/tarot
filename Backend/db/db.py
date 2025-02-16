import pymysql
import qrcode
from flask import jsonify

db_config = {
    'host':"localhost",
    'user':"root",
    'password':"root",
    'database':"tarot",
    'cursorclass': pymysql.cursors.DictCursor  # 返回字典格式的结果
}

connection = pymysql.connect(**db_config)

def submit_question(user_id, about, title,content, type):
    """
    用户提交问题
    :param user_id: 用户ID
    :param img: 问题图片
    :param content: 问题内容
    :param type: 牌阵类型
    :param tags: 问题标签（列表）
    :return: 插入成功返回问题ID，失败返回None
    """
    try:
        cursor = connection.cursor()
        # 插入问题
        query = """
        INSERT INTO question (user_id, about, title,content, type,status,created_at)
        VALUES (%s, %s, %s,%s,%s,'pending',NOW());
        """
        cursor.execute(query, (user_id, about, title,content, type))
        question_id = cursor.lastrowid  # 获取插入的问题ID

        # # 插入标签（假设标签表为 question_tag，包含 question_id 和 tag）
        # for tag in tags:
        #     tag_query = """
        #     INSERT INTO question_tag (question_id, tag)
        #     VALUES (%s, %s);
        #     """
        #     cursor.execute(tag_query, (question_id, tag))

        connection.commit()
        cursor.close()
        return question_id
    except Exception as e:
        print(f"提交问题失败: {e}")
        connection.rollback()
        return None


def get_questions_by_tag(tag):
    """
    根据标签查询问题
    :param tag: 标签名称
    :return: 问题列表
    """
    try:
        cursor = connection.cursor()
        query = """
        SELECT q.id, q.content, q.status, q.created_at, u.username
        FROM question q
        JOIN user u ON q.user_id = u.id
        JOIN question_tag qt ON q.id = qt.question_id
        WHERE qt.tag = %s;
        """
        cursor.execute(query, (tag,))
        result = cursor.fetchall()
        cursor.close()
        return result
    except Exception as e:
        print(f"查询问题失败: {e}")
        return []

def get_question_by_id(id):
    """
    查询问题详情
    :param id: 问题id
    :return: 问题列表
    """
    try:
        # 连接数据库
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # 执行查询
            sql = """
        SELECT q.id, q.title, q.about, q.content, q.status, q.type, q.created_at, u.username,u.id AS user_id
        FROM question q
        JOIN user u ON q.user_id = u.id
        WHERE q.id = %s;
        """
            cursor.execute(sql,(id,))
            result = cursor.fetchall()  # 获取所有数据
                    
    finally:
        connection.close()  # 关闭数据库连接
    return result

def get_questions():
    """
    查询所有问题
    :return: 问题列表
    """
    try:
        # 连接数据库
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # 执行查询
            sql = """
        SELECT q.id, q.title, q.about, q.content, q.status, q.type, q.created_at, u.username
        FROM question q
        JOIN user u ON q.user_id = u.id
        ORDER BY q.created_at DESC;
        """
            cursor.execute(sql)
            result = cursor.fetchall()  # 获取所有数据
                    
    finally:
        connection.close()  # 关闭数据库连接
    return result


def submit_comment(user_id, question_id, content, parent_comment_id=None):
    """
    用户参与评论
    :param user_id: 用户ID
    :param question_id: 问题ID
    :param content: 评论内容
    :param parent_comment_id: 父评论ID（可选）
    :return: 插入成功返回评论ID，失败返回None
    """
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO comment (user_id, question_id, content, parent_comment_id)
        VALUES (%s, %s, %s, %s);
        """
        cursor.execute(query, (user_id, question_id, content, parent_comment_id))
        comment_id = cursor.lastrowid  # 获取插入的评论ID
        connection.commit()
        cursor.close()
        return comment_id
    except Exception as e:
        print(f"提交评论失败: {e}")
        connection.rollback()
        return None

def get_comments_by_question(question_id):
    """
    获取问题的所有评论
    :param question_id: 问题ID
    :return: 评论列表，包含评论及其父评论信息
    """
    try:
        cursor = connection.cursor()
        query = """
        SELECT 
            c.id AS comment_id,
            c.content AS comment_content,
            c.created_at AS comment_created_at,
            u.username AS username
        FROM comment c
        LEFT JOIN user u ON c.user_id = u.id
        WHERE c.question_id = %s
        ORDER BY c.created_at ASC;
        """
        cursor.execute(query, (question_id,))
        result = cursor.fetchall()
        cursor.close()

        # # 格式化结果
        # comments = []
        # for row in result:
        #     comment = {
        #         "comment_id": row["comment_id"],
        #         "comment_content": row["comment_content"],
        #         "comment_created_at": row["comment_created_at"],
        #         "parent_comment": None
        #     }
        #     if row["parent_comment_id"]:
        #         comment["parent_comment"] = {
        #             "parent_comment_id": row["parent_comment_id"],
        #             "parent_comment_content": row["parent_comment_content"],
        #             "parent_comment_created_at": row["parent_comment_created_at"],
        #             "parent_comment_user_id": row["parent_comment_user_id"],
        #             "parent_comment_username": row["parent_comment_username"]
        #         }
        #     comments.append(comment)
        return result
    except Exception as e:
        print(f"查询评论失败: {e}")
        return []


def update_question_status(question_id, new_status):
    """
    修改问题状态
    :param question_id: 问题ID
    :param new_status: 新状态（'pending', 'published', 'resolved', 'closed'）
    :return: 成功返回True，失败返回False
    """
    try:
        cursor = connection.cursor()
        query = """
        UPDATE question
        SET status = %s
        WHERE id = %s;
        """
        cursor.execute(query, (new_status, question_id))
        connection.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"修改问题状态失败: {e}")
        connection.rollback()
        return False


def register_user(username, password, email, role='user', status='active', icon=None):
    """
    用户注册
    :param username: 用户名
    :param password: 密码
    :param email: 邮箱
    :param role: 角色（默认为'user'）
    :param status: 状态（默认为'active'）
    :param icon: 头像（可选）
    :return: 注册成功返回用户ID，失败返回None
    """
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO user (username, password, email, role, status, created_at, icon)
        VALUES (%s, %s, %s, %s, %s, NOW(), %s);
        """
        cursor.execute(query, (username, password, email, role, status, icon))
        user_id = cursor.lastrowid  # 获取插入的用户ID
        connection.commit()
        cursor.close()
        return user_id
    except Exception as e:
        print(f"注册用户失败: {e}")
        connection.rollback()
        return None

def login_user(username, password):
    """
    用户登录
    :param username: 用户名
    :param password: 密码
    :return: 登录成功返回用户信息，失败返回None
    """
    try:
        cursor = connection.cursor()
        query = """
        SELECT * FROM user WHERE username = %s AND password = %s;
        """
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
        cursor.close()
        return user
    except Exception as e:
        print(f"登录用户失败: {e}")
        return None


def get_user(user_id):
    """
    查询用户
    :param user_id: 用户ID
    :return: 登录成功返回用户信息，失败返回None
    """
    try:
        cursor = connection.cursor()
        query = """
        SELECT * FROM user WHERE id = %s ;
        """
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        return user
    except Exception as e:
        print(f"查询用户失败: {e}")
        return None