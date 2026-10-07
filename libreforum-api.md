# API REST de LibreForum

## 1. Présentation

Le backend expose une API JSON implémentée avec Symfony et Doctrine. Les routes applicatives utilisent le préfixe `/api`. En configuration Docker locale, l'application est publiée par Nginx sur `http://localhost:8080` ; la base de l'API est donc `http://localhost:8080/api`.

Les requêtes qui envoient un corps JSON doivent utiliser `Content-Type: application/json`. Les dates retournées sont généralement au format ISO 8601, avec fuseau (`DATE_ATOM`).

L'API ne déclare pas de version dans ses URL. Les identifiants de ressources sont des identifiants numériques. Sauf indication contraire, les réponses et erreurs sont au format JSON.

## 2. Authentification et autorisations

### Connexion et jeton

`POST /api/login` est traité par le firewall JSON Login de Symfony (et non par un contrôleur). Il attend les identifiants suivants :

```json
{
  "email": "membre@example.com",
  "password": "MotDePasse..."
}
```

En cas de succès, le bundle LexikJWTAuthenticationBundle retourne un jeton JWT. Les routes protégées attendent ce jeton dans l'en-tête :

```http
Authorization: Bearer <jeton>
```

La durée de vie configurée du JWT est d'une heure. Le firewall API est sans état : l'authentification est portée par le jeton et non par une session.

### Routes accessibles sans authentification

Les règles de sécurité rendent publiques :

- `POST /api/login` et `POST /api/register` ;
- `GET /api/topics`, `GET /api/topics/{id}` et `GET /api/topics/{id}/posts` ;
- les routes de catégories sous `/api/categories` ;
- les routes `GET` sous `/api/tags` ;
- `GET /api/posts` et `GET /api/posts/{id}` ;
- `GET /api/users/{id}`.

Attention : `GET /api/users` (la collection) n'est pas dans cette liste et nécessite un JWT.

### Autorisations des routes protégées

Toute route sous `/api` qui ne correspond pas à une règle publique explicite requiert une authentification complète. Certaines opérations appliquent en plus une autorisation au niveau du contrôleur :

- suppression d'un sujet ou d'un post : auteur de la ressource ou administrateur, via les voters ;
- mise à jour d'un profil : propriétaire du profil ou modérateur/administrateur ;
- gestion d'un salon : propriétaire du salon ou modérateur/administrateur ;
- modération des sujets, posts et signalements : rôle modérateur requis par les règles ou vérifications de sécurité ;
- consultation d'un signalement individuel : tout utilisateur authentifié (aucune vérification de propriété du signalement n'est faite dans ce contrôleur).

Les permissions ne sont donc pas toutes limitées au propriétaire de la ressource. Se référer aux limites actuelles plus bas avant d'exposer cette API à des clients non fiables.

## 3. Conventions de réponse

Les codes de statut utilisés incluent notamment :

| Code | Signification courante |
|---|---|
| `200` | Lecture ou modification réussie ; peut aussi signaler qu'un tag existant a été réutilisé. |
| `201` | Ressource créée. |
| `400` | Donnée requise absente ou requête invalide. |
| `401` | Utilisateur non authentifié. |
| `403` | Opération interdite (par exemple, sujet verrouillé ou autorisation refusée). |
| `404` | Ressource inexistante, introuvable ou masquée. |
| `409` | Adresse e-mail ou nom d'utilisateur déjà utilisé lors de l'inscription. |

Les corps d'erreur contiennent généralement un champ `message` ou `error`, selon le contrôleur.

## 4. Comptes et profils

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `POST /api/register` | Public | Crée un compte. Champs requis : `email`, `username`, `password`. Champs optionnels : `displayName`, `bio`. Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial. Retourne `201` et un objet utilisateur sans mot de passe. |
| `GET /api/me` | JWT | Retourne le profil de l'utilisateur authentifié, ses rôles, dates d'activité et compteurs de sujets/posts. |
| `GET /api/users` | JWT | Retourne la collection des profils, triée par date de création décroissante. La réponse inclut notamment les e-mails et rôles. |
| `GET /api/users/{id}` | Public | Retourne le profil public et les compteurs d'activité d'un utilisateur. |
| `PUT /api/users/{id}` ou `PATCH /api/users/{id}` | JWT, propriétaire ou modérateur/administrateur | Modifie `displayName`, `bio` et éventuellement `avatar`. Le champ `password` remplace le mot de passe après hachage. Un modérateur/administrateur peut aussi modifier `forumRank`. |

Pour mettre à jour un avatar par fichier, envoyer une requête `multipart/form-data` contenant `avatarFile`. Les formats acceptés sont JPEG, PNG, WebP et GIF, avec une taille maximale de 2 Mo. Le fichier est enregistré sous `public/uploads/avatars`.

## 5. Catégories et tags

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `GET /api/categories` | Public | Liste les catégories avec leurs compteurs de sujets, posts et participants, ainsi que la date de dernière contribution. |
| `GET /api/categories/{id}` | Public | Retourne une catégorie et les mêmes indicateurs. |
| `GET /api/tags` | Public | Liste les tags par ordre alphabétique. |
| `GET /api/tags/{id}` | Public | Retourne un tag. |
| `POST /api/tags` | JWT | Crée un tag à partir du champ requis `name`. Si le nom existe déjà, renvoie le tag existant avec `200`; sinon, renvoie le nouveau tag avec `201`. |

## 6. Sujets et réponses

### Sujets

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `GET /api/topics` | Public | Liste paginée et filtrable des sujets. |
| `GET /api/topics/{id}` | Public | Retourne un sujet, sauf s'il est supprimé ou bloqué pour un utilisateur non modérateur. |
| `POST /api/topics` | JWT | Crée un sujet. Champs requis : `title`, `content`, `categoryId`. `tagIds` est une liste facultative d'identifiants de tags existants. |
| `DELETE /api/topics/{id}` | JWT, auteur ou administrateur | Effectue une suppression logique (`isDeleted`). |
| `GET /api/topics/{id}/posts` | Public | Retourne les réponses visibles d'un sujet, paginées. |
| `POST /api/topics/{id}/posts` | JWT | Ajoute une réponse au sujet. Corps : `{"content": "..."}`. Refusé si le sujet est verrouillé ou supprimé. |

Paramètres de `GET /api/topics` :

| Paramètre | Défaut | Description |
|---|---:|---|
| `page` | `1` | Numéro de page, ramené au minimum à 1. |
| `limit` | `10` | Nombre de résultats, entre 1 et 50. |
| `categoryId` | — | Filtre par catégorie. |
| `tagId` | — | Filtre par tag. |
| `search` | — | Texte de recherche, après suppression des espaces en début et fin. |

La réponse de liste contient `items`, `page`, `totalPages` et `total`.

`GET /api/topics/{id}/posts` accepte également `page` et `limit` (mêmes valeurs par défaut et bornes) et retourne `items`, `page`, `limit`, `total` et `totalPages`.

La réponse d'un sujet expose notamment `id`, `title`, `slug`, `content`, `createdAt`, `updatedAt`, `isPinned`, `isLocked`, `moderationStatus`, `toxicityScore`, `author`, `category`, `tags`, `postsCount`, `participantsCount` et `lastContributionAt`.

### Posts

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `GET /api/posts?topicId={id}` | Public | Liste les posts non supprimés d'un sujet, par ordre chronologique. `topicId` est requis ; son absence retourne `400`. |
| `GET /api/posts/{id}` | Public | Retourne un post ; un post supprimé est présenté comme introuvable (`404`). |
| `POST /api/posts` | JWT | Crée un post. Champs requis : `content` et `topicId`. Retourne le post créé avec `201`. |
| `DELETE /api/posts/{id}` | JWT, auteur ou administrateur | Supprime le post logiquement (`isDeleted`). |

Lors de la création d'un post par l'une ou l'autre route POST, son contenu est envoyé au service LLM pour modération automatique. Le score de toxicité et l'état (`approved`, `reported` ou `blocked`) sont enregistrés avec le post.

## 7. Modération et signalements

### Actions de modération

| Méthode et route | Accès | Corps JSON |
|---|---|---|
| `PATCH /api/topics/{id}/lock` | Modérateur | `locked` (booléen, défaut `true`), `reason` (facultatif). Verrouille ou déverrouille le sujet. |
| `PATCH /api/topics/{id}/pin` | Modérateur | `pinned` (booléen, défaut `true`), `reason` (facultatif). Épingle ou désépingle le sujet. |
| `PATCH /api/topics/{id}/moderate` | Modérateur | `status` (défaut `approved`), `reason` (facultatif). Modifie l'état de modération du sujet et clôt les signalements en attente associés. |
| `PATCH /api/posts/{id}/moderate` | Modérateur | `status` (défaut `approved`), `reason` (facultatif). Modifie l'état du post et clôt les signalements en attente associés. |

Les actions sont consignées dans le journal de modération avec l'auteur de l'action et le motif fourni.

### Signalements

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `POST /api/reports` | JWT | Crée un signalement. `reason` est requis ; fournir `topicId`, `postId`, ou les deux. Le statut de modération de la cible est passé à `reported`. Retourne `201`. |
| `GET /api/reports/mine` | JWT | Liste les signalements de l'utilisateur courant. |
| `GET /api/reports` | Modérateur | Liste paginée des signalements, triés du plus récent au plus ancien. Paramètres `page` (défaut `1`) et `limit` (défaut `10`, borné entre 1 et 50). |
| `GET /api/reports/{id}` | Modérateur ou administrateur | Retourne un signalement avec ses informations de déclarant, sujet et/ou post associé. |

