<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Topic;
use App\Repository\TopicRepository;
use App\Service\LlmService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}