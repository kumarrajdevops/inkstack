from sqlalchemy import text
from app.db.session import engine

def upgrade():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN bio VARCHAR"))
            print("Added bio column")
        except Exception as e:
            print(f"Bio column might already exist: {e}")
            
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR"))
            print("Added avatar_url column")
        except Exception as e:
            print(f"avatar_url column might already exist: {e}")
        
        conn.commit()

if __name__ == "__main__":
    upgrade()
