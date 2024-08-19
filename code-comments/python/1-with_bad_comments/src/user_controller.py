from typing import Dict, Optional, Any

from src.user_repository import UserRepository


class UserController:
	def __init__(self, user_repository: UserRepository):
		self.user_repository = user_repository

	def create_user(self, username: str, email: str) -> Dict[str, Any]:
		"""
		Create a new user.
		"""
		user = {
			'username': username,
			'email': email
		}

		return self.user_repository.save(user)

	def get_user(self, user_id: int) -> Optional[Dict[str, Any]]:
		"""
		Get a user by ID.
		"""
		return self.user_repository.find_by_id(user_id)
