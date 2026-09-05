<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260905090000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add an owner to chat rooms';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE chat_rooms ADD owner_id INT DEFAULT NULL');
        $this->addSql('CREATE INDEX IDX_7DDCF70D7E3C61F9 ON chat_rooms (owner_id)');
        $this->addSql('ALTER TABLE chat_rooms ADD CONSTRAINT FK_7DDCF70D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE chat_rooms DROP FOREIGN KEY FK_7DDCF70D7E3C61F9');
        $this->addSql('DROP INDEX IDX_7DDCF70D7E3C61F9 ON chat_rooms');
        $this->addSql('ALTER TABLE chat_rooms DROP owner_id');
    }
}