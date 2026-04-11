<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class LlmService
{
    public function __construct(
        private HttpClientInterface $client
    ) {
    }

    private string $baseUrl = 'http://llm:8000';

    public function summarize(string $text): string
    {
        $response = $this->client->request('POST', $this->baseUrl . '/summarize', [
            'json' => ['text' => $text]
        ]);

        return $response->toArray()['summary'] ?? '';
    }

    public function moderate(string $text): array
    {
        $response = $this->client->request('POST', $this->baseUrl . '/moderate', [
            'json' => ['text' => $text]
        ]);

        return $response->toArray();
    }

    public function suggestTags(string $text): array
    {
        $response = $this->client->request('POST', $this->baseUrl . '/suggest-tags', [
            'json' => ['text' => $text]
        ]);

        return $response->toArray()['tags'] ?? [];
    }

    public function assist(string $text, string $action): string
    {
        $response = $this->client->request('POST', $this->baseUrl . '/assist', [
            'json' => [
                'text' => $text,
                'action' => $action
            ]
        ]);

        return $response->toArray()['result'] ?? '';
    }
}