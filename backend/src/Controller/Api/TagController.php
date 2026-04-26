<?php

namespace App\Controller\Api;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/tags')]
class TagController extends AbstractController
{
    #[Route('', name: 'api_tags_index', methods: ['GET'])]
    public function index(TagRepository $tagRepository): JsonResponse
    {
        $tags = $tagRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map([$this, 'normalizeTag'], $tags));
    }

    #[Route('/{id}', name: 'api_tags_show', methods: ['GET'])]
    public function show(Tag $tag): JsonResponse
    {
        return $this->json($this->normalizeTag($tag));
    }

    #[Route('', name: 'api_tags_create', methods: ['POST'])]
    public function create(
        Request $request,
        TagRepository $tagRepository,
        Security $security,
        EntityManagerInterface $em
    ): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $tag = trim($data['name'] ?? '');

        if (!$tag) {
            return $this->json([
                'message' => 'tag est requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        $existingTag = $tagRepository->findOneBy(['name' => $tag]);
        if ($existingTag) {
            return $this->json($this->normalizeTag($existingTag), Response::HTTP_OK);
        }

        $newTag = new Tag();
        $newTag->setName($tag);
        $newTag->setSlug($tag);

        $em->persist($newTag);
        $em->flush();

        return $this->json($this->normalizeTag($newTag), Response::HTTP_CREATED);
    }

    private function normalizeTag(Tag $tag): array
    {
        return [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'slug' => $tag->getSlug()
        ];
    }
}