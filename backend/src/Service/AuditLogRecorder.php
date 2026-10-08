<?php

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

final class AuditLogRecorder
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function record(
        ?User $actor,
        string $action,
        Request $request,
        int $responseStatus,
    ): void {
        $requestPath = substr($request->getPathInfo(), 0, 512);
        $userAgent = $request->headers->get('User-Agent');

        $this->entityManager->persist(new AuditLog(
            $actor?->getId(),
            substr($action, 0, 120),
            $requestPath,
            substr($request->getMethod(), 0, 10),
            $responseStatus,
            $request->getClientIp(),
            $userAgent === null ? null : substr($userAgent, 0, 2000),
        ));
        $this->entityManager->flush();
    }
}
