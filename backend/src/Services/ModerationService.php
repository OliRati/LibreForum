<?php

namespace App\Service;

use App\Entity\ModerationLog;
use App\Entity\Post;
use App\Entity\Topic;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ModerationService
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function log(
        User $moderator,
        string $action,
        ?string $reason = null,
        ?Topic $topic = null,
        ?Post $post = null
    ): void {
        $log = new ModerationLog();
        $log->setModerator($moderator);
        $log->setAction($action);
        $log->setReason($reason);
        $log->setTopic($topic);
        $log->setPost($post);

        $this->em->persist($log);
        $this->em->flush();
    }

    public function moderateTopic(Topic $topic, string $status, ?string $reason, User $moderator): void
    {
        $topic->setModerationStatus($status);
        $this->em->flush();

        $this->log($moderator, 'topic_moderated', $reason, $topic);
    }

    public function moderatePost(Post $post, string $status, ?string $reason, User $moderator): void
    {
        $post->setModerationStatus($status);
        $this->em->flush();

        $this->log($moderator, 'post_moderated', $reason, null, $post);
    }

    public function lockTopic(Topic $topic, bool $locked, ?string $reason, User $moderator): void
    {
        $topic->setIsLocked($locked);
        $this->em->flush();

        $this->log(
            $moderator,
            $locked ? 'topic_locked' : 'topic_unlocked',
            $reason,
            $topic
        );
    }

    public function pinTopic(Topic $topic, bool $pinned, ?string $reason, User $moderator): void
    {
        $topic->setIsPinned($pinned);
        $this->em->flush();

        $this->log(
            $moderator,
            $pinned ? 'topic_pinned' : 'topic_unpinned',
            $reason,
            $topic
        );
    }

    public function softDeleteTopic(Topic $topic, ?string $reason, User $moderator): void
    {
        $topic->setIsDeleted(true);
        $this->em->flush();

        $this->log($moderator, 'topic_deleted', $reason, $topic);
    }

    public function softDeletePost(Post $post, ?string $reason, User $moderator): void
    {
        $post->setIsDeleted(true);
        $this->em->flush();

        $this->log($moderator, 'post_deleted', $reason, null, $post);
    }
}