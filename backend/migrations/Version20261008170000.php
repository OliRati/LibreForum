<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261008170000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create application audit log for authentication and successful user actions';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE audit_log (id INT AUTO_INCREMENT NOT NULL, actor_user_id INT DEFAULT NULL, action VARCHAR(120) NOT NULL, request_path VARCHAR(512) NOT NULL, request_method VARCHAR(10) NOT NULL, response_status INT NOT NULL, client_ip VARCHAR(45) DEFAULT NULL, user_agent LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_AUDIT_LOG_ACTOR_CREATED (actor_user_id, created_at), INDEX IDX_AUDIT_LOG_CREATED (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE audit_log');
    }
}
