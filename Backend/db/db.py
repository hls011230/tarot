import mysql.connector
import qrcode

# 连接到 MySQL 数据库
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tarot"
)


def submit_question(user_id, img, title,content, type, tags):
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
        INSERT INTO question (user_id, img, title,content, type,status,created_at)
        VALUES (%s, %s, %s,%s,%s,'pending',NOW());
        """
        cursor.execute(query, (user_id, img, title,content, type))
        question_id = cursor.lastrowid  # 获取插入的问题ID

        # 插入标签（假设标签表为 question_tag，包含 question_id 和 tag）
        for tag in tags:
            tag_query = """
            INSERT INTO question_tag (question_id, tag)
            VALUES (%s, %s);
            """
            cursor.execute(tag_query, (question_id, tag))

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

def get_questions():
    """
    查询所有问题
    :return: 问题列表
    """
    try:
        cursor = connection.cursor()
        query = """
        SELECT q.id, q.title, q.img, q.content, q.status, q.created_at, u.username
        FROM question q
        JOIN user u ON q.user_id = u.id
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
    except Exception as e:
        print(f"查询问题失败: {e}")
        return []

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
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT 
            c.id AS comment_id,
            c.content AS comment_content,
            c.created_at AS comment_created_at,
            c.parent_comment_id,
            pc.content AS parent_comment_content,
            pc.created_at AS parent_comment_created_at,
            pc.user_id AS parent_comment_user_id,
            u.username AS parent_comment_username
        FROM comment c
        LEFT JOIN comment pc ON c.parent_comment_id = pc.id
        LEFT JOIN user u ON pc.user_id = u.id
        WHERE c.question_id = %s
        ORDER BY c.created_at ASC;
        """
        cursor.execute(query, (question_id,))
        result = cursor.fetchall()
        cursor.close()

        # 格式化结果
        comments = []
        for row in result:
            comment = {
                "comment_id": row["comment_id"],
                "comment_content": row["comment_content"],
                "comment_created_at": row["comment_created_at"],
                "parent_comment": None
            }
            if row["parent_comment_id"]:
                comment["parent_comment"] = {
                    "parent_comment_id": row["parent_comment_id"],
                    "parent_comment_content": row["parent_comment_content"],
                    "parent_comment_created_at": row["parent_comment_created_at"],
                    "parent_comment_user_id": row["parent_comment_user_id"],
                    "parent_comment_username": row["parent_comment_username"]
                }
            comments.append(comment)

        return comments
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