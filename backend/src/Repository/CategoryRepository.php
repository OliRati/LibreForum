<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function countTopics(Category $category): int
    {
        return (int) $this->createQueryBuilder('c')
            ->select('COUNT(t.id)')
            ->join('c.topics', 't')
            ->andWhere('c = :category')
            ->setParameter('category', $category)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countPosts(Category $category): int
    {
        return (int) $this->createQueryBuilder('c')
            ->select('COUNT(p.id)')
            ->join('c.topics', 't')
            ->join('t.posts', 'p')
            ->andWhere('c = :category')
            ->setParameter('category', $category)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getLastContributionAt(Category $category): ?\DateTimeImmutable
    {
        $result = $this->createQueryBuilder('c')
            ->select('MAX(p.createdAt) as lastContribution')
            ->join('c.topics', 't')
            ->join('t.posts', 'p')
            ->andWhere('c = :category')
            ->setParameter('category', $category)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? new \DateTimeImmutable($result) : null;
    }

    public function countParticipants(Category $category): int
    {
        return (int) $this->createQueryBuilder('c')
            ->select('COUNT(DISTINCT p.author)')
            ->join('c.topics', 't')
            ->join('t.posts', 'p')
            ->andWhere('c = :category')
            ->setParameter('category', $category)
            ->getQuery()
            ->getSingleScalarResult();
    }
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Category
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
