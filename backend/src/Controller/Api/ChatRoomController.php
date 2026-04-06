<?php

namespace App\Controller\Api;

use App\Entity\ChatRoom;
use App\Repository\ChatRoomRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/api/chat/rooms')]
final class ChatRoomController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(ChatRoomRepository $chatRoomRepository): JsonResponse
    {
        $rooms = $chatRoomRepository->findAll();

        return $this->json(array_map(fn(ChatRoom $room) => [
            'id' => $room->getId(),
            'name' => $room->getName(),
            'slug' => $room->getSlug(),
            'description' => $room->getDescription(),
            'createdAt' => $room->getCreatedAt()->format('c'),
        ], $rooms));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(ChatRoom $room): JsonResponse
    {
        return $this->json([
            'id' => $room->getId(),
            'name' => $room->getName(),
            'slug' => $room->getSlug(),
            'description' => $room->getDescription(),
            'createdAt' => $room->getCreatedAt()->format('c'),
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

        $room = new ChatRoom();
        $room
            ->setName($payload['name'])
            ->setSlug(strtolower((string) $slugger->slug($payload['name'])))
            ->setDescription($payload['description'] ?? null);

        $em->persist($room);
        $em->flush();

        return $this->json(['message' => 'Salon créé', 'id' => $room->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(ChatRoom $room, Request $request, EntityManagerInterface $em): JsonResponse
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
            $room->setName($payload['name']);
            $room->setSlug(strtolower((string) $slugger->slug($payload['name'])));
        }

        if (array_key_exists('description', $payload)) {
            $room->setDescription($payload['description']);
        }

        $em->flush();

        return $this->json(['message' => 'Salon mis à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(ChatRoom $room, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($room);
        $em->flush();

        return $this->json(['message' => 'Salon supprimé']);
    }
}