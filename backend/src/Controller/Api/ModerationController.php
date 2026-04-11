<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\TopicRepository;
use App\Security\Voter\PostVoter;
use App\Security\Voter\TopicVoter;
use App\Service\ModerationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ModerationController extends AbstractController
{
    #[Route('/topics/{id}/lock', name: 'api_topic_lock', methods: ['PATCH'])]
    public function lockTopic(
        Topic $topic,
        Request $request,
        ModerationService $moderationService
    ): JsonResponse {
        $this->denyAccessUnlessGranted(TopicVoter::MODERATE, $topic);

        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $locked = (bool)($data['locked'] ?? true);
        $reason = $data['reason'] ?? null;

        $moderationService->lockTopic($topic, $locked, $reason, $user);

        return $this->json([
            'message' => $locked ? 'Topic locked' : 'Topic unlocked',
            'topic' => [
                'id' => $topic->getId(),
                'isLocked' => $topic->isLocked(),
            ],
        ]);
    }

    #[Route('/topics/{id}/pin', name: 'api_topic_pin', methods: ['PATCH'])]
    public function pinTopic(
        Topic $topic,
        Request $request,
        ModerationService $moderationService
    ): JsonResponse {
        $this->denyAccessUnlessGranted(TopicVoter::MODERATE, $topic);

        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $pinned = (bool)($data['pinned'] ?? true);
        $reason = $data['reason'] ?? null;

        $moderationService->pinTopic($topic, $pinned, $reason, $user);

        return $this->json([
            'message' => $pinned ? 'Topic pinned' : 'Topic unpinned',
            'topic' => [
                'id' => $topic->getId(),
                'isPinned' => $topic->isPinned(),
            ],
        ]);
    }

    #[Route('/topics/{id}/moderate', name: 'api_topic_moderate', methods: ['PATCH'])]
    public function moderateTopic(
        Topic $topic,
        Request $request,
        ModerationService $moderationService
    ): JsonResponse {
        $this->denyAccessUnlessGranted(TopicVoter::MODERATE, $topic);

        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $status = $data['status'] ?? 'approved';
        $reason = $data['reason'] ?? null;

        $moderationService->moderateTopic($topic, $status, $reason, $user);

        return $this->json([
            'message' => 'Topic moderated',
            'topic' => [
                'id' => $topic->getId(),
                'moderationStatus' => $topic->getModerationStatus(),
            ],
        ]);
    }

    #[Route('/posts/{id}/moderate', name: 'api_post_moderate', methods: ['PATCH'])]
    public function moderatePost(
        Post $post,
        Request $request,
        ModerationService $moderationService
    ): JsonResponse {
        $this->denyAccessUnlessGranted(PostVoter::MODERATE, $post);

        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $status = $data['status'] ?? 'approved';
        $reason = $data['reason'] ?? null;

        $moderationService->moderatePost($post, $status, $reason, $user);

        return $this->json([
            'message' => 'Post moderated',
            'post' => [
                'id' => $post->getId(),
                'moderationStatus' => $post->getModerationStatus(),
            ],
        ]);
    }
}