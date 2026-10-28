# Consignes de développement pour LibreForum

Ces consignes sont un point de départ : complète-les au fur et à mesure que les conventions du projet se précisent.

## Vue d'ensemble

- Le dépôt contient un frontend React + TypeScript avec Vite (`frontend/`), une API Symfony + Doctrine en PHP (`backend/`) et un microservice Python FastAPI (`llm/`).
- L'environnement de développement local est orchestré par Docker Compose.
- Avant de modifier une API, consulter `libreforum-api.md` et préserver la compatibilité avec les clients existants, sauf demande explicite de changement.

## Règles générales

- Utiliser des chemins relatifs à la racine du dépôt. Si un chemin absolu est nécessaire, le construire à partir de la racine du dépôt fournie par l'environnement, sans la recomposer manuellement.
- Avant toute lecture ou modification, vérifier que le chemin visé appartient bien au dépôt. Si un fichier est introuvable, repartir de la racine du dépôt pour retrouver son chemin exact plutôt que d'essayer des chemins supposés.
- Examiner le code et les conventions existantes avant d'introduire une nouvelle structure ou dépendance.
- Effectuer des changements ciblés, cohérents avec l'architecture en place, et éviter les modifications sans rapport avec la demande.
- Préserver le typage et traiter explicitement les erreurs ; ne pas masquer un échec par une valeur de remplacement trompeuse.
- Ne jamais ajouter de secrets ni de valeurs locales sensibles au dépôt. Utiliser `.env.example` pour documenter les variables nécessaires, sans y placer de vraies valeurs secrètes.
- Mettre à jour la documentation directement concernée par un changement de comportement ou d'API.
- Ajouter ou adapter des tests pour les comportements modifiés, en suivant les tests et outils déjà présents.

## Frontend

- Utiliser TypeScript et respecter le mode strict configuré dans `frontend/tsconfig.json`.
- Réutiliser les composants, hooks, services et conventions déjà présents dans `frontend/src/` plutôt que dupliquer la logique.
- Pour les échanges avec l'API, rechercher d'abord les fonctions et types existants dans `frontend/src/api/` et `frontend/src/services/`.
- Vérifier les changements frontend avec `cd frontend && npm run lint` et `cd frontend && npm run build`.

## Backend

- Respecter les conventions Symfony, Doctrine et PHP déjà utilisées dans `backend/src/`.
- Pour un changement d'API, vérifier les contrôleurs, les règles d'accès, la validation et la sérialisation concernés ; mettre à jour `libreforum-api.md` si nécessaire.
- Pour les changements de schéma, utiliser une migration Doctrine plutôt qu'une modification manuelle de la base.
- Exécuter les tests backend avec `cd backend && php bin/phpunit` lorsque l'environnement et les dépendances le permettent.

## Vérifications

- Lancer les vérifications pertinentes pour les fichiers modifiés ; signaler clairement celles qui n'ont pas pu être exécutées et pourquoi.
- Ne pas annoncer une vérification comme réussie si elle n'a pas été exécutée.

## À compléter par l'équipe

- **Conventions de nommage et de formatage :** …
- **Règles métier ou contraintes d'architecture importantes :** …
- **Commandes de test, de lint ou de validation supplémentaires :** …
- **Procédure de migration et de déploiement :** …
