from flask import Blueprint, jsonify,request,session
from app.models.models import User
from .. import db  
import bcrypt
users= Blueprint('users', __name__)
@users.route('/register',methods=['POST'])
def register():
  data=request.get_json()
  name=data['name']
  email=data['email']
  password=data['password']
  if(not name or not email or not password ):
    return jsonify({"error": "Missing required fields"}), 400

  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  user=User(username=name,email=email,password=hashed_password)
  db.session.add(user)
  db.session.commit()
  print(user)
  session["user_id"]=user.id
  session['username']=user.username
  print(session)
  return jsonify({"message": "User created successfully"}), 201
@users.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    print(email, password)
    
    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password):  # No need to encode user.password
        return jsonify({"error": "Invalid email or password"}), 401
    
    
    session["user_id"] = user.id
    session['username'] = user.username
    print(f"Session set: {session}")
    
   
    return jsonify({"message": "You are logged in"}), 200

@users.route('/logout')
def logout():
  session.pop('user_id', None)
  session.pop('username', None)
  return jsonify({"message": "Logged out successfully"}), 200

    





