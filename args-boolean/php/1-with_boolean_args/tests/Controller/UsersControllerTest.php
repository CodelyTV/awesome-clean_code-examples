<?php

declare(strict_types=1);

namespace CodelyTv\Tests\Controller;

use CodelyTv\Admin;
use CodelyTv\AdminRepository;
use CodelyTv\Controller\UsersController;
use CodelyTv\User;
use CodelyTv\UserRepository;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Throwable;

final class UsersControllerTest extends TestCase
{
	#[Test] public function itShouldSaveValidUsers(): void
	{
		$validUsers = [
			[
				'username' => 'validAdminUsername',
				'isAdmin' => true,
				'email' => null,
				'name' => null,
				'surname' => null,
				'adminCode' => 'ADM001',
			],
			[
				'username' => 'validUserUsername',
				'isAdmin' => false,
				'email' => 'valid@mail.com',
				'name' => 'Javier',
				'surname' => 'Ferrer',
				'adminCode' => null,
			],
		];

		foreach ($validUsers as $validUser) {
			$userRepository = $this->userRepository();
			$adminRepository = $this->adminRepository();
			$controller = new UsersController($userRepository, $adminRepository);

			if ($validUser['isAdmin']) {
				$admin = new Admin($validUser['username'], $validUser['adminCode']);

				$adminRepository->expects($this->once())
					->method('save')
					->with($admin);
			} else {
				$user = new User($validUser['username'], $validUser['email'], $validUser['name'], $validUser['surname']);

				$userRepository->expects($this->once())
					->method('save')
					->with($user);
			}

			$controller->post(
				$validUser['username'],
				$validUser['isAdmin'],
				$validUser['email'],
				$validUser['name'],
				$validUser['surname'],
				$validUser['adminCode']
			);
		}
	}

	#[DataProvider('invalidUsers')]
	#[Test] public function itShouldNotSaveAnInvalidUser(
		Throwable $expectedError,
		string $username,
		bool $isAdmin,
		?string $email = null,
		?string $name = null,
		?string $surname = null,
		?string $adminCode = null,
	): void {
		$userRepository = $this->userRepository();
		$adminRepository = $this->adminRepository();
		$controller = new UsersController($userRepository, $adminRepository);

		$this->expectExceptionObject($expectedError);

		$controller->post($username, $isAdmin, $email, $name, $surname, $adminCode);
	}

	public static function invalidUsers(): array
	{
		return [
			'regular user: email required' => [
				new InvalidArgumentException('email is required for regular users'),
				'validAdminUsername',
				false,
				null,
				null,
				null,
				null,
			],
			'regular user: name required' => [
				new InvalidArgumentException('name is required for regular users'),
				'validAdminUsername',
				false,
				'valid@mail.com',
				null,
				null,
				null,
			],
			'regular user: surname required' => [
				new InvalidArgumentException('surname is required for regular users'),
				'validAdminUsername',
				false,
				'valid@mail.com',
				'Javier',
				null,
				null,
			],
			'admin user: adminCode required' => [
				new InvalidArgumentException('adminCode is required for admin users'),
				'validAdminUsername',
				true,
				null,
				null,
				null,
				null,
			],
		];
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
