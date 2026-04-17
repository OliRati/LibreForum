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
        $notification->setUser($user->getId());
        $notification->setType($type);
        $notification->setData($data);

        $notification->setMessage('');
        $notification->setIsRead(false);
        $notification->setPayload('');


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

    public function notifyNewPost($post)
    {
        $topic = $post->getTopic();
        $author = $topic->getAuthor();

        // Notifier l'auteur du topic (sauf si c'est lui qui poste)
        if ($author->getId() !== $post->getAuthor()->getId()) {
            $this->notify($author, 'new_post', [
                'postId' => $post->getId(),
                'topicId' => $topic->getId(),
                'topicTitle' => $topic->getTitle(),
                'authorName' => $post->getAuthor()->getDisplayName() ?: $post->getAuthor()->getUsername(),
            ]);
        }
    }
}
