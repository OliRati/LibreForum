<?php

namespace App\Tests\Service;

use App\Entity\User;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

final class NotificationServiceTest extends TestCase
{
    public function testMercureFailureDoesNotFailThePersistedNotification(): void
    {
        $user = $this->createStub(User::class);
        $user->method('getId')->willReturn(7);

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects(self::once())->method('persist');
        $entityManager->expects(self::once())->method('flush');

        $hub = $this->createMock(HubInterface::class);
        $hub->expects(self::once())
            ->method('publish')
            ->with(self::isInstanceOf(Update::class))
            ->willThrowException(new RuntimeException('Mercure is unavailable'));

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects(self::once())
            ->method('error')
            ->with(
                'Failed to publish Mercure notification',
                self::callback(static fn (array $context): bool => $context['userId'] === 7)
            );

        $service = new NotificationService($entityManager, $hub, $logger);
        $service->notify($user, 'new_post');
    }
}
