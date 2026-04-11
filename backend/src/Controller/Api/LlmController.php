<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Repository\TopicRepository;
use App\Service\LlmService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/llm')]
class LlmController extends AbstractController
{
    #[Route('/topics/{id}/summary', methods: ['POST'])]
    public function summarizeTopic(
        Topic $topic,
        LlmService $llm
    ): JsonResponse {
        $content = $topic->getTitle() . "\n\n";

        foreach ($topic->getPosts() as $post) {
            $content .= $post->getContent() . "\n\n";
        }

        $summary = $llm->summarize($content);

        $topic->setSummary($summary);

        $this->getDoctrine()->getManager()->flush();

        return $this->json([
            'summary' => $summary
        ]);
    }

    #[Route('/posts/{id}/moderate', methods: ['POST'])]
    public function moderatePost(
        Post $post,
        LlmService $llm
    ): JsonResponse {
        $analysis = $llm->moderate($post->getContent());

        return $this->json($analysis);
    }

    #[Route('/topics/suggest-tags', methods: ['POST'])]
    public function suggestTags(
        Request $request,
        LlmService $llm
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $text = $data['text'] ?? '';

        if (!$text) {
            return $this->json(['tags' => []]);
        }

        $tags = $llm->suggestTags($text);

        return $this->json([
            'tags' => $tags
        ]);
    }

    #[Route('/assist', methods: ['POST'])]
    public function assist(
        Request $request,
        LlmService $llm
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $text = $data['text'] ?? '';
        $action = $data['action'] ?? 'improve';

        if (!$text) {
            return $this->json(['result' => '']);
        }

        $result = $llm->assist($text, $action);

        return $this->json([
            'result' => $result
        ]);
    }
}