<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\ChatMessage;
use App\Entity\ChatRoom;
use App\Entity\Post;
use App\Entity\Tag;
use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        $slugger = new AsciiSlugger();

        // -------------------------
        // USERS
        // -------------------------
        $admin = (new User())
            ->setEmail('admin@libreforum.local')
            ->setUsername('admin')
            ->setDisplayName('Admin LibreForum')
            ->setRoles(['ROLE_ADMIN'])
            ->setForumRank('Administrateur')
            ->setBio('Administrateur principal de LibreForum.')
            ->setAvatar('/uploads/avatars/admin.png')
            ->setPassword($this->passwordHasher->hashPassword(new User(), 'password'));

        $alice = (new User())
            ->setEmail('alice@libreforum.local')
            ->setUsername('alice')
            ->setDisplayName('Alice')
            ->setForumRank('Contributrice')
            ->setBio('Passionnée de Linux, Docker et PHP.')
            ->setAvatar('/uploads/avatars/alice.png')
            ->setPassword($this->passwordHasher->hashPassword(new User(), 'password'));

        $bob = (new User())
            ->setEmail('bob@libreforum.local')
            ->setUsername('bob')
            ->setDisplayName('Bob')
            ->setForumRank('Membre')
            ->setBio('Bidouilleur open source et amateur de self-hosting.')
            ->setAvatar('/uploads/avatars/bob.png')
            ->setPassword($this->passwordHasher->hashPassword(new User(), 'password'));

        $charlie = (new User())
            ->setEmail('charlie@libreforum.local')
            ->setUsername('charlie')
            ->setDisplayName('Charlie')
            ->setForumRank('Modérateur')
            ->setRoles(['ROLE_MODERATOR'])
            ->setBio('Modération, UX et bonnes pratiques communautaires.')
            ->setAvatar('/uploads/avatars/charlie.png')
            ->setPassword($this->passwordHasher->hashPassword(new User(), 'password'));

        foreach ([$admin, $alice, $bob, $charlie] as $user) {
            $manager->persist($user);
        }

        // -------------------------
        // CATEGORIES
        // -------------------------
        $categoriesData = [
            [
                'name' => 'Linux',
                'description' => 'Discussions autour des distributions, du noyau et de l’écosystème Linux.',
                'icon' => 'linux',
            ],
            [
                'name' => 'Développement Web',
                'description' => 'Symfony, React, PHP, JavaScript, APIs et bonnes pratiques web.',
                'icon' => 'code',
            ],
            [
                'name' => 'Docker & DevOps',
                'description' => 'Conteneurs, CI/CD, orchestration, déploiement et automatisation.',
                'icon' => 'container',
            ],
            [
                'name' => 'Logiciels Libres',
                'description' => 'Découverte, entraide et recommandations autour du logiciel libre.',
                'icon' => 'opensource',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $category = (new Category())
                ->setName($data['name'])
                ->setSlug(strtolower((string) $slugger->slug($data['name'])))
                ->setDescription($data['description'])
                ->setIcon($data['icon']);

            $manager->persist($category);
            $categories[] = $category;
        }

        // -------------------------
        // TAGS
        // -------------------------
        $tagNames = [
            'symfony',
            'react',
            'docker',
            'linux',
            'mysql',
            'open-source',
            'vite',
            'php',
            'devops',
        ];

        $tags = [];
        foreach ($tagNames as $tagName) {
            $tag = (new Tag())
                ->setName($tagName)
                ->setSlug(strtolower((string) $slugger->slug($tagName)));

            $manager->persist($tag);
            $tags[$tagName] = $tag;
        }

        // -------------------------
        // TOPICS
        // -------------------------
        $topic1 = (new Topic())
            ->setTitle('Quel est votre environnement Linux favori pour développer ?')
            ->setSlug('quel-est-votre-environnement-linux-favori-pour-developper')
            ->setContent("Je cherche à améliorer mon poste de développement. Vous utilisez quoi au quotidien : Arch, Debian, Fedora, autre ?")
            ->setAuthor($alice)
            ->setCategory($categories[0])
            ->setViews(124)
            ->addTag($tags['linux'])
            ->addTag($tags['open-source']);

        $topic2 = (new Topic())
            ->setTitle('Symfony + React : meilleure approche pour un forum moderne ?')
            ->setSlug('symfony-react-meilleure-approche-pour-un-forum-moderne')
            ->setContent("Je travaille sur LibreForum et j’hésite entre une SPA complète ou une intégration React progressive dans Symfony.")
            ->setAuthor($admin)
            ->setCategory($categories[1])
            ->setViews(278)
            ->setIsPinned(true)
            ->addTag($tags['symfony'])
            ->addTag($tags['react'])
            ->addTag($tags['vite'])
            ->addTag($tags['php']);

        $topic3 = (new Topic())
            ->setTitle('Votre stack Docker idéale pour un projet PHP moderne ?')
            ->setSlug('votre-stack-docker-ideale-pour-un-projet-php-moderne')
            ->setContent("Je cherche une stack Docker propre avec Nginx, PHP-FPM, MySQL, Mailhog et éventuellement un service Python.")
            ->setAuthor($bob)
            ->setCategory($categories[2])
            ->setViews(199)
            ->addTag($tags['docker'])
            ->addTag($tags['devops'])
            ->addTag($tags['php']);

        $topic4 = (new Topic())
            ->setTitle('Quels logiciels libres recommandez-vous en 2026 ?')
            ->setSlug('quels-logiciels-libres-recommandez-vous-en-2026')
            ->setContent("Je veux faire découvrir de bons outils open source à ma communauté : desktop, dev, sysadmin, création…")
            ->setAuthor($charlie)
            ->setCategory($categories[3])
            ->setViews(87)
            ->addTag($tags['open-source'])
            ->addTag($tags['linux']);

        foreach ([$topic1, $topic2, $topic3, $topic4] as $topic) {
            $manager->persist($topic);
        }

        // -------------------------
        // POSTS
        // -------------------------
        $posts = [
            [$topic1, $bob, "Perso je reste sur Debian stable pour bosser. Pas le plus sexy, mais très fiable."],
            [$topic1, $charlie, "Fedora Workstation est très agréable pour le dev moderne, surtout avec Podman / Docker."],
            [$topic1, $admin, "J’aime bien Arch pour la flexibilité, mais pour un projet long terme je conseillerais plutôt Fedora ou Debian."],

            [$topic2, $alice, "Pour un forum, je ferais Symfony comme cœur applicatif, puis React pour les zones dynamiques."],
            [$topic2, $bob, "Une SPA complète est tentante, mais ça complexifie beaucoup l’auth et l’infra au début."],
            [$topic2, $charlie, "Le meilleur compromis est souvent : Twig + point de montage React + API interne Symfony."],

            [$topic3, $admin, "Nginx + PHP-FPM + MySQL + Mailhog, c’est déjà une excellente base pour démarrer proprement."],
            [$topic3, $alice, "J’ajouterais un service Python séparé si tu veux brancher un LLM local ou du traitement asynchrone."],

            [$topic4, $bob, "J’utilise Obsidian, GIMP, LibreOffice, Inkscape et Jellyfin. Très bonne base !"],
            [$topic4, $admin, "Pour les devs : VS Codium, DBeaver, Docker, Postman, et bien sûr Symfony CLI."],
        ];

        foreach ($posts as [$topic, $author, $content]) {
            $post = (new Post())
                ->setTopic($topic)
                ->setAuthor($author)
                ->setContent($content);

            $manager->persist($post);
        }

        // -------------------------
        // CHAT ROOMS
        // -------------------------
        $generalRoom = (new ChatRoom())
            ->setName('Général')
            ->setSlug('general')
            ->setDescription('Discussions libres autour de LibreForum et du logiciel libre.');

        $devRoom = (new ChatRoom())
            ->setName('Développement')
            ->setSlug('developpement')
            ->setDescription('Architecture, code, frameworks et entraide technique.');

        $manager->persist($generalRoom);
        $manager->persist($devRoom);

        // -------------------------
        // CHAT MESSAGES
        // -------------------------
        $msg1 = (new ChatMessage())
            ->setAuthor($alice)
            ->setChatRoom($generalRoom)
            ->setContent('Salut tout le monde 👋');

        $msg2 = (new ChatMessage())
            ->setAuthor($bob)
            ->setChatRoom($generalRoom)
            ->setContent('Hello ! Hâte de voir LibreForum en ligne.');

        $msg3 = (new ChatMessage())
            ->setAuthor($admin)
            ->setChatRoom($devRoom)
            ->setContent('Je finalise la stack Symfony + React aujourd’hui.');

        $msg4 = (new ChatMessage())
            ->setAuthor($charlie)
            ->setChatRoom($devRoom)
            ->setContent('Top, on pourra ensuite brancher la modération et les rôles.');

        foreach ([$msg1, $msg2, $msg3, $msg4] as $msg) {
            $manager->persist($msg);
        }

        $manager->flush();
    }
}