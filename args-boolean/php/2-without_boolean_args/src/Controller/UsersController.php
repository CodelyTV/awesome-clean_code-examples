<?php

declare(strict_types=1);

namespace CodelyTv\Controller;

use CodelyTv\Admin;
use CodelyTv\AdminRepository;
use CodelyTv\User;
use CodelyTv\UserRepository;

final readonly class UsersController
{
	public function __construct(private UserRepository $userRepository, private AdminRepository $adminRepository) {}

	public function usersPost(string $username, string $email, string $name, string $surname): void
	{
		$user = new User($username, $email, $name, $surname);

		$this->userRepository->save($user);
	}

	public function adminsPost(string $username, string $adminCode): void
	{
		$admin = new Admin($username, $adminCode);

		$this->adminRepository->save($admin);
	}
}
