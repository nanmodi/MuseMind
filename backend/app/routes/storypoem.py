from flask import Blueprint,jsonify,request,url_for,session
from app.models.models import StoryPoem,User,Genre,Image
from .. import db  
from sqlalchemy.exc import SQLAlchemyError

story = Blueprint('story', __name__)

@story.route('/add-story', methods=['POST'])
def add_story():
    data = request.get_json()  
    if not data:
        return jsonify({"error": "No data provided"}), 400

    text = data['text']
    story_type = data['type'] 
    genre_names = data['genres'] # Expecting a list of genre names
    image_urls = data['images']  # Expecting a list of image URLs
    user_id = session['user_id']  # User ID to associate the story
    print(data)
    # Validate input
    if not text or not story_type or not genre_names or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Validate User ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Create or fetch genres
    genres = []
    for genre_name in genre_names:
        genre = Genre.query.filter_by(name=genre_name).first()
        if not genre:
            genre = Genre(name=genre_name)  # Create new genre if it doesn't exist
            db.session.add(genre)
        genres.append(genre)

    # Create or fetch images
    images = []
    if image_urls:
        for url in image_urls:
            image = Image.query.filter_by(url=url).first()
            if not image:
                image = Image(url=url)  # Create new image if it doesn't exist
                db.session.add(image)
            images.append(image)

    # Create and save the story
    if(len(images)==0):
      story = StoryPoem(text=text, type=story_type, user_id=user_id, genres=genres)
    else:
        story = StoryPoem(text=text, type=story_type, user_id=user_id, genres=genres, images=images)
    db.session.add(story)
    db.session.commit()

    return jsonify({"message": "Story added successfully!", "story_id": story.id}), 201




@story.route('/storypoem')
def storypoem():
    userid = session.get('user_id')
    if not userid:
        return jsonify({"error": "User not authenticated"}), 401

    
    user = User.query.filter_by(id=userid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    stories=StoryPoem.query.filter_by(user_id=userid).all()
    return jsonify({"stories": [story.to_dict() for story in stories]}), 200
    

@story.route('/story-filter', methods=['POST'])
def storyfilter():
    
    userid = session.get('user_id')
    if not userid:
        return jsonify({"error": "User not authenticated"}), 401

   
    user = User.query.filter_by(id=userid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    
    data = request.get_json()
    if not data or 'type' not in data:
        return jsonify({"error": "Invalid request, 'type' is required"}), 400

    story_type = data['type']

    try:
        # Filter stories based on the provided type
        stories = StoryPoem.query.filter(StoryPoem.user_id==userid,StoryPoem.type.ilike(f"%{story_type}%")).all()

        # Return the results
        return jsonify({"stories": [story.to_dict() for story in stories]}), 200

    except SQLAlchemyError as e:
        
        return jsonify({"error": "Database error occurred", "details": str(e)}), 500
    

