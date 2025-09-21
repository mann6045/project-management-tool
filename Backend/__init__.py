from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from config import Config
from .models import db

migrate = Migrate()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Specific CORS configuration to allow requests from your React frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app