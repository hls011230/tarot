from flask import Blueprint, request, jsonify
import jwt
from functools import wraps

import db.db as db
from .response import response

bp = Blueprint('api', __name__, url_prefix='/api')

# # JWT密钥
# SECRET_KEY = 'your_secret_key'

# # JWT认证装饰器
# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if not token:
#             return response(data="Token is missing!", status_code=0)
#         try:
#             data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         except jwt.ExpiredSignatureError:
#             return response(data="Token has expired!", status_code=0)
#         except jwt.InvalidTokenError:
#             return response(data="Token is invalid!", status_code=0)
#         return f(*args, **kwargs)
#     return decorated

# 用户注册
@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    email = data['email']
    role = data.get('role', 'user')
    status = data.get('status', 'active')
    icon = data.get('icon', None)
    user_id = db.register_user(username, password, email, role, status, icon)
    if user_id is None:
        return response(data="注册失败", status_code=0)
    else:
        return response(data={"user_id": user_id}, status_code=1)

# 用户登录
@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    user = db.login_user(username, password)
    if user is None:
        return response(data="登录失败", status_code=0)
    else:
        # 这里可以添加JWT生成逻辑
        # token = jwt.encode({'user_id': user['id']}, SECRET_KEY, algorithm="HS256")
        return response(data=user, status_code=1)
    
# 用户查询
@bp.route('/get-user/<id>', methods=['GET'])
def get_user(id):
    user = db.get_user(id)
    if user is None:
        return response(data="查询失败", status_code=0)
    else:
        # 这里可以添加JWT生成逻辑
        # token = jwt.encode({'user_id': user['id']}, SECRET_KEY, algorithm="HS256")
        return response(data=user, status_code=1)

# 查询所有用户
@bp.route('/get-users', methods=['GET'])
def get_users():
    user = db.get_users()
    if user is None:
        return response(data="查询失败", status_code=0)
    else:
        # 这里可以添加JWT生成逻辑
        # token = jwt.encode({'user_id': user['id']}, SECRET_KEY, algorithm="HS256")
        return response(data=user, status_code=1)
    
# 删除用户
@bp.route('/delete-user', methods=['POST'])
def delete_user():
    data = request.json
    user = db.delete_user(data['id'])
    if user is False:
        return response(data="删除", status_code=0)
    else:
        # 这里可以添加JWT生成逻辑
        # token = jwt.encode({'user_id': user['id']}, SECRET_KEY, algorithm="HS256")
        return response(data=user, status_code=1)

# 修改用户
@bp.route('/update-user-info/<id>', methods=['POST'])
def update_user(id):
    data = request.json
    user = db.update_user_info(id,data)
    if user is False:
        return response(data="修改失败", status_code=0)
    else:
        return response(data=user, status_code=1)


# 提交问题
@bp.route('/submit-question', methods=['POST'])
# @token_required
def submit_question():
    data = request.json
    user_id = data['user_id']
    about = data['about']
    title = data['title']
    content = data['content']
    type = data['type']
    question_id = db.submit_question(user_id, about, title, content, type)
    if question_id is None:
        return response(data="error", status_code=0)
    else:
        return response(data={"question_id": question_id}, status_code=1)

# 根据标签查询问题
@bp.route('/get-questions-by-tag/<tag>', methods=['GET'])
def get_questions_by_tag(tag):
    questions = db.get_questions_by_tag(tag)
    if not questions:
        return response(data="error", status_code=0)
    else:
        return response(data=questions, status_code=1)

# 查询所有问题
@bp.route('/get-questions', methods=['GET'])
def get_questions():
    questions = db.get_questions()
    if not questions:
        return response(data="error", status_code=0)
    else:
        return response(data=questions, status_code=1)

# 查询某一问题
@bp.route('/get-question-by-id/<id>', methods=['GET'])
def get_question_by_id(id):
    questions = db.get_question_by_id(id)
    if not questions:
        return response(data="error", status_code=0)
    else:
        return response(data=questions, status_code=1)

# 提交评论
@bp.route('/submit-comment', methods=['POST'])
# @token_required
def submit_comment():
    data = request.json
    user_id = data['user_id']
    question_id = data['question_id']
    content = data['content']
    parent_comment_id = data['parent_comment_id']
    if parent_comment_id == 0:
        parent_comment_id = None
    comment_id = db.submit_comment(user_id, question_id, content, parent_comment_id)
    if comment_id is None:
        return response(data="error", status_code=0)
    else:
        return response(data={"comment_id": comment_id}, status_code=1)

# 获取问题的所有评论
@bp.route('/get-comments-by-question/<question_id>', methods=['GET'])
def get_comments_by_question(question_id):
    comments = db.get_comments_by_question(question_id)
    if not comments:
        return response(data="error", status_code=0)
    else:
        return response(data=comments, status_code=1)

# 修改问题状态
@bp.route('/update-question-status', methods=['POST'])
# @token_required
def update_question_status():
    data = request.json
    question_id = data['question_id']
    new_status = data['new_status']
    success = db.update_question_status(question_id, new_status)
    if not success:
        return response(data="error", status_code=0)
    else:
        return response(data="success", status_code=1)