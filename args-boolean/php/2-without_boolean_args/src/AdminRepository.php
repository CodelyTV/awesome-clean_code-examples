<?php
declare(strict_types=1);

namespace CodelyTv;

interface AdminRepository
{
	public function save(Admin $admin): void;

	public function search(string $username): Admin;
}
