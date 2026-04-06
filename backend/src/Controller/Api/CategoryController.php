<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/api/categories')]
final class CategoryController extends AbstractController
{
    #[Route('', name: 'api_categories_index', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(fn(Category $category) => [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'icon' => $category->getIcon(),
            'createdAt' => $category->getCreatedAt()->format('c'),
        ], $categories);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_categories_show', methods: ['GET'])]
    public function show(Category $category): JsonResponse
    {
        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'icon' => $category->getIcon(),
            'createdAt' => $category->getCreatedAt()->format('c'),
        ]);
    }

    #[Route('', name: 'api_categories_store', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $slugger = new AsciiSlugger();

        if (empty($payload['name'])) {
            return $this->json(['error' => 'Le nom est requis'], 400);
        }

        $category = new Category();
        $category
            ->setName($payload['name'])
            ->setSlug(strtolower((string) $slugger->slug($payload['name'])))
            ->setDescription($payload['description'] ?? null)
            ->setIcon($payload['icon'] ?? null);

        $em->persist($category);
        $em->flush();

        return $this->json([
            'message' => 'Catégorie créée',
            'id' => $category->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'api_categories_update', methods: ['PUT', 'PATCH'])]
    public function update(Category $category, Request $request, EntityManagerInterface $em): JsonResponse
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
            $category->setName($payload['name']);
            $category->setSlug(strtolower((string) $slugger->slug($payload['name'])));
        }

        if (array_key_exists('description', $payload)) {
            $category->setDescription($payload['description']);
        }

        if (array_key_exists('icon', $payload)) {
            $category->setIcon($payload['icon']);
        }

        $em->flush();

        return $this->json(['message' => 'Catégorie mise à jour']);
    }

    #[Route('/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($category);
        $em->flush();

        return $this->json(['message' => 'Catégorie supprimée']);
    }
}