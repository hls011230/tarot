# app.py

from flask import Flask
from flask_cors import CORS
from controller.controller import bp as api_bp

def create_app():
    app = Flask(__name__,static_folder="static")
    CORS(app)

    # 注册蓝图
    app.register_blueprint(api_bp)

    return app

app = create_app()

# 程序入口
if __name__ == '__main__':
    app.run(host="192.168.1.11",port=8080,debug=True)


