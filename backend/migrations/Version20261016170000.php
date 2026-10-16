<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261016170000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Prevent a user from reporting the same topic or post more than once';
    }

    public function up(Schema $schema): void
    {
        $duplicateTopicReport = $this->connection->fetchOne(
            'SELECT 1 FROM report WHERE topic_id IS NOT NULL GROUP BY reporter_id, topic_id HAVING COUNT(*) > 1 LIMIT 1'
        );
        $this->abortIf(
            $duplicateTopicReport !== false,
            'Duplicate reports for the same user and topic exist. Resolve these records before applying this migration.'
        );

        $duplicatePostReport = $this->connection->fetchOne(
            'SELECT 1 FROM report WHERE post_id IS NOT NULL GROUP BY reporter_id, post_id HAVING COUNT(*) > 1 LIMIT 1'
        );
        $this->abortIf(
            $duplicatePostReport !== false,
            'Duplicate reports for the same user and post exist. Resolve these records before applying this migration.'
        );

        $this->addSql('CREATE UNIQUE INDEX UNIQ_REPORTER_TOPIC ON report (reporter_id, topic_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_REPORTER_POST ON report (reporter_id, post_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_REPORTER_TOPIC ON report');
        $this->addSql('DROP INDEX UNIQ_REPORTER_POST ON report');
    }
}
