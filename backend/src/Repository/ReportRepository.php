<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\Report;
use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Report>
 */
class ReportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Report::class);
    }

    public function existsForReporterAndTopic(User $reporter, Topic $topic): bool
    {
        return $this->createQueryBuilder('report')
            ->select('report.id')
            ->andWhere('report.reporter = :reporter')
            ->andWhere('report.topic = :topic')
            ->setParameter('reporter', $reporter)
            ->setParameter('topic', $topic)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult() !== null;
    }

    public function existsForReporterAndPost(User $reporter, Post $post): bool
    {
        return $this->createQueryBuilder('report')
            ->select('report.id')
            ->andWhere('report.reporter = :reporter')
            ->andWhere('report.post = :post')
            ->setParameter('reporter', $reporter)
            ->setParameter('post', $post)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult() !== null;
    }
}
