<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260408212949 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE moderation_log (id INT AUTO_INCREMENT NOT NULL, action VARCHAR(255) NOT NULL, reason VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, moderator INT NOT NULL, topic INT DEFAULT NULL, post INT DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, message VARCHAR(255) NOT NULL, is_read TINYINT NOT NULL, created_at DATETIME NOT NULL, user INT NOT NULL, payload VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE report (id INT AUTO_INCREMENT NOT NULL, reason VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, reporter INT NOT NULL, topic INT DEFAULT NULL, post INT DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE topic_subscription (id INT AUTO_INCREMENT NOT NULL, user INT NOT NULL, topic INT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE posts ADD is_deleted TINYINT DEFAULT 0 NOT NULL, ADD moderation_status VARCHAR(30) DEFAULT NULL, ADD toxicity_score DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE topics ADD is_deleted TINYINT DEFAULT 0 NOT NULL, ADD summary LONGTEXT DEFAULT NULL, ADD moderation_status VARCHAR(30) DEFAULT NULL, ADD last_activity_at DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE moderation_log');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE report');
        $this->addSql('DROP TABLE topic_subscription');
        $this->addSql('ALTER TABLE posts DROP is_deleted, DROP moderation_status, DROP toxicity_score');
        $this->addSql('ALTER TABLE topics DROP is_deleted, DROP summary, DROP moderation_status, DROP last_activity_at');
    }
}
