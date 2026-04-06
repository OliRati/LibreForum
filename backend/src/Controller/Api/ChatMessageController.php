<?php

namespace App\Controller\Api;

use App\Entity\ChatMessage;
use App\Entity\ChatRoom;
use App\Entity\User;
use App\Repository\ChatMessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/chat/messages')]
final class ChatMessageController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(ChatMessageRepository $chatMessageRepository): JsonResponse
    {
        $messages = $chatMessageRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn(ChatMessage $message) => [
            'id' => $message->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format('c'),
            'author' => [
                'id' => $message->getAuthor()?->getId(),
                'username' => $message->getAuthor()?->getUsername(),
                'displayName' => $message->getAuthor()?->getDisplayName(),
            ],
            'chatRoom' => [
                'id' => $message->getChatRoom()?->getId(),
                'name' => $message->getChatRoom()?->getName(),
                'slug' => $message->getChatRoom()?->getSlug(),
            ],
            'parentMessageId' => $message->getParentMessage()?->getId(),
        ], $messages));
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(ChatMessage $message): JsonResponse
    {
        return $this->json([
            'id' => $message->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format('c'),
            'author' => [
                'id' => $message->getAuthor()?->getId(),
                'username' => $message->getAuthor()?->getUsername(),
                'displayName' => $message->getAuthor()?->getDisplayName(),
            ],
            'chatRoom' => [
                'id' => $message->getChatRoom()?->getId(),
                'name' => $message->getChatRoom()?->getName(),
                'slug' => $message->getChatRoom()?->getSlug(),
            ],
            'parentMessageId' => $message->getParentMessage()?->getId(),
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $payload = json_decode($request->getContent(), true);

        if (empty($payload['content']) || empty($payload['chatRoomId'])) {
            return $this->json(['error' => 'content et chatRoomId sont requis'], 400);
        }

        $chatRoom = $em->getRepository(ChatRoom::class)->find($payload['chatRoomId']);

        if (!$chatRoom) {
            return $this->json(['error' => 'Salon introuvable'], 404);
        }

        $message = new ChatMessage();
        $message
            ->setContent($payload['content'])
            ->setAuthor($user)
            ->setChatRoom($chatRoom);

        if (!empty($payload['parentMessageId'])) {
            $parent = $em->getRepository(ChatMessage::class)->find($payload['parentMessageId']);
            if ($parent) {
                $message->setParentMessage($parent);
            }
        }

        $em->persist($message);
        $em->flush();

        return $this->json(['message' => 'Message créé', 'id' => $message->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(ChatMessage $message, Request $request, EntityManagerInterface $em): JsonResponse
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

        if (array_key_exists('content', $payload)) {
            $message->setContent($payload['content']);
        }

        $em->flush();

        return $this->json(['message' => 'Message mis à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(ChatMessage $message, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($message);
        $em->flush();

        return $this->json(['message' => 'Message supprimé']);
    }
}