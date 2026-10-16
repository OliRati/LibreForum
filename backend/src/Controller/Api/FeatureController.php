<?php

namespace App\Controller\Api;

use App\Service\AiFeatureToggle;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/features')]
final class FeatureController extends AbstractController
{
    #[Route('', name: 'api_features_index', methods: ['GET'])]
    public function index(AiFeatureToggle $aiFeatureToggle): JsonResponse
    {
        return $this->json([
            'aiEnabled' => $aiFeatureToggle->isEnabled(),
        ]);
    }
}
