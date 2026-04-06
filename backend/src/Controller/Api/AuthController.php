<?php

namespace App\Controller\Api;

use App\Entity\User;
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
    public function me(): JsonResponse
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
            'avatar' => $user->getAvatar(),
            'forumRank' => $user->getForumRank(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format('c'),
        ]);
    }
}