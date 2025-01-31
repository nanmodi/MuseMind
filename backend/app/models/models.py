from .. import db
from flask_login import UserMixin
class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Encrypted password
    
    stories = db.relationship('StoryPoem', backref='user', lazy=True)  
    def get_userid(self):
        return self.id


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), nullable=False)  # URL of the generated image
    description = db.Column(db.String(500), nullable=True)  # Optional description


class StoryPoemImages(db.Model):
    __tablename__ = 'story_poem_images'
    story_poem_id = db.Column(db.Integer, db.ForeignKey('story_poem.id'), primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('image.id'), primary_key=True)


story_poem_genre = db.Table('story_poem_genre',
    db.Column('story_poem_id', db.Integer, db.ForeignKey('story_poem.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'), primary_key=True)
)

class StoryPoem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Link to the User who created the prompt
   
    # Many-to-many relationship with Image (optional)
    images = db.relationship('Image', secondary='story_poem_images', lazy='subquery', backref=db.backref('stories_poems', lazy=True), uselist=True)  # Optional images

    # Many-to-many relationship with Genre through the association table
    genres = db.relationship('Genre', secondary=story_poem_genre, backref=db.backref('stories_poems', lazy=True))
    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "type": self.type,
            "user_id": self.user_id,
            "genres": [{"id": genre.id, "name": genre.name} for genre in self.genres],
            "images": [{"id": image.id, "url": image.url} for image in self.images],
        }

class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
