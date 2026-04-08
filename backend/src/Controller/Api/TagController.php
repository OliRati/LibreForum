<?php

namespace App\Controller\Api;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/tags')]
class TagController extends AbstractController
{
    #[Route('', name: 'api_tags_index', methods: ['GET'])]
    public function index(TagRepository $tagRepository): JsonResponse
    {
        $tags = $tagRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map(
            fn(Tag $tag) => [
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'slug' => $tag->getSlug(),
            ],
            $tags
        ));
    }

    #[Route('/{id}', name: 'api_tags_show', methods: ['GET'])]
    public function show(Tag $tag): JsonResponse
    {
        return $this->json([
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'slug' => $tag->getSlug(),
        ]);
    }
}