<?php

declare(strict_types=1);

namespace CodelyTv;

final readonly class User
{
	public function __construct(
		private string $username,
		private string $email,
		private string $name,
		private string $surname
	) {}
}
