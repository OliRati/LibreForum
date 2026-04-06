<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Entity\User;
use App\Repository\PostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/posts')]
final class PostController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $topicId = $request->query->get('topicId');

        if ($topicId) {
            $posts = $em->getRepository(Post::class)->findBy(
                ['topic' => $topicId],
                ['createdAt' => 'ASC']
            );
        } else {
            $posts = $em->getRepository(Post::class)->findAll();
        }

        return $this->json(array_map(fn(Post $post) => [
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format('c'),
            'updatedAt' => $post->getUpdatedAt()?->format('c'),
            'author' => [
                'id' => $post->getAuthor()?->getId(),
                'username' => $post->getAuthor()?->getUsername(),
                'displayName' => $post->getAuthor()?->getDisplayName(),
            ],
        ], $posts));
    }    #[Route('', methods: ['GET'])]

    #[Route('/{id}', methods: ['GET'])]
    public function show(Post $post): JsonResponse
    {
        return $this->json([
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format('c'),
            'updatedAt' => $post->getUpdatedAt()?->format('c'),
            'author' => [
                'id' => $post->getAuthor()?->getId(),
                'username' => $post->getAuthor()?->getUsername(),
                'displayName' => $post->getAuthor()?->getDisplayName(),
            ],
            'topic' => [
                'id' => $post->getTopic()?->getId(),
                'title' => $post->getTopic()?->getTitle(),
                'slug' => $post->getTopic()?->getSlug(),
            ],
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $payload = json_decode($request->getContent(), true);

        if (empty($payload['content']) || empty($payload['topicId'])) {
            return $this->json(['error' => 'content et topicId sont requis'], 400);
        }

        $topic = $em->getRepository(Topic::class)->find($payload['topicId']);

        if (!$topic) {
            return $this->json(['error' => 'Sujet introuvable'], 404);
        }

        $post = new Post();
        $post
            ->setContent($payload['content'])
            ->setAuthor($user)
            ->setTopic($topic);

        $em->persist($post);
        $em->flush();

        return $this->json(['message' => 'Réponse créée', 'id' => $post->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Post $post, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $isOwner = $post->getAuthor()?->getId() === $user->getId();
        $isModerator = in_array('ROLE_MODERATOR', $user->getRoles(), true) || in_array('ROLE_ADMIN', $user->getRoles(), true);

        if (!$isOwner && !$isModerator) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $payload = json_decode($request->getContent(), true);

        if (array_key_exists('content', $payload)) {
            $post->setContent($payload['content']);
            $post->setUpdatedAt(new \DateTimeImmutable());
        }

        $em->flush();

        return $this->json(['message' => 'Réponse mise à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Post $post, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($post);
        $em->flush();

        return $this->json(['message' => 'Réponse supprimée']);
    }
}