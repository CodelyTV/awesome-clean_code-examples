<?php

declare(strict_types=1);

namespace CodelyTv\Controller;

use CodelyTv\Admin;
use CodelyTv\AdminRepository;
use CodelyTv\User;
use CodelyTv\UserRepository;
use InvalidArgumentException;

final readonly class UsersController
{
	public function __construct(private UserRepository $userRepository, private AdminRepository $adminRepository) {}

	public function post(
		string $username,
		bool $isAdmin,
		?string $email = null,
		?string $name = null,
		?string $surname = null,
		?string $adminCode = null
	): void {
		if ($isAdmin) {
			if ($adminCode === null) {
				throw new InvalidArgumentException('adminCode is required for admin users');
			}

			$admin = new Admin($username, $adminCode);

			$this->adminRepository->save($admin);
		} else {
			if ($email === null) {
				throw new InvalidArgumentException('email is required for regular users');
			}

			if ($name === null) {
				throw new InvalidArgumentException('name is required for regular users');
			}

			if ($surname === null) {
				throw new InvalidArgumentException('surname is required for regular users');
			}

			$user = new User($username, $email, $name, $surname);

			$this->userRepository->save($user);
		}
	}
}
