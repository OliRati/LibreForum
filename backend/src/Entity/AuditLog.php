<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Index(name: 'IDX_AUDIT_LOG_ACTOR_CREATED', columns: ['actor_user_id', 'created_at'])]
#[ORM\Index(name: 'IDX_AUDIT_LOG_CREATED', columns: ['created_at'])]
class AuditLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $actorUserId = null;

    #[ORM\Column(length: 120)]
    private string $action;

    #[ORM\Column(length: 512)]
    private string $requestPath;

    #[ORM\Column(length: 10)]
    private string $requestMethod;

    #[ORM\Column]
    private int $responseStatus;

    #[ORM\Column(length: 45, nullable: true)]
    private ?string $clientIp = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $userAgent = null;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct(
        ?int $actorUserId,
        string $action,
        string $requestPath,
        string $requestMethod,
        int $responseStatus,
        ?string $clientIp,
        ?string $userAgent,
    ) {
        $this->actorUserId = $actorUserId;
        $this->action = $action;
        $this->requestPath = $requestPath;
        $this->requestMethod = $requestMethod;
        $this->responseStatus = $responseStatus;
        $this->clientIp = $clientIp;
        $this->userAgent = $userAgent;
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('UTC'));
    }
}
