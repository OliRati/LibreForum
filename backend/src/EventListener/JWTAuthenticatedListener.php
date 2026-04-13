<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;

class JWTAuthenticatedListener
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em
    ) {}

    public function onJWTAuthenticated(JWTAuthenticatedEvent $event): void
    {
        $payload = $event->getPayload();

        $identifier = $payload['email'] ?? null;

        if (!$identifier) {
            return;
        }

        $user = $this->userRepository->findOneBy([
            'email' => $identifier
        ]);

        if (!$user) {
            return;
        }

        $user->setLastSeenAt(new \DateTimeImmutable());
        $this->em->flush();
    }
}