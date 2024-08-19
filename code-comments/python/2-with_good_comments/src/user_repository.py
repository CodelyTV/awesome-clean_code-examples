from typing import Dict, Optional

import psycopg2
from psycopg2.extras import DictCursor


class UserRepository:
	def __init__(self, db_params: Dict[str, str]):
		self.db_params = db_params

	def save(self, user: Dict[str, any]) -> Dict[str, any]:
		"""
		Save a user in database.
		"""
		with psycopg2.connect(**self.db_params) as conn:
			with conn.cursor() as cur:
				# If user has id, it means it already exists in database, so we have to update it
				# Otherwise, we have to insert a new user
				if 'id' not in user:
					# Update existing user
					cur.execute('''
						INSERT INTO users (name, email, age)
						VALUES (%s, %s, %s)
						RETURNING id
					''', (user.get('name'), user.get('email'), user.get('age')))
					user['id'] = cur.fetchone()[0]
				else:
					# Insert new user
					cur.execute('''
						UPDATE users
						SET name = %s, email = %s, age = %s
						WHERE id = %s
					''', (user.get('name'), user.get('email'), user.get('age'), user['id']))

					cur.execute('''
						UPDATE erp_users
						SET name = %s, email = %s, age = %s
						WHERE legacy_id = %s
					''', (user.get('name'), user.get('email'), user.get('age'), user['id']))

			conn.commit()

		return user


def find_by_id(self, user_id: int) -> Optional[Dict[str, any]]:
	"""
	Search a user by id.
	"""
	with psycopg2.connect(**self.db_params) as conn:
		with conn.cursor(cursor_factory=DictCursor) as cur:
			cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
			row = cur.fetchone()

			if row:
				return dict(row)

			return None
