<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260409172910 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE moderation_log ADD topic_id INT DEFAULT NULL, ADD post_id INT DEFAULT NULL, DROP topic, DROP post, CHANGE action action VARCHAR(100) NOT NULL, CHANGE reason reason LONGTEXT DEFAULT NULL, CHANGE moderator moderator_id INT NOT NULL');
        $this->addSql('ALTER TABLE moderation_log ADD CONSTRAINT FK_7AE8684DD0AFA354 FOREIGN KEY (moderator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE moderation_log ADD CONSTRAINT FK_7AE8684D1F55203D FOREIGN KEY (topic_id) REFERENCES topics (id)');
        $this->addSql('ALTER TABLE moderation_log ADD CONSTRAINT FK_7AE8684D4B89032C FOREIGN KEY (post_id) REFERENCES posts (id)');
        $this->addSql('CREATE INDEX IDX_7AE8684DD0AFA354 ON moderation_log (moderator_id)');
        $this->addSql('CREATE INDEX IDX_7AE8684D1F55203D ON moderation_log (topic_id)');
        $this->addSql('CREATE INDEX IDX_7AE8684D4B89032C ON moderation_log (post_id)');
        $this->addSql('ALTER TABLE report ADD status VARCHAR(30) NOT NULL, ADD topic_id INT DEFAULT NULL, ADD post_id INT DEFAULT NULL, DROP topic, DROP post, CHANGE reporter reporter_id INT NOT NULL');
        $this->addSql('ALTER TABLE report ADD CONSTRAINT FK_C42F7784E1CFE6F5 FOREIGN KEY (reporter_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE report ADD CONSTRAINT FK_C42F77841F55203D FOREIGN KEY (topic_id) REFERENCES topics (id)');
        $this->addSql('ALTER TABLE report ADD CONSTRAINT FK_C42F77844B89032C FOREIGN KEY (post_id) REFERENCES posts (id)');
        $this->addSql('CREATE INDEX IDX_C42F7784E1CFE6F5 ON report (reporter_id)');
        $this->addSql('CREATE INDEX IDX_C42F77841F55203D ON report (topic_id)');
        $this->addSql('CREATE INDEX IDX_C42F77844B89032C ON report (post_id)');
        $this->addSql('ALTER TABLE topic_subscription ADD user_id INT NOT NULL, ADD topic_id INT NOT NULL, DROP user, DROP topic');
        $this->addSql('ALTER TABLE topic_subscription ADD CONSTRAINT FK_FDC3E347A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE topic_subscription ADD CONSTRAINT FK_FDC3E3471F55203D FOREIGN KEY (topic_id) REFERENCES topics (id)');
        $this->addSql('CREATE INDEX IDX_FDC3E347A76ED395 ON topic_subscription (user_id)');
        $this->addSql('CREATE INDEX IDX_FDC3E3471F55203D ON topic_subscription (topic_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_user_topic_subscription ON topic_subscription (user_id, topic_id)');
        $this->addSql('ALTER TABLE user CHANGE avatar avatar_url VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE moderation_log DROP FOREIGN KEY FK_7AE8684DD0AFA354');
        $this->addSql('ALTER TABLE moderation_log DROP FOREIGN KEY FK_7AE8684D1F55203D');
        $this->addSql('ALTER TABLE moderation_log DROP FOREIGN KEY FK_7AE8684D4B89032C');
        $this->addSql('DROP INDEX IDX_7AE8684DD0AFA354 ON moderation_log');
        $this->addSql('DROP INDEX IDX_7AE8684D1F55203D ON moderation_log');
        $this->addSql('DROP INDEX IDX_7AE8684D4B89032C ON moderation_log');
        $this->addSql('ALTER TABLE moderation_log ADD topic INT DEFAULT NULL, ADD post INT DEFAULT NULL, DROP topic_id, DROP post_id, CHANGE action action VARCHAR(255) NOT NULL, CHANGE reason reason VARCHAR(255) NOT NULL, CHANGE moderator_id moderator INT NOT NULL');
        $this->addSql('ALTER TABLE report DROP FOREIGN KEY FK_C42F7784E1CFE6F5');
        $this->addSql('ALTER TABLE report DROP FOREIGN KEY FK_C42F77841F55203D');
        $this->addSql('ALTER TABLE report DROP FOREIGN KEY FK_C42F77844B89032C');
        $this->addSql('DROP INDEX IDX_C42F7784E1CFE6F5 ON report');
        $this->addSql('DROP INDEX IDX_C42F77841F55203D ON report');
        $this->addSql('DROP INDEX IDX_C42F77844B89032C ON report');
        $this->addSql('ALTER TABLE report ADD topic INT DEFAULT NULL, ADD post INT DEFAULT NULL, DROP status, DROP topic_id, DROP post_id, CHANGE reporter_id reporter INT NOT NULL');
        $this->addSql('ALTER TABLE topic_subscription DROP FOREIGN KEY FK_FDC3E347A76ED395');
        $this->addSql('ALTER TABLE topic_subscription DROP FOREIGN KEY FK_FDC3E3471F55203D');
        $this->addSql('DROP INDEX IDX_FDC3E347A76ED395 ON topic_subscription');
        $this->addSql('DROP INDEX IDX_FDC3E3471F55203D ON topic_subscription');
        $this->addSql('DROP INDEX uniq_user_topic_subscription ON topic_subscription');
        $this->addSql('ALTER TABLE topic_subscription ADD user INT NOT NULL, ADD topic INT NOT NULL, DROP user_id, DROP topic_id');
        $this->addSql('ALTER TABLE user CHANGE avatar_url avatar VARCHAR(255) DEFAULT NULL');
    }
}
