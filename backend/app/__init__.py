from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_migrate import Migrate


load_dotenv()

from os import path
db_name = 'storyapp.db'
db=SQLAlchemy()
migrate = Migrate()
socketio = SocketIO(async_mode='eventlet',cors_allowed_origins="http://localhost:3000")
def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key_here'
    CORS(app, origins="http://localhost:3000") 
    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    # Initialize database with the app
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    print('start socket')
    # Import blueprints and register them
    from .models import User,StoryPoem,Image,StoryPoemImages,Genre  # Import models here after initializing db
    

    # Create the database
    with app.app_context():
        create_database(app)
    from .routes import views,story,llm,users
    app.register_blueprint(views, url_prefix='/')
    
    app.register_blueprint(story, url_prefix='/')
    app.register_blueprint(llm, url_prefix='/')
    app.register_blueprint(users,url_prefix='/')
    return app
def create_database(app):
    if not path.exists(db_name):  # Correct file path check

        db.create_all()  # No need to pass `app` since `db` is already initialized
        print('Database created successfully!')
    else:
        
        print('Database already exists.')
