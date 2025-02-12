from flask import Blueprint, request, jsonify

import db.db as db
from .response import response

bp = Blueprint('api', __name__, url_prefix='/api')


# 提交问题
@bp.route('/submit-question', methods=['POST'])
def submit_question():
    data = request.json
    user_id = data['user_id']
    img = data['img']
    title = data['title']
    content = data['content']
    type = data['type']
    tags = data['tags']
    question_id = db.submit_question(user_id, img, title,content, type, tags)
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

# 提交评论
@bp.route('/submit-comment', methods=['POST'])
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
@bp.route('/get-comments-by-question', methods=['GET'])
def get_comments_by_question():
    question_id = request.args.get("question_id")
    comments = db.get_comments_by_question(question_id)
    if not comments:
        return response(data="error", status_code=0)
    else:
        return response(data=comments, status_code=1)

# 修改问题状态
@bp.route('/update-question-status', methods=['POST'])
def update_question_status():
    data = request.json
    question_id = data['question_id']
    new_status = data['new_status']
    success = db.update_question_status(question_id, new_status)
    if not success:
        return response(data="error", status_code=0)
    else:
        return response(data="success", status_code=1)