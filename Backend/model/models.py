from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Enum, ForeignKey,func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from marshmallow import Schema, fields

# 数据库连接配置
DATABASE_URI = "mysql+pymysql://root:root@localhost/tarot"

engine = create_engine(
    DATABASE_URI,
    pool_size=10,  # 连接池大小
    max_overflow=5,  # 最大溢出连接数
    pool_timeout=30,  # 连接池超时时间（秒）
    pool_recycle=3600  # 连接回收时间（秒）
)


# 创建基类
Base = declarative_base()

# 定义用户模型
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(Enum("admin", "assistant", "user"), default="user", nullable=False)
    status = Column(Enum("active", "banned"), default="active", nullable=False)
    created_at = Column(DateTime, default=func.now())
    icon = Column(String(255))

    # 定义与 Question 模型的关系
    questions = relationship("Question", back_populates="user", cascade="all, delete-orphan")
    # 定义与 Comment 模型的关系
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    user_info = relationship("UserInfo", back_populates="user", cascade="all, delete-orphan",uselist=False)

# 定义问题模型
class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum("pending", "finished", "answered"), default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now())
    type = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    about = Column(Text)

    # 定义与 User 模型的关系
    user = relationship("User", back_populates="questions")
    # 定义与 Comment 模型的关系
    comments = relationship("Comment", back_populates="question")

# 定义评论模型
class Comment(Base):
    __tablename__ = "comment"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("question.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("comment.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # 定义与 User 模型的关系
    user = relationship("User", back_populates="comments")
    # 定义与 Question 模型的关系
    question = relationship("Question", back_populates="comments")
    # 定义与父评论的关系
    parent_comment = relationship("Comment", remote_side=[id])

class UserInfo(Base):
    __tablename__ = "user_info"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())

    # 定义与 User 模型的关系
    user = relationship("User", back_populates="user_info")


# 创建会话
Session = sessionmaker(bind=engine)

class UserInfoSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    name = fields.Str()
    phone = fields.Str()
    address = fields.Str()
    created_at = fields.DateTime()

# 定义 Schema
class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    email = fields.Str()
    role = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime()
    icon = fields.Str()
    user_info = fields.Nested(UserInfoSchema)

class QuestionSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    content = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime()
    type = fields.Str()
    title = fields.Str()
    about = fields.Str()

class CommentSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    question_id = fields.Int()
    parent_comment_id = fields.Int()
    content = fields.Str()
    created_at = fields.DateTime()
    user = fields.Nested(UserSchema)


# 创建 Schema 实例
user_schema = UserSchema()
question_schema = QuestionSchema()
comment_schema = CommentSchema()
user_info_schema = UserInfoSchema()