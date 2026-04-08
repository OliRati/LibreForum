<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Repository\PostRepository;
use App\Repository\TopicRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/posts')]
class PostController extends AbstractController
{
    #[Route('', name: 'api_posts_index', methods: ['GET'])]
    public function index(Request $request, PostRepository $postRepository): JsonResponse
    {
        $topicId = (int) $request->query->get('topicId', 0);

        if (!$topicId) {
            return $this->json(['message' => 'topicId requis'], Response::HTTP_BAD_REQUEST);
        }

        $posts = $postRepository->findBy(
            ['topic' => $topicId],
            ['createdAt' => 'ASC']
        );

        return $this->json(array_map([$this, 'normalizePost'], $posts));
    }

    #[Route('', name: 'api_posts_create', methods: ['POST'])]
    public function create(
        Request $request,
        TopicRepository $topicRepository,
        EntityManagerInterface $em,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $content = trim($data['content'] ?? '');
        $topicId = (int) ($data['topicId'] ?? 0);

        if (!$content || !$topicId) {
            return $this->json([
                'message' => 'content et topicId sont requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        $topic = $topicRepository->find($topicId);
        if (!$topic) {
            return $this->json(['message' => 'Topic introuvable'], Response::HTTP_NOT_FOUND);
        }

        if ($topic->isLocked()) {
            return $this->json(['message' => 'Topic verrouillé'], Response::HTTP_FORBIDDEN);
        }

        $post = new Post();
        $post->setContent($content);
        $post->setTopic($topic);
        $post->setAuthor($user);
        $post->setCreatedAt(new \DateTimeImmutable());

        $em->persist($post);
        $em->flush();

        return $this->json($this->normalizePost($post), Response::HTTP_CREATED);
    }

    private function normalizePost(Post $post): array
    {
        return [
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()?->format(DATE_ATOM),
            'updatedAt' => $post->getUpdatedAt()?->format(DATE_ATOM),
            'topicId' => $post->getTopic()?->getId(),
            'author' => $post->getAuthor() ? [
                'id' => $post->getAuthor()->getId(),
                'username' => $post->getAuthor()->getUsername(),
                'displayName' => $post->getAuthor()->getDisplayName() ?: $post->getAuthor()->getUsername(),
            ] : null,
        ];
    }
}