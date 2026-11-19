<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\String\UnicodeString;

#[Route('/api/categories')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'api_categories_index', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['name' => 'ASC']);

        return $this->json(array_map(
            fn(Category $category) => $this->normalizeCategory($category, $categoryRepository),
            $categories
        ));
    }

    #[Route('/{id}', name: 'api_categories_show', methods: ['GET'])]
    public function show(Category $category, CategoryRepository $categoryRepository): JsonResponse
    {
        return $this->json($this->normalizeCategory($category, $categoryRepository));
    }

    #[Route('', name: 'api_categories_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(
        Request $request,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        $payload = $this->decodePayload($request);
        if ($payload instanceof JsonResponse) {
            return $payload;
        }
        $unknownFields = $this->validateFields($payload);
        if ($unknownFields !== null) {
            return $unknownFields;
        }

        $name = $this->readName($payload);
        if ($name instanceof JsonResponse) {
            return $name;
        }

        $category = new Category();
        $category->setName($name);
        $slug = $this->createSlug($name, $slugger);
        if ($slug === null) {
            return $this->json(['message' => 'Le nom ne permet pas de générer un slug valide.'], Response::HTTP_BAD_REQUEST);
        }
        $category->setSlug($slug);

        $optionalFields = $this->applyOptionalFields($category, $payload);
        if ($optionalFields instanceof JsonResponse) {
            return $optionalFields;
        }

        if ($this->categoryNameOrSlugExists($category, $categoryRepository)) {
            return $this->json(['message' => 'Le nom ou le slug de catégorie est déjà utilisé.'], Response::HTTP_CONFLICT);
        }

        $entityManager->persist($category);
        try {
            $entityManager->flush();
        } catch (UniqueConstraintViolationException) {
            return $this->json(['message' => 'Le nom ou le slug de catégorie est déjà utilisé.'], Response::HTTP_CONFLICT);
        }

        return $this->json(
            $this->normalizeCategory($category, $categoryRepository),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'api_categories_update', methods: ['PUT', 'PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(
        Category $category,
        Request $request,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        $payload = $this->decodePayload($request);
        if ($payload instanceof JsonResponse) {
            return $payload;
        }
        $unknownFields = $this->validateFields($payload);
        if ($unknownFields !== null) {
            return $unknownFields;
        }
        if ($payload === []) {
            return $this->json(['message' => 'Au moins un champ doit être fourni.'], Response::HTTP_BAD_REQUEST);
        }

        if (array_key_exists('name', $payload)) {
            $name = $this->readName($payload);
            if ($name instanceof JsonResponse) {
                return $name;
            }

            $slug = $this->createSlug($name, $slugger);
            if ($slug === null) {
                return $this->json(['message' => 'Le nom ne permet pas de générer un slug valide.'], Response::HTTP_BAD_REQUEST);
            }
            $category->setName($name)->setSlug($slug);
        }

        $optionalFields = $this->applyOptionalFields($category, $payload);
        if ($optionalFields instanceof JsonResponse) {
            return $optionalFields;
        }

        if ($this->categoryNameOrSlugExists($category, $categoryRepository)) {
            return $this->json(['message' => 'Le nom ou le slug de catégorie est déjà utilisé.'], Response::HTTP_CONFLICT);
        }

        try {
            $entityManager->flush();
        } catch (UniqueConstraintViolationException) {
            return $this->json(['message' => 'Le nom ou le slug de catégorie est déjà utilisé.'], Response::HTTP_CONFLICT);
        }

        return $this->json($this->normalizeCategory($category, $categoryRepository));
    }

    #[Route('/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(
        Category $category,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        if ($categoryRepository->countTopics($category) > 0) {
            return $this->json(
                ['message' => 'Une catégorie contenant des sujets ne peut pas être supprimée.'],
                Response::HTTP_CONFLICT
            );
        }

        $entityManager->remove($category);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    private function normalizeCategory(Category $category, CategoryRepository $categoryRepository): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'icon' => $category->getIcon(),
            'topicsCount' => $categoryRepository->countTopics($category),
            'postsCount' => $categoryRepository->countPosts($category),
            'participantsCount' => $categoryRepository->countParticipants($category),
            'lastContributionAt' => $categoryRepository->getLastContributionAt($category)?->format(DATE_ATOM),
        ];
    }

    private function decodePayload(Request $request): array|JsonResponse
    {
        try {
            $payload = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return $this->json(['message' => 'Le corps doit contenir un JSON valide.'], Response::HTTP_BAD_REQUEST);
        }

        if (!is_object($payload)) {
            return $this->json(['message' => 'Le corps JSON doit être un objet.'], Response::HTTP_BAD_REQUEST);
        }

        return get_object_vars($payload);
    }

    private function readName(array $payload): string|JsonResponse
    {
        if (!isset($payload['name']) || !is_string($payload['name'])) {
            return $this->json(['message' => 'Le champ name est requis et doit être une chaîne.'], Response::HTTP_BAD_REQUEST);
        }

        $name = trim($payload['name']);
        if ($name === '' || (new UnicodeString($name))->length() > 150) {
            return $this->json(['message' => 'Le nom doit contenir entre 1 et 150 caractères.'], Response::HTTP_BAD_REQUEST);
        }

        return $name;
    }

    private function validateFields(array $payload): ?JsonResponse
    {
        $unknownFields = array_diff(array_keys($payload), ['name', 'description', 'icon']);
        if ($unknownFields !== []) {
            return $this->json(
                ['message' => sprintf('Champ(s) non autorisé(s) : %s.', implode(', ', $unknownFields))],
                Response::HTTP_BAD_REQUEST
            );
        }

        return null;
    }

    private function createSlug(string $name, SluggerInterface $slugger): ?string
    {
        $slug = strtolower($slugger->slug($name)->toString());

        return $slug !== '' && (new UnicodeString($slug))->length() <= 180 ? $slug : null;
    }

    private function applyOptionalFields(Category $category, array $payload): ?JsonResponse
    {
        foreach (['description', 'icon'] as $field) {
            if (!array_key_exists($field, $payload)) {
                continue;
            }

            $value = $payload[$field];
            if ($value !== null && !is_string($value)) {
                return $this->json(['message' => sprintf('Le champ %s doit être une chaîne ou null.', $field)], Response::HTTP_BAD_REQUEST);
            }
            if ($field === 'icon' && $value !== null && (new UnicodeString($value))->length() > 255) {
                return $this->json(['message' => 'Le champ icon ne peut pas dépasser 255 caractères.'], Response::HTTP_BAD_REQUEST);
            }

            if ($field === 'description') {
                $category->setDescription($value);
            } else {
                $category->setIcon($value);
            }
        }

        return null;
    }

    private function categoryNameOrSlugExists(Category $category, CategoryRepository $categoryRepository): bool
    {
        $sameName = $categoryRepository->findOneBy(['name' => $category->getName()]);
        $sameSlug = $categoryRepository->findOneBy(['slug' => $category->getSlug()]);

        return ($sameName !== null && $sameName->getId() !== $category->getId())
            || ($sameSlug !== null && $sameSlug->getId() !== $category->getId());
    }
}