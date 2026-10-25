<?php

namespace App\Controller\Api;

use App\Service\AiFeatureToggle;
use App\Service\ChatFeatureToggle;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/features')]
final class FeatureController extends AbstractController
{
    #[Route('', name: 'api_features_index', methods: ['GET'])]
    public function index(AiFeatureToggle $aiFeatureToggle, ChatFeatureToggle $chatFeatureToggle): JsonResponse
    {
        return $this->json([
            'aiEnabled' => $aiFeatureToggle->isEnabled(),
            'chatEnabled' => $chatFeatureToggle->isEnabled(),
        ]);
    }
}
