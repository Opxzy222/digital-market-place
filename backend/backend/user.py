from .models import User
from django.contrib.auth.hashers import make_password, check_password
import bcrypt
import uuid
from typing import Union

def generate_uuid() -> str:
    # generate a uuid 
    return str(uuid.uuid4())

class DB_user:

    def create_user(self, email, firstName, lastName, password) -> User:
        hashed_password = make_password(password)
        try:
            user = User.objects.create(email=email, firstname=firstName,
                    lastname=lastName, password=hashed_password)
            return user
        except Exception:
            print('user already exist')
    
    def find_user(self, **kwargs) -> User:
       user = User.objects.filter(**kwargs).first()
       
       if not user:
           print('no user found')
           
       return user
    
    def valid_login(self, email: str, password: str) -> bool:
        try:
            user = self.find_user(email=email)
            if user:
                if check_password(password.encode('utf-8'),
                                  user.password):
                    return True
                else:
                    return False
            else:
                print('no user found')
        except Exception:
            return False
    
    def update_user(self, user_id: int, **kwargs):
        user = self.find_user(id=user_id)

        if user:
            try:
                for key, value in kwargs.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                    else:
                        print('invalid attribute')
            # Save the changes to the database
                user.save()
            except Exception as e:
            # Handle any errors that occur during the update process
                print(f"Error updating user: {e}")
        
        else:
            raise ValueError('No user found with the provided user_id')
        
    def create_session(self, email):
        user = self.find_user(email=email)

        try:
            if user:
                session_id = generate_uuid()
                self.update_user(user.id, session_id=session_id)
        except Exception:
            raise 

    def get_user_by_session_id(self, session_id) -> Union[User, None]:
        if session_id is None:
            return None
        try:
            user = self.find_user(session_id=session_id)
            return user
        except Exception:
            return None
        
    def destroy_session(self, user_id: int)-> None:
        user = self.find_user(id=user_id)
        try:
            if user:
                user.session_id = None
                self.update_user(user.id, session_id=user.session_id)
        except Exception:
            return None
        
    def get_reset_token(self, email):
        user = self.find_user(email=email)
        try:
            if user:
                reset_token = generate_uuid()
                self.update_user(user.id, reset_token=reset_token)
        except Exception:
            raise

    def reset_password(self, reset_token, password):
        user = self.find_user(reset_token=reset_token)
        try:
            if user:
                password = make_password(password)
                self.update_user(user.id, password=password)
                print('password change sucessfully')
        except Exception:
            raise
