<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\TopicRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if (
            empty($payload['email']) ||
            empty($payload['username']) ||
            empty($payload['password'])
        ) {
            return $this->json([
                'error' => 'email, username et password sont requis'
            ], 400);
        }

        $existingEmail = $em->getRepository(User::class)->findOneBy(['email' => $payload['email']]);
        if ($existingEmail) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        $existingUsername = $em->getRepository(User::class)->findOneBy(['username' => $payload['username']]);
        if ($existingUsername) {
            return $this->json(['error' => 'Nom d’utilisateur déjà utilisé'], 409);
        }
        // Validation du mot de passe
        $password = $payload['password'];
        $passwordErrors = [];

        if (strlen($password) < 12) {
            $passwordErrors[] = 'minimum 12 caractères';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $passwordErrors[] = 'au moins une majuscule';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $passwordErrors[] = 'au moins une minuscule';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $passwordErrors[] = 'au moins un chiffre';
        }

        if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};:\'",.<>?\\/\\\\|`~]/', $password)) {
            $passwordErrors[] = 'au moins un caractère spécial';
        }

        if (!empty($passwordErrors)) {
            return $this->json([
                'error' => 'Le mot de passe ne respecte pas les critères: ' . implode(', ', $passwordErrors)
            ], 400);
        }
        
        $user = new User();
        $user
            ->setEmail($payload['email'])
            ->setUsername($payload['username'])
            ->setDisplayName($payload['displayName'] ?? $payload['username'])
            ->setBio($payload['bio'] ?? null)
            ->setForumRank('Membre')
            ->setRoles(['ROLE_USER']);

        $hashedPassword = $passwordHasher->hashPassword($user, $payload['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Compte créé avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'displayName' => $user->getDisplayName(),
                'roles' => $user->getRoles(),
            ]
        ], 201);
    }

    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(PostRepository $postRepository, TopicRepository $topicRepository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'displayName' => $user->getDisplayName(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatarUrl(),
            'forumRank' => $user->getForumRank(),
            'lastSeenAt' => $user->getLastSeenAt()?->format('c'),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format('c'),
            'postsCount' => $postRepository->countByAuthor($user),
            'topicsCreatedCount' => $topicRepository->countByAuthor($user),
            'topicsParticipatedCount' => $postRepository->countDistinctTopicsByAuthor($user),
        ]);
    }
}