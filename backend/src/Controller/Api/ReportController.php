<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Report;
use App\Entity\Topic;
use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\ReportRepository;
use App\Repository\TopicRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/reports')]
class ReportController extends AbstractController
{
    #[Route('', name: 'api_reports_create', methods: ['POST'])]
    public function create(
        Request $request,
        TopicRepository $topicRepository,
        PostRepository $postRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $reason = trim($data['reason'] ?? '');
        $topicId = $data['topicId'] ?? null;
        $postId = $data['postId'] ?? null;

        if ($reason === '') {
            return $this->json(['message' => 'Reason is required'], 400);
        }

        if (!$topicId && !$postId) {
            return $this->json(['message' => 'topicId or postId is required'], 400);
        }

        $report = new Report();
        $report->setReason($reason);
        $report->setReporter($user);

        if ($topicId) {
            $topic = $topicRepository->find($topicId);
            if (!$topic instanceof Topic) {
                return $this->json(['message' => 'Topic not found'], 404);
            }
            $report->setTopic($topic);
        }

        if ($postId) {
            $post = $postRepository->find($postId);
            if (!$post instanceof Post) {
                return $this->json(['message' => 'Post not found'], 404);
            }
            $report->setPost($post);
        }

        $em->persist($report);
        $em->flush();

        return $this->json([
            'message' => 'Report submitted successfully',
            'report' => [
                'id' => $report->getId(),
                'reason' => $report->getReason(),
                'status' => $report->getStatus(),
                'createdAt' => $report->getCreatedAt()?->format(DATE_ATOM),
            ],
        ], 201);
    }

    #[Route('', name: 'api_reports_list', methods: ['GET'])]
    public function list(ReportRepository $reportRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_MODERATOR');

        $reports = $reportRepository->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(function (Report $report) {
            return [
                'id' => $report->getId(),
                'reason' => $report->getReason(),
                'status' => $report->getStatus(),
                'createdAt' => $report->getCreatedAt()?->format(DATE_ATOM),
                'reporter' => [
                    'id' => $report->getReporter()?->getId(),
                    'username' => $report->getReporter()?->getUsername(),
                ],
                'topic' => $report->getTopic() ? [
                    'id' => $report->getTopic()?->getId(),
                    'title' => $report->getTopic()?->getTitle(),
                ] : null,
                'post' => $report->getPost() ? [
                    'id' => $report->getPost()?->getId(),
                    'content' => mb_substr($report->getPost()?->getContent() ?? '', 0, 120),
                ] : null,
            ];
        }, $reports);

        return $this->json($data);
    }

    #[Route('/mine', name: 'api_reports_mine', methods: ['GET'])]
    public function mine(ReportRepository $reportRepository): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $reports = $reportRepository->findBy(['reporter' => $user], ['createdAt' => 'DESC']);

        $data = array_map(function (Report $report) {
            return [
                'id' => $report->getId(),
                'reason' => $report->getReason(),
                'status' => $report->getStatus(),
                'createdAt' => $report->getCreatedAt()?->format(DATE_ATOM),
            ];
        }, $reports);

        return $this->json($data);
    }
}