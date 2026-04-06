<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Entity\Tag;
use App\Entity\Topic;
use App\Entity\User;
use App\Repository\TopicRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/api/topics')]
final class TopicController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(TopicRepository $topicRepository): JsonResponse
    {
        $topics = $topicRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn(Topic $topic) => [
            'id' => $topic->getId(),
            'title' => $topic->getTitle(),
            'slug' => $topic->getSlug(),
            'content' => $topic->getContent(),
            'views' => $topic->getViews(),
            'isPinned' => $topic->isPinned(),
            'isLocked' => $topic->isLocked(),
            'createdAt' => $topic->getCreatedAt()->format('c'),
            'updatedAt' => $topic->getUpdatedAt()->format('c'),
            'author' => [
                'id' => $topic->getAuthor()?->getId(),
                'username' => $topic->getAuthor()?->getUsername(),
                'displayName' => $topic->getAuthor()?->getDisplayName(),
            ],
            'category' => [
                'id' => $topic->getCategory()?->getId(),
                'name' => $topic->getCategory()?->getName(),
                'slug' => $topic->getCategory()?->getSlug(),
            ],
            'tags' => array_map(fn(Tag $tag) => [
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'slug' => $tag->getSlug(),
            ], $topic->getTags()->toArray()),
        ], $topics));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Topic $topic): JsonResponse
    {
        return $this->json([
            'id' => $topic->getId(),
            'title' => $topic->getTitle(),
            'slug' => $topic->getSlug(),
            'content' => $topic->getContent(),
            'views' => $topic->getViews(),
            'isPinned' => $topic->isPinned(),
            'isLocked' => $topic->isLocked(),
            'createdAt' => $topic->getCreatedAt()->format('c'),
            'updatedAt' => $topic->getUpdatedAt()->format('c'),
            'author' => [
                'id' => $topic->getAuthor()?->getId(),
                'username' => $topic->getAuthor()?->getUsername(),
                'displayName' => $topic->getAuthor()?->getDisplayName(),
            ],
            'category' => [
                'id' => $topic->getCategory()?->getId(),
                'name' => $topic->getCategory()?->getName(),
                'slug' => $topic->getCategory()?->getSlug(),
            ],
            'tags' => array_map(fn(Tag $tag) => [
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'slug' => $tag->getSlug(),
            ], $topic->getTags()->toArray()),
            'posts' => array_map(fn($post) => [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'createdAt' => $post->getCreatedAt()->format('c'),
                'author' => [
                    'id' => $post->getAuthor()?->getId(),
                    'username' => $post->getAuthor()?->getUsername(),
                    'displayName' => $post->getAuthor()?->getDisplayName(),
                ],
            ], $topic->getPosts()->toArray()),
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
        $slugger = new AsciiSlugger();

        if (empty($payload['title']) || empty($payload['content']) || empty($payload['categoryId'])) {
            return $this->json(['error' => 'title, content et categoryId sont requis'], 400);
        }

        $category = $em->getRepository(Category::class)->find($payload['categoryId']);

        if (!$category) {
            return $this->json(['error' => 'Catégorie introuvable'], 404);
        }

        $topic = new Topic();
        $topic
            ->setTitle($payload['title'])
            ->setSlug(strtolower((string) $slugger->slug($payload['title'])))
            ->setContent($payload['content'])
            ->setAuthor($user)
            ->setCategory($category)
            ->setIsPinned($payload['isPinned'] ?? false)
            ->setIsLocked($payload['isLocked'] ?? false);

        if (!empty($payload['tagIds']) && is_array($payload['tagIds'])) {
            foreach ($payload['tagIds'] as $tagId) {
                $tag = $em->getRepository(Tag::class)->find($tagId);
                if ($tag) {
                    $topic->addTag($tag);
                }
            }
        }

        $em->persist($topic);
        $em->flush();

        return $this->json([
            'message' => 'Sujet créé',
            'id' => $topic->getId(),
        ], 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Topic $topic, Request $request, EntityManagerInterface $em): JsonResponse
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
        $slugger = new AsciiSlugger();

        if (isset($payload['title'])) {
            $topic->setTitle($payload['title']);
            $topic->setSlug(strtolower((string) $slugger->slug($payload['title'])));
        }

        if (array_key_exists('content', $payload)) {
            $topic->setContent($payload['content']);
        }

        if (array_key_exists('isPinned', $payload)) {
            $topic->setIsPinned((bool) $payload['isPinned']);
        }

        if (array_key_exists('isLocked', $payload)) {
            $topic->setIsLocked((bool) $payload['isLocked']);
        }

        if (array_key_exists('categoryId', $payload)) {
            $category = $em->getRepository(Category::class)->find($payload['categoryId']);
            if ($category) {
                $topic->setCategory($category);
            }
        }

        if (array_key_exists('tagIds', $payload) && is_array($payload['tagIds'])) {
            $topic->getTags()->clear();

            foreach ($payload['tagIds'] as $tagId) {
                $tag = $em->getRepository(Tag::class)->find($tagId);
                if ($tag) {
                    $topic->addTag($tag);
                }
            }
        }

        $topic->setUpdatedAt(new \DateTimeImmutable());

        $em->flush();

        return $this->json(['message' => 'Sujet mis à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Topic $topic, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($topic);
        $em->flush();

        return $this->json(['message' => 'Sujet supprimé']);
    }
}