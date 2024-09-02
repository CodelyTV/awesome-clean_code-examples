<?php

declare(strict_types=1);

namespace CodelyTv\Tests\Controller;

use CodelyTv\Admin;
use CodelyTv\AdminRepository;
use CodelyTv\Controller\UsersController;
use CodelyTv\User;
use CodelyTv\UserRepository;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

final class UsersControllerTest extends TestCase
{
	#[Test] public function itShouldSaveValidUser(): void
	{
		$validUser = [
			'username' => 'validUserUsername',
			'email' => 'valid@mail.com',
			'name' => 'Javier',
			'surname' => 'Ferrer',
		];

		$userRepository = $this->userRepository();
		$adminRepository = $this->adminRepository();
		$controller = new UsersController($userRepository, $adminRepository);

		$user = new User($validUser['username'], $validUser['email'], $validUser['name'], $validUser['surname']);

		$userRepository->expects($this->once())
			->method('save')
			->with($user);

		$controller->usersPost($validUser['username'], $validUser['email'], $validUser['name'], $validUser['surname']);
	}

	#[Test] public function itShouldSaveValidAdmin(): void
	{
		$validUser = [
			'username' => 'validAdminUsername',
			'adminCode' => 'ADM001',
		];

		$userRepository = $this->userRepository();
		$adminRepository = $this->adminRepository();
		$controller = new UsersController($userRepository, $adminRepository);

		$admin = new Admin($validUser['username'], $validUser['adminCode']);

		$adminRepository->expects($this->once())
			->method('save')
			->with($admin);


		$controller->adminsPost($validUser['username'], $validUser['adminCode']);
	}

	private function userRepository(): MockObject | UserRepository
	{
		return $this->createMock(UserRepository::class);
	}

	private function adminRepository(): AdminRepository | MockObject
	{
		return $this->createMock(AdminRepository::class);
	}
}
