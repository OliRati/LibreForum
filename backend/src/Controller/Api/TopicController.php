<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Tag;
use App\Entity\Topic;
use App\Repository\CategoryRepository;
use App\Repository\TagRepository;
use App\Repository\TopicRepository;
use App\Service\LlmService;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/topics')]
class TopicController extends AbstractController
{
    public function __construct(
        private LlmService $llm,
        private NotificationService $notificationService
    ) {}

    #[Route('', name: 'api_topics_index', methods: ['GET'])]
    public function index(Request $request, TopicRepository $topicRepository): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(50, (int) $request->query->get('limit', 10)));

        $categoryId = $request->query->get('categoryId');
        $categoryId = $categoryId !== null ? (int) $categoryId : null;

        $tagId = $request->query->get('tagId');
        $tagId = $tagId !== null ? (int) $tagId : null;

        $search = trim((string) $request->query->get('search', ''));
        $search = $search !== '' ? $search : null;

        $result = $topicRepository->findPaginatedFiltered(
            page: $page,
            limit: $limit,
            categoryId: $categoryId,
            search: $search,
            tagId: $tagId
        );

        return $this->json([
            'items' => array_map(fn(Topic $topic) => $this->normalizeTopic($topic, $topicRepository), $result['items']),
            'page' => $result['page'],
            'totalPages' => $result['totalPages'],
            'total' => $result['total'],
        ]);
    }

    #[Route('/{id}', name: 'api_topics_show', methods: ['GET'])]
    public function show(Topic $topic, TopicRepository $topicRepository): JsonResponse
    {
        return $this->json($this->normalizeTopic($topic, $topicRepository));
    }

    #[Route('/{id}/posts', name: 'api_topics_posts', methods: ['GET'])]
    public function posts(Topic $topic, Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(50, (int) $request->query->get('limit', 10)));
        $offset = ($page - 1) * $limit;

        $allPosts = $topic->getPosts()->toArray();
        $total = count($allPosts);
        $posts = array_slice($allPosts, $offset, $limit);

        $data = array_map([$this, 'normalizePost'], $posts);

        return $this->json([
            'items' => $data,
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => max(1, (int) ceil($total / $limit)),
        ]);
    }

    #[Route('/{id}/posts', name: 'api_topics_posts_create', methods: ['POST'])]
    public function createPost(
        Topic $topic,
        Request $request,
        EntityManagerInterface $em,
        Security $security,
        TopicRepository $topicRepository
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        if ($topic->isLocked()) {
            return $this->json(['message' => 'Topic verrouillé'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $content = trim($data['content'] ?? '');

        if (!$content) {
            return $this->json(['message' => 'Le contenu est requis'], Response::HTTP_BAD_REQUEST);
        }

        $post = new Post();
        $post->setContent($content);
        $post->setTopic($topic);
        $post->setAuthor($user);
        $post->setCreatedAt(new \DateTimeImmutable());

        // LLM Automatic moderation on post
        $analysis = $this->llm->moderate($post->getContent());

        $post->setToxicityScore($analysis['toxicity'] ?? 0);

        $status = match ($analysis['label'] ?? 'clean') {
            'toxic' => 'blocked',
            'warning' => 'flagged',
            default => 'approved'
        };

        $post->setModerationStatus($status);

        $em->persist($post);
        $em->flush();

        // Send notification to topic author if different from post author
        if ($topic->getAuthor() !== $user) {
            $this->notificationService->notifyNewPost($post);
        }

        return $this->json($this->normalizePost($post), Response::HTTP_CREATED);
    }

    #[Route('', name: 'api_topics_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        CategoryRepository $categoryRepository,
        TagRepository $tagRepository,
        TopicRepository $topicRepository,
        Security $security,
        SluggerInterface $slugger
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $title = trim($data['title'] ?? '');
        $content = trim($data['content'] ?? '');
        $categoryId = $data['categoryId'] ?? null;
        $tagIds = $data['tagIds'] ?? [];

        if (!$title || !$content || !$categoryId) {
            return $this->json([
                'message' => 'title, content et categoryId sont requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        $category = $categoryRepository->find($categoryId);
        if (!$category) {
            return $this->json(['message' => 'Catégorie introuvable'], Response::HTTP_NOT_FOUND);
        }

        $topic = new Topic();
        $topic->setTitle($title);
        $topic->setContent($content);
        $topic->setCategory($category);
        $topic->setAuthor($user);
        $topic->setCreatedAt(new \DateTimeImmutable());

        $baseSlug = strtolower($slugger->slug($title)->toString());
        $slug = $baseSlug . '-' . substr(uniqid(), -6);
        $topic->setSlug($slug);

        foreach ($tagIds as $tagId) {
            $tag = $tagRepository->find((int) $tagId);
            if ($tag) {
                $topic->addTag($tag);
            }
        }

        $em->persist($topic);
        $em->flush();

        return $this->json($this->normalizeTopic($topic, $topicRepository), Response::HTTP_CREATED);
    }

    private function normalizeTopic(Topic $topic, TopicRepository $topicRepository): array
    {
        return [
            'id' => $topic->getId(),
            'title' => $topic->getTitle(),
            'slug' => $topic->getSlug(),
            'content' => $topic->getContent(),
            'createdAt' => $topic->getCreatedAt()?->format(DATE_ATOM),
            'updatedAt' => $topic->getUpdatedAt()?->format(DATE_ATOM),
            'isPinned' => $topic->isPinned(),
            'toxicityScore' => $topic->getToxicityScore(),
            'isLocked' => $topic->isLocked(),
            'author' => $topic->getAuthor() ? [
                'id' => $topic->getAuthor()->getId(),
                'username' => $topic->getAuthor()->getUsername(),
                'displayName' => $topic->getAuthor()->getDisplayName() ?: $topic->getAuthor()->getUsername(),
                'avatar' => $topic->getAuthor()->getAvatarUrl(),
                'lastSeenAt' => $topic->getAuthor()->getLastSeenAt()?->format(DATE_ATOM),
            ] : null,
            'category' => $topic->getCategory() ? [
                'id' => $topic->getCategory()->getId(),
                'name' => $topic->getCategory()->getName(),
                'slug' => $topic->getCategory()->getSlug(),
            ] : null,
            'tags' => array_map(
                fn(Tag $tag) => [
                    'id' => $tag->getId(),
                    'name' => $tag->getName(),
                    'slug' => $tag->getSlug(),
                ],
                $topic->getTags()->toArray()
            ),
            'postsCount' => $topic->getPosts()->count(),
            'participantsCount' => $topicRepository->countParticipants($topic),
            'lastContributionAt' => $topicRepository->getLastPostDate($topic)?->format(DATE_ATOM) ?? $topic->getCreatedAt()?->format(DATE_ATOM),
        ];
    }

    private function normalizePost(Post $post): array
    {
        return [
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()?->format(DATE_ATOM),
            'updatedAt' => $post->getUpdatedAt()?->format(DATE_ATOM),
            'isDeleted' => $post->isDeleted(),
            'moderationStatus' => $post->getModerationStatus(),
            'toxicityScore' => $post->getToxicityScore(),
            'author' => $post->getAuthor() ? [
                'id' => $post->getAuthor()->getId(),
                'username' => $post->getAuthor()->getUsername(),
                'displayName' => $post->getAuthor()->getDisplayName() ?: $post->getAuthor()->getUsername(),
                'avatar' => $post->getAuthor()->getAvatarUrl(),
                'lastSeenAt' => $post->getAuthor()->getLastSeenAt()?->format(DATE_ATOM),
            ] : null,
            'topic' => $post->getTopic() ? [
                'id' => $post->getTopic()->getId(),
                'title' => $post->getTopic()->getTitle(),
            ] : null,
        ];
    }
}