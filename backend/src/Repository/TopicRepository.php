<?php

namespace App\Repository;

use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TopicRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Topic::class);
    }

    public function countByAuthor(User $author): int
    {
        return (int) $this->createQueryBuilder('t')
            ->select('COUNT(t.id)')
            ->andWhere('t.author = :author')
            ->setParameter('author', $author)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findPaginatedFiltered(
        int $page = 1,
        int $limit = 10,
        ?int $categoryId = null,
        ?string $search = null,
        ?int $tagId = null
    ): array {
        $page = max(1, $page);
        $limit = max(1, min(50, $limit));
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('t')
            ->leftJoin('t.author', 'a')->addSelect('a')
            ->leftJoin('t.category', 'c')->addSelect('c')
            ->leftJoin('t.tags', 'tag')->addSelect('tag');

        if ($categoryId) {
            $qb->andWhere('c.id = :categoryId')
               ->setParameter('categoryId', $categoryId);
        }

        if ($tagId) {
            $qb->andWhere('tag.id = :tagId')
               ->setParameter('tagId', $tagId);
        }

        if ($search) {
            $qb->andWhere('LOWER(t.title) LIKE :search OR LOWER(t.content) LIKE :search')
               ->setParameter('search', '%' . mb_strtolower($search) . '%');
        }

        $countQb = clone $qb;
        $total = (int) $countQb
            ->select('COUNT(DISTINCT t.id)')
            ->resetDQLPart('orderBy')
            ->getQuery()
            ->getSingleScalarResult();

        $items = $qb
            ->groupBy('t.id, a.id, c.id, tag.id')
            ->orderBy('t.isPinned', 'DESC')
            ->addOrderBy('t.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return [
            'items' => $items,
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => max(1, (int) ceil($total / $limit)),
        ];
    }
}