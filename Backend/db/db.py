from model.models import Session, User, Question, Comment, UserInfo
from model.models import question_schema,user_schema,comment_schema
from sqlalchemy.orm import joinedload

def submit_question(user_id, about, title, content, type):
    """
    用户提交问题
    :param user_id: 用户ID
    :param about: 牌阵描述
    :param title: 问题标题
    :param content: 问题内容
    :param type: 牌阵类型
    :return: 插入成功返回问题ID，失败返回None
    """
    session = Session()
    try:
        question = Question(
            user_id=user_id,
            about=about,
            title=title,
            content=content,
            type=type
        )
        session.add(question)
        session.commit()
        return question.id
    except Exception as e:
        print(f"提交问题失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()

def get_question_by_id(id):
    """
    查询问题详情
    :param id: 问题ID
    :return: 问题详情
    """
    session = Session()
    try:
        question = session.query(Question).filter(Question.id == id).first()
        return question_schema.dump(question)
    except Exception as e:
        print(f"查询问题详情失败: {e}")
        return None
    finally:
        session.close()    

def get_questions():
    """
    查询所有问题
    :return: 问题列表
    """
    session = Session()
    try:
        questions = session.query(Question).order_by(Question.created_at.desc()).all()
        if questions:
            # 使用 many=True 批量序列化
            return question_schema.dump(questions, many=True)
        return []
    except Exception as e:
        print(f"查询所有问题失败: {e}")
        return []
    finally:
        session.close()

def submit_comment(user_id, question_id, content, parent_comment_id=None):
    """
    用户参与评论
    :param user_id: 用户ID
    :param question_id: 问题ID
    :param content: 评论内容
    :param parent_comment_id: 父评论ID（可选）
    :return: 插入成功返回评论ID，失败返回None
    """
    session = Session()
    try:
        comment = Comment(
            user_id=user_id,
            question_id=question_id,
            content=content,
            parent_comment_id=parent_comment_id
        )
        session.add(comment)
        session.commit()
        return comment.id
    except Exception as e:
        print(f"提交评论失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()

def get_comments_by_question(question_id):
    """
    获取问题的所有评论
    :param question_id: 问题ID
    :return: 评论列表
    """
    session = Session()
    try:
        comments = session.query(Comment).filter(Comment.question_id == question_id).options(joinedload(Comment.user)).order_by(Comment.created_at.asc()).all()
        return comment_schema.dump(comments, many=True)
    except Exception as e:
        print(f"查询评论失败: {e}")
        return []
    finally:
        session.close()

def update_question_status(question_id, new_status):
    """
    修改问题状态
    :param question_id: 问题ID
    :param new_status: 新状态（'pending', 'finished', 'answered'）
    :return: 成功返回True，失败返回False
    """
    session = Session()
    try:
        question = session.query(Question).filter(Question.id == question_id).first()
        if question:
            question.status = new_status
            session.commit()
            return True
        return False
    except Exception as e:
        print(f"修改问题状态失败: {e}")
        session.rollback()
        return False
    finally:
        session.close()

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
    session = Session()
    try:
        user = User(
            username=username,
            password=password,
            email=email,
            role=role,
            status=status,
            icon=icon
        )
        session.add(user)
        session.commit()
        return user.id
    except Exception as e:
        print(f"注册用户失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()

def add_user(username, password, email, role='user', status='active', icon=None):
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
    session = Session()
    try:
        user = User(
            username=username,
            password=password,
            email=email,
            role=role,
            status=status,
            icon=icon
        )
        session.add(user)
        session.commit()
        return user.id
    except Exception as e:
        print(f"注册用户失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()


def update_user_info(user_id,updates):
    """
    修改用户信息
    :param user_id: 用户ID
    :param updates: 包含要更新字段的字典
    :return: 更新后的用户ID或None（如果更新失败）
    """
    session = Session()
    try:
        user = session.query(UserInfo).filter(UserInfo.user_id == user_id).first()
        if user is None:
            print(f"用户 {user_id} 不存在")
            return None
        
        for key, value in updates.items():
            setattr(user, key, value)
        
        session.commit()
        return user.id
    except Exception as e:
        print(f"更新用户失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()

def update_user(user_id):
    """
    修改用户
    """
    session = Session()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        session.delete(user)
        session.commit()
        return user.id
    except Exception as e:
        print(f"注册用户失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()


def login_user(username, password):
    """
    用户登录
    :param username: 用户名
    :param password: 密码
    :return: 登录成功返回用户信息，失败返回None
    """
    session = Session()
    try:
        user = session.query(User).filter(User.username == username, User.password == password).first()
        return user_schema.dump(user)
    except Exception as e:
        print(f"登录用户失败: {e}")
        return None
    finally:
        session.close()

def get_user(user_id):
    """
    查询用户
    :param user_id: 用户ID
    :return: 用户信息
    """
    session = Session()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        return user_schema.dump(user)
    except Exception as e:
        print(f"查询用户失败: {e}")
        return None
    finally:
        session.close()

def get_users():
    """
    查询所有用户
    :return: 用户信息
    """
    session = Session()
    try:
        users = session.query(User).options(joinedload(User.user_info)).all()
        return user_schema.dump(users,many=True)
    except Exception as e:
        print(f"查询用户失败: {e}")
        return None
    finally:
        session.close()

def delete_user(id):
    """
    查询所有用户
    :return: 用户信息
    """
    session = Session()
    try:
        user = session.query(User).filter(User.id == id).first()
        if user:
            # 删除用户（级联删除关联数据）
            session.delete(user)
            session.commit()
        return True
    except Exception as e:
        print(f"查询用户失败: {e}")
        return None
    finally:
        session.close()