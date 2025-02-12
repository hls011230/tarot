from flask import jsonify


def response(data, status_code=200):
    """
    创建并返回一个响应对象
    :param data: 要返回的数据
    :param status_code: 响应状态码，默认为200
    :param headers: 响应头字典，默认为None
    :return: 响应对象
    """

    return jsonify(data=data,code=status_code)