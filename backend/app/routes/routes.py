from flask import Blueprint, jsonify

views = Blueprint('views', __name__)

@views.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World!"})
