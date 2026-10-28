<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Entity\User;
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

        if (!is_string($status) || !in_array($status, ['approved', 'blocked'], true)) {
            return $this->json(['message' => 'Invalid moderation status'], 400);
        }

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

        if (!is_string($status) || !in_array($status, ['approved', 'blocked'], true)) {
            return $this->json(['message' => 'Invalid moderation status'], 400);
        }

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