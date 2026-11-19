<?php

namespace App\Tests\Security;

use App\Entity\User;
use App\Enum\UserState;
use App\Security\UserChecker;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;

final class UserCheckerTest extends TestCase
{
    public function testActiveUserCanAuthenticate(): void
    {
        $user = (new User())->setState(UserState::ACTIVE);

        self::assertNull((new UserChecker())->checkPreAuth($user));
    }

    public function testDeletedUserCannotAuthenticate(): void
    {
        $this->expectException(CustomUserMessageAccountStatusException::class);

        (new UserChecker())->checkPreAuth((new User())->setState(UserState::DELETED));
    }

    public function testBannedUserCannotAuthenticate(): void
    {
        $this->expectException(CustomUserMessageAccountStatusException::class);

        (new UserChecker())->checkPreAuth((new User())->setState(UserState::BANNED));
    }
}