## 8. Salons et messages de discussion

Les routes de consultation des salons et des messages ne sont pas déclarées publiques : elles requièrent également un JWT.

### Salons

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `GET /api/chat/rooms` | JWT | Liste les salons. |
| `GET /api/chat/rooms/{id}` | JWT | Retourne un salon. |
| `POST /api/chat/rooms` | JWT | Crée un salon. `name` est requis ; `description` est facultatif. Le slug est généré depuis le nom. |
| `PUT /api/chat/rooms/{id}` ou `PATCH /api/chat/rooms/{id}` | JWT, propriétaire ou modérateur/administrateur | Modifie `name` et/ou `description`. |
| `DELETE /api/chat/rooms/{id}` | JWT, propriétaire ou modérateur/administrateur | Supprime le salon. |

### Messages

| Méthode et route | Accès | Fonctionnement |
|---|---|---|
| `GET /api/chat/messages` | JWT | Liste les messages du plus récent au plus ancien, avec auteur, salon et éventuel message parent. |
| `GET /api/chat/messages/{id}` | JWT | Retourne un message. |
| `POST /api/chat/messages` | JWT | Crée un message. Champs requis : `content`, `chatRoomId`. `parentMessageId` est facultatif ; un parent introuvable est simplement ignoré. |
| `PUT /api/chat/messages/{id}` ou `PATCH /api/chat/messages/{id}` | JWT | Route de mise à jour du contenu. Voir les limites d'implémentation ci-dessous. |
| `DELETE /api/chat/messages/{id}` | JWT | Route de suppression du message. Voir les limites d'autorisation ci-dessous. |

## 9. Fonctions assistées par LLM

Les routes LLM sont protégées par l'authentification par défaut de l'API. Elles délèguent au service HTTP interne `llm` (port `8000` dans Docker).

| Méthode et route | Corps JSON | Réponse |
|---|---|---|
| `POST /api/llm/topics/{id}/summary` | Aucun champ requis | Produit et enregistre un résumé du sujet ; retourne `{"summary": "..."}`. |
| `POST /api/llm/posts/{id}/analyze` | Aucun champ requis | Retourne l'analyse de modération du contenu du post. |
| `POST /api/llm/topics/suggest-tags` | `{"text": "..."}` | Retourne `{"tags": [...]}`. Un texte vide donne une liste vide. |
| `POST /api/llm/assist` | `{"text": "...", "action": "improve"}` | Retourne `{"result": "..."}`. `action` est facultatif et vaut `improve` par défaut. |

## 10. Événements temps réel

Le backend publie des mises à jour sur Mercure :

- création de post : sujet `topic/{id}`, événement de type `post_created` ;
- notifications : sujet `user/{id}`, événement de type `notification`.

Ces publications complètent les réponses REST ; elles ne remplacent pas les routes HTTP. L'URL publique et les paramètres de connexion au hub dépendent de la configuration d'environnement Mercure.

## 11. Limites connues de l'implémentation actuelle

Les points suivants sont importants pour les clients et intégrateurs :

- `PUT/PATCH /api/chat/messages/{id}` référence une variable `$post` inexistante lors de la vérification de propriété. L'appel peut donc échouer avant la modification du message.
- `DELETE /api/chat/messages/{id}` exige un utilisateur authentifié via le firewall, mais le contrôleur ne vérifie pas que cet utilisateur est propriétaire du message ou modérateur.
- La route publique `GET /api/users/{id}` expose des données de profil et des compteurs ; la route `GET /api/users` exige pour sa part un JWT et renvoie aussi l'adresse e-mail et les rôles.
- La création de compte applique des critères de complexité du mot de passe ; la mise à jour de mot de passe via le profil ne réutilise pas cette validation.

Les clients ne devraient pas dépendre d'une autorisation plus stricte que celle explicitement indiquée dans les tableaux ci-dessus.

## 12. Exemples

Créer un sujet avec un JWT :

```http
POST /api/topics
Authorization: Bearer <jeton>
Content-Type: application/json

{
  "title": "Bienvenue",
  "content": "Présentation de la communauté.",
  "categoryId": 1,
  "tagIds": [2, 3]
}
```

Lister les sujets d'une catégorie :

```http
GET /api/topics?page=1&limit=10&categoryId=1
```

Ajouter une réponse :

```http
POST /api/topics/42/posts
Authorization: Bearer <jeton>
Content-Type: application/json

{
  "content": "Merci pour cette présentation."
}
```
