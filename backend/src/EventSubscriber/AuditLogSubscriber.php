<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\AuditLogRecorder;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

final class AuditLogSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private AuditLogRecorder $auditLogRecorder,
        private Security $security,
        private UserRepository $userRepository,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            LoginSuccessEvent::class => 'onLoginSuccess',
            LoginFailureEvent::class => 'onLoginFailure',
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();
        $responseStatus = $event->getResponse()?->getStatusCode() ?? 200;

        $this->auditLogRecorder->record(
            $user instanceof User ? $user : null,
            'auth.login.success',
            $event->getRequest(),
            $responseStatus,
        );
    }

    public function onLoginFailure(LoginFailureEvent $event): void
    {
        $request = $event->getRequest();
        $payload = $request->getPayload();
        $email = $payload->get('email');
        $user = is_string($email) && $email !== ''
            ? $this->userRepository->findOneBy(['email' => $email])
            : null;

        $this->auditLogRecorder->record(
            $user,
            'auth.login.failure',
            $request,
            $event->getResponse()?->getStatusCode() ?? 401,
        );
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $method = $request->getMethod();
        $path = $request->getPathInfo();

        if ($event->getResponse()->getStatusCode() < 200 || $event->getResponse()->getStatusCode() >= 300) {
            return;
        }

        if (!$this->isAuditedWrite($method, $path)) {
            return;
        }

        $actor = $this->security->getUser();
        if (!$actor instanceof User && $path === '/api/register' && $event->getResponse() instanceof \Symfony\Component\HttpFoundation\JsonResponse) {
            $responseData = $event->getResponse()->getData(true);
            $registeredUserId = is_array($responseData) ? ($responseData['user']['id'] ?? null) : null;
            $actor = is_int($registeredUserId) ? $this->userRepository->find($registeredUserId) : null;
        }

        $route = $request->attributes->get('_route');
        $action = is_string($route) && $route !== ''
            ? $route
            : sprintf('%s %s', $method, $path);

        $this->auditLogRecorder->record(
            $actor instanceof User ? $actor : null,
            $action,
            $request,
            $event->getResponse()->getStatusCode(),
        );
    }

    private function isAuditedWrite(string $method, string $path): bool
    {
        if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return false;
        }

        if (str_starts_with($path, '/api/llm/') || $path === '/api/login') {
            return false;
        }

        if ($path === '/api/register') {
            return $method === 'POST';
        }

        return preg_match(
            '#^/api/(?:users(?:/\d+)?|topics(?:/\d+(?:/posts)?)?|posts(?:/\d+)?|tags(?:/\d+)?|reports(?:/\d+)?|chat/rooms(?:/\d+)?|chat/messages(?:/\d+)?)$#',
            $path,
        ) === 1
            || preg_match('#^/api/(?:topics/\d+/(?:lock|pin|moderate)|posts/\d+/moderate)$#', $path) === 1;
    }
}
