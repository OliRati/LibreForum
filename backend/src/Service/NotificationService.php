<?php

namespace App\Service;

use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class NotificationService
{
    public function __construct(
        private EntityManagerInterface $em,
        private HubInterface $hub
    ) {
    }

    public function notify($user, string $type, array $data = [])
    {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setType($type);
        $notification->setData($data);

        $this->em->persist($notification);
        $this->em->flush();

        // Push temps réel
        $update = new Update(
            'user/' . $user->getId(),
            json_encode([
                'type' => 'notification',
                'notification' => [
                    'id' => $notification->getId(),
                    'type' => $type,
                    'data' => $data,
                ]
            ])
        );

        $this->hub->publish($update);
    }
}
