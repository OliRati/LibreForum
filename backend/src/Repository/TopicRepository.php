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

    public function getLastPostDate(Topic $topic): ?\DateTimeImmutable
    {
        $result = $this->getEntityManager()->createQueryBuilder()
            ->select('MAX(p.createdAt)')
            ->from('App\Entity\Post', 'p')
            ->where('p.topic = :topic')
            ->setParameter('topic', $topic)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? new \DateTimeImmutable($result) : null;
    }

    public function countParticipants(Topic $topic): int
    {
        return (int) $this->getEntityManager()->createQueryBuilder()
            ->select('COUNT(DISTINCT p.author)')
            ->from('App\Entity\Post', 'p')
            ->where('p.topic = :topic')
            ->setParameter('topic', $topic)
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

        // --- Requête de base (sans les jointures one-to-many) ---
        $qb = $this->createQueryBuilder('t')
            ->leftJoin('t.author', 'a')->addSelect('a')
            ->leftJoin('t.category', 'c')->addSelect('c');

        // Le filtre sur tags nécessite la jointure, mais PAS addSelect
        if ($tagId) {
            $qb->leftJoin('t.tags', 'tag')
                ->andWhere('tag.id = :tagId')
                ->setParameter('tagId', $tagId);
        }

        if ($categoryId) {
            $qb->andWhere('c.id = :categoryId')
                ->setParameter('categoryId', $categoryId);
        }

        if ($search) {
            $qb->andWhere('LOWER(t.title) LIKE :search OR LOWER(t.content) LIKE :search')
                ->setParameter('search', '%' . mb_strtolower($search) . '%');
        }

        // --- COUNT sur les IDs distincts ---
        $countQb = clone $qb;
        $total = (int) $countQb
            ->select('COUNT(DISTINCT t.id)')
            ->resetDQLPart('orderBy')
            ->getQuery()
            ->getSingleScalarResult();

        // --- Récupération des IDs paginés via SQL natif ---
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT DISTINCT t.id, t.is_pinned, t.created_at FROM topics t';
        $params = [];
        $types = [];

        if ($tagId) {
            $sql .= ' INNER JOIN topic_tags tt ON tt.topic_id = t.id';
        }
        if ($categoryId) {
            $sql .= ' INNER JOIN categories c ON c.id = t.category_id';
        }

        $conditions = [];

        if ($tagId) {
            $conditions[] = 'tt.tag_id = :tagId';
            $params['tagId'] = $tagId;
            $types['tagId'] = \Doctrine\DBAL\ParameterType::INTEGER;
        }
        if ($categoryId) {
            $conditions[] = 'c.id = :categoryId';
            $params['categoryId'] = $categoryId;
            $types['categoryId'] = \Doctrine\DBAL\ParameterType::INTEGER;
        }
        if ($search) {
            $conditions[] = '(LOWER(t.title) LIKE :search OR LOWER(t.content) LIKE :search)';
            $params['search'] = '%' . mb_strtolower($search) . '%';
            $types['search'] = \Doctrine\DBAL\ParameterType::STRING;
        }

        if ($conditions) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $sql .= ' ORDER BY t.is_pinned DESC, t.created_at DESC';
        $sql .= ' LIMIT :limit OFFSET :offset';
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $types['limit'] = \Doctrine\DBAL\ParameterType::INTEGER;
        $types['offset'] = \Doctrine\DBAL\ParameterType::INTEGER;

        $ids = array_column(
            $conn->executeQuery($sql, $params, $types)->fetchAllAssociative(),
            'id'
        );

        if (empty($ids)) {
            return [
                'items' => [],
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => max(1, (int) ceil($total / $limit)),
            ];
        }

        // --- Hydratation Doctrine sur les IDs exacts ---
        $items = $this->createQueryBuilder('t')
            ->leftJoin('t.author', 'a')->addSelect('a')
            ->leftJoin('t.category', 'c')->addSelect('c')
            ->leftJoin('t.tags', 'tag')->addSelect('tag')
            ->where('t.id IN (:ids)')
            ->setParameter('ids', $ids)
            ->orderBy('t.isPinned', 'DESC')
            ->addOrderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        // --- Requête finale sur les IDs connus — jointure complète sans limite ---
        $items = $this->createQueryBuilder('t')
            ->leftJoin('t.author', 'a')->addSelect('a')
            ->leftJoin('t.category', 'c')->addSelect('c')
            ->leftJoin('t.tags', 'tag')->addSelect('tag')
            ->where('t.id IN (:ids)')
            ->setParameter('ids', $ids)
            ->orderBy('t.isPinned', 'DESC')
            ->addOrderBy('t.createdAt', 'DESC')
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