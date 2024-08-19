from typing import Dict, Optional

import psycopg2
from psycopg2.extras import DictCursor


class UserRepository:
	def __init__(self, db_params: Dict[str, str]):
		self.db_params = db_params

	def save(self, user: Dict[str, any]) -> Dict[str, any]:
		with psycopg2.connect(**self.db_params) as conn:
			with conn.cursor() as cur:
				if self.is_new_user(user):
					cur.execute('''
						INSERT INTO users (name, email, age)
						VALUES (%s, %s, %s)
						RETURNING id
					''', (user.get('name'), user.get('email'), user.get('age')))
					user['id'] = cur.fetchone()[0]
				else:
					cur.execute('''
						UPDATE users
						SET name = %s, email = %s, age = %s
						WHERE id = %s
					''', (user.get('name'), user.get('email'), user.get('age'), user['id']))

					# We also update the user in the ERP system.
					#
					# Context:
					# 1. When we create a user in our system, we also create it in the ERP system via their API.
					# 2. However, the ERP system does not provide an endpoint for updating users.
					#
					# Solution:
					# To keep both systems in sync, we directly connect to the ERP's database
					# and update the user information there.
					#
					# Note: This is a temporary solution until the ERP provides an official update method.
					cur.execute('''
						UPDATE erp_users
						SET name = %s, email = %s, age = %s
						WHERE legacy_id = %s
					''', (user.get('name'), user.get('email'), user.get('age'), user['id']))

			conn.commit()

		return user

	def is_new_user(self, user):
		return 'id' not in user

def find_by_id(self, user_id: int) -> Optional[Dict[str, any]]:
	with psycopg2.connect(**self.db_params) as conn:
		with conn.cursor(cursor_factory=DictCursor) as cur:
			cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
			row = cur.fetchone()

			if row:
				return dict(row)

			return None
