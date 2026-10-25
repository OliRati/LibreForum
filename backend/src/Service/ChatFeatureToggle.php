<?php

namespace App\Service;

final class ChatFeatureToggle
{
    public function __construct(private bool $enabled)
    {
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }
}
