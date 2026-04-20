<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'api_categories_index', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map(
            fn(Category $category) => [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'slug' => $category->getSlug(),
                'description' => $category->getDescription(),
                'topicsCount' => $categoryRepository->countTopics($category),
                'postsCount' => $categoryRepository->countPosts($category),
                'participantsCount' => $categoryRepository->countParticipants($category),
                'lastContributionAt' => $categoryRepository->getLastContributionAt($category)?->format(DATE_ATOM),
            ],
            $categories
        ));
    }

    #[Route('/{id}', name: 'api_categories_show', methods: ['GET'])]
    public function show(Category $category, CategoryRepository $categoryRepository): JsonResponse
    {
        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'topicsCount' => $categoryRepository->countTopics($category),
            'postsCount' => $categoryRepository->countPosts($category),
            'participantsCount' => $categoryRepository->countParticipants($category),
            'lastContributionAt' => $categoryRepository->getLastContributionAt($category)?->format(DATE_ATOM),
        ]);
    }
}