<?php

namespace App\Service;

final class PasswordPolicy
{
    /**
     * @return list<string>
     */
    public function getViolations(string $password): array
    {
        $violations = [];

        if (strlen($password) < 12) {
            $violations[] = 'minimum 12 caractères';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $violations[] = 'au moins une majuscule';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $violations[] = 'au moins une minuscule';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $violations[] = 'au moins un chiffre';
        }

        if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};:\'",.<>?\\/\\\\|`~]/', $password)) {
            $violations[] = 'au moins un caractère spécial';
        }

        return $violations;
    }
}
