from sqlalchemy import create_engine, Column, Integer, String, Date, Float
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///hr_dashboard.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(Date, nullable=False)
    emirates_id = Column(String, unique=True, nullable=False)
    passport_number = Column(String, unique=True, nullable=True)
    salary = Column(Float, nullable=False)
    emirates_id_image_path = Column(String, nullable=True)
    passport_image_path = Column(String, nullable=True)

    def __repr__(self):
        return f"<Employee(name='{self.name}', emirates_id='{self.emirates_id}')>"

def init_db():
    """
    Initializes the database and creates tables if they don't exist.
    """
    Base.metadata.create_all(bind=engine)
