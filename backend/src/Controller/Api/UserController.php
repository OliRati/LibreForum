<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\TopicRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
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
            'avatar' => $user->getAvatarUrl(),
            'forumRank' => $user->getForumRank(),
            'lastSeenAt' => $user->getLastSeenAt()?->format('c'),
            'createdAt' => $user->getCreatedAt()?->format('c'),
            'roles' => $user->getRoles(),
        ], $users));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(User $user, PostRepository $postRepository, TopicRepository $topicRepository): JsonResponse
    {
        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'displayName' => $user->getDisplayName(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatarUrl(),
            'forumRank' => $user->getForumRank(),
            'lastSeenAt' => $user->getLastSeenAt()?->format('c'),
            'createdAt' => $user->getCreatedAt()?->format('c'),
            'roles' => $user->getRoles(),
            'postsCount' => $postRepository->countByAuthor($user),
            'topicsCreatedCount' => $topicRepository->countByAuthor($user),
            'topicsParticipatedCount' => $postRepository->countDistinctTopicsByAuthor($user),
        ]);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(
        User $user,
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        PostRepository $postRepository,
        TopicRepository $topicRepository
    ): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $isOwner = $currentUser->getId() === $user->getId();
        $isModerator = in_array('ROLE_MODERATOR', $currentUser->getRoles(), true) || in_array('ROLE_ADMIN', $currentUser->getRoles(), true);

        if (!$isOwner && !$isModerator) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $payload = [];
        if ($request->files->count() > 0 || str_contains($request->headers->get('Content-Type', ''), 'multipart/form-data')) {
            $payload = $request->request->all();
        } else {
            $payload = json_decode($request->getContent(), true) ?? [];
        }

        if (!is_array($payload)) {
            $payload = [];
        }

        /** @var UploadedFile|null $avatarFile */
        $avatarFile = $request->files->get('avatarFile');
        if ($avatarFile) {
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!in_array($avatarFile->getMimeType(), $allowedMimeTypes, true)) {
                return $this->json(['error' => 'Format d\'image non valide'], 400);
            }

            if ($avatarFile->getSize() > 2 * 1024 * 1024) {
                return $this->json(['error' => 'Avatar trop volumineux (max 2 Mo)'], 400);
            }

            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/avatars';
            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0777, true);
            }

            $safeFilename = uniqid('avatar_', true);
            $extension = $avatarFile->guessExtension() ?: 'png';

            try {
                $avatarFile->move($uploadsDir, sprintf('%s.%s', $safeFilename, $extension));
            } catch (FileException $e) {
                return $this->json(['error' => 'Impossible de sauvegarder l\'avatar'], 500);
            }

            $user->setAvatarUrl('/uploads/avatars/' . $safeFilename . '.' . $extension);
        } elseif (array_key_exists('avatar', $payload)) {
            $user->setAvatarUrl($payload['avatar'] ?: null);
        }

        if (array_key_exists('displayName', $payload)) {
            $user->setDisplayName($payload['displayName'] ?: null);
        }

        if (array_key_exists('bio', $payload)) {
            $user->setBio($payload['bio'] ?: null);
        }

        if (!empty($payload['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $payload['password']);
            $user->setPassword($hashedPassword);
        }

        if ($isModerator && array_key_exists('forumRank', $payload)) {
            $user->setForumRank($payload['forumRank'] ?: null);
        }

        $em->flush();

        return $this->json([
            'message' => 'Utilisateur mis à jour',
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'displayName' => $user->getDisplayName(),
                'bio' => $user->getBio(),
                'avatar' => $user->getAvatarUrl(),
                'forumRank' => $user->getForumRank(),
                'lastSeenAt' => $user->getLastSeenAt()?->format('c'),
                'createdAt' => $user->getCreatedAt()?->format('c'),
                'roles' => $user->getRoles(),
                'postsCount' => $postRepository->countByAuthor($user),
                'topicsCreatedCount' => $topicRepository->countByAuthor($user),
                'topicsParticipatedCount' => $postRepository->countDistinctTopicsByAuthor($user),
            ],
        ]);
    }
}