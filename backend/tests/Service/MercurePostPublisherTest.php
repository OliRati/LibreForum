<?php

namespace App\Tests\Service;

use App\Entity\Post;
use App\Entity\Topic;
use App\Entity\User;
use App\Service\MercurePostPublisher;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

final class MercurePostPublisherTest extends TestCase
{
    public function testPublishesPostCreatedWithTheFrontendPostShape(): void
    {
        $createdAt = new DateTimeImmutable('2026-11-16T17:00:00+00:00');
        $lastSeenAt = new DateTimeImmutable('2026-11-16T16:59:00+00:00');

        $author = $this->createStub(User::class);
        $author->method('getId')->willReturn(7);
        $author->method('getUsername')->willReturn('alice');
        $author->method('getDisplayName')->willReturn('Alice');
        $author->method('getAvatarUrl')->willReturn('/uploads/alice.webp');
        $author->method('getLastSeenAt')->willReturn($lastSeenAt);

        $topic = $this->createStub(Topic::class);
        $topic->method('getId')->willReturn(42);
        $topic->method('getTitle')->willReturn('Symfony');

        $post = $this->createStub(Post::class);
        $post->method('getId')->willReturn(123);
        $post->method('getContent')->willReturn('Une réponse en direct');
        $post->method('getCreatedAt')->willReturn($createdAt);
        $post->method('getUpdatedAt')->willReturn(null);
        $post->method('isDeleted')->willReturn(false);
        $post->method('getModerationStatus')->willReturn('approved');
        $post->method('getToxicityScore')->willReturn(0.0);
        $post->method('getAuthor')->willReturn($author);
        $post->method('getTopic')->willReturn($topic);

        $hub = $this->createMock(HubInterface::class);
        $hub->expects(self::once())
            ->method('publish')
            ->with(self::callback(static function (Update $update): bool {
                self::assertSame(['topic/42'], $update->getTopics());

                $payload = json_decode($update->getData(), true, flags: JSON_THROW_ON_ERROR);
                self::assertSame('post_created', $payload['type']);
                self::assertSame(123, $payload['post']['id']);
                self::assertSame('Une réponse en direct', $payload['post']['content']);
                self::assertSame(7, $payload['post']['author']['id']);
                self::assertSame('alice', $payload['post']['author']['username']);
                self::assertSame('Symfony', $payload['post']['topic']['title']);

                return true;
            }))
            ->willReturn('update-id');

        $publisher = new MercurePostPublisher($hub, $this->createStub(LoggerInterface::class));
        $publisher->publishPostCreated($post);
    }
}
