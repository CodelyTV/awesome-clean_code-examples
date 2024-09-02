<?php

declare(strict_types=1);

namespace CodelyTv;

final readonly class Admin
{
	public function __construct(private string $username, private string $code) {}
}
