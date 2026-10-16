<?php

namespace App\Tests\Service;

use App\Service\PasswordPolicy;
use PHPUnit\Framework\TestCase;

final class PasswordPolicyTest extends TestCase
{
    public function testAcceptsPasswordMeetingAllRequirements(): void
    {
        self::assertSame([], (new PasswordPolicy())->getViolations('StrongPassword1!'));
    }

    public function testReportsAllMissingRequirements(): void
    {
        self::assertSame([
            'minimum 12 caractères',
            'au moins une majuscule',
            'au moins un chiffre',
            'au moins un caractère spécial',
        ], (new PasswordPolicy())->getViolations('password'));
    }
}
