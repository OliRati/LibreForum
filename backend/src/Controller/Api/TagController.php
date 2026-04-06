<?php

namespace App\Controller\Api;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/api/tags')]
final class TagController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(TagRepository $tagRepository): JsonResponse
    {
        $tags = $tagRepository->findAll();

        return $this->json(array_map(fn(Tag $tag) => [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'slug' => $tag->getSlug(),
        ], $tags));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Tag $tag): JsonResponse
    {
        return $this->json([
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'slug' => $tag->getSlug(),
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $slugger = new AsciiSlugger();

        if (empty($payload['name'])) {
            return $this->json(['error' => 'Le nom est requis'], 400);
        }

        $tag = new Tag();
        $tag
            ->setName($payload['name'])
            ->setSlug(strtolower((string) $slugger->slug($payload['name'])));

        $em->persist($tag);
        $em->flush();

        return $this->json(['message' => 'Tag créé', 'id' => $tag->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Tag $tag, Request $request, EntityManagerInterface $em): JsonResponse
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

        if (isset($payload['name'])) {
            $tag->setName($payload['name']);
            $tag->setSlug(strtolower((string) $slugger->slug($payload['name'])));
        }

        $em->flush();

        return $this->json(['message' => 'Tag mis à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Tag $tag, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($tag);
        $em->flush();

        return $this->json(['message' => 'Tag supprimé']);
    }
}