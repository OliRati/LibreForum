<?php

namespace App\Service;

use App\Entity\Post;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class MercurePostPublisher
{
    public function __construct(
        private HubInterface $hub,
        private LoggerInterface $logger,
    ) {
    }

    public function publishPostCreated(Post $post): void
    {
        $topic = $post->getTopic();
        $author = $post->getAuthor();

        if (!$topic || !$author) {
            $this->logger->error('Cannot publish post without a topic and author', [
                'postId' => $post->getId(),
            ]);

            return;
        }

        try {
            $data = json_encode([
                'type' => 'post_created',
                'post' => [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'createdAt' => $post->getCreatedAt()->format(DATE_ATOM),
                    'updatedAt' => $post->getUpdatedAt()?->format(DATE_ATOM),
                    'isDeleted' => $post->isDeleted(),
                    'moderationStatus' => $post->getModerationStatus(),
                    'toxicityScore' => $post->getToxicityScore(),
                    'author' => [
                        'id' => $author->getId(),
                        'username' => $author->getUsername(),
                        'displayName' => $author->getDisplayName() ?: $author->getUsername(),
                        'avatar' => $author->getAvatarUrl(),
                        'lastSeenAt' => $author->getLastSeenAt()?->format(DATE_ATOM),
                    ],
                    'topic' => [
                        'id' => $topic->getId(),
                        'title' => $topic->getTitle(),
                    ],
                ],
            ], JSON_THROW_ON_ERROR);

            $this->hub->publish(new Update('topic/' . $topic->getId(), $data));
            $this->logger->info('Mercure update published for topic', [
                'topicId' => $topic->getId(),
                'postId' => $post->getId(),
            ]);
        } catch (\Exception $exception) {
            $this->logger->error('Failed to publish Mercure update', [
                'error' => $exception->getMessage(),
                'topicId' => $topic->getId(),
                'postId' => $post->getId(),
            ]);
        }
    }
}
