<?php
declare(strict_types=1);

namespace CodelyTv;

interface UserRepository
{
	public function save(User $user): void;

	public function search(string $username): User;
}
