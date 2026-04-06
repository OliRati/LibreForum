<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users')]
final class UserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn(User $user) => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'displayName' => $user->getDisplayName(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatar(),
            'forumRank' => $user->getForumRank(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format('c'),
        ], $users));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'displayName' => $user->getDisplayName(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatar(),
            'forumRank' => $user->getForumRank(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format('c'),
        ]);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(User $user, Request $request, EntityManagerInterface $em): JsonResponse
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

        if (array_key_exists('displayName', $payload)) {
            $user->setDisplayName($payload['displayName']);
        }

        if (array_key_exists('bio', $payload)) {
            $user->setBio($payload['bio']);
        }

        if (array_key_exists('avatar', $payload)) {
            $user->setAvatar($payload['avatar']);
        }

        if (array_key_exists('forumRank', $payload)) {
            $user->setForumRank($payload['forumRank']);
        }

        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour']);
    }
}