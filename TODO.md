# Reste à faire

✅ Done ❌ Not done 🛠️ In progress

## Axes d'améliorations et Correctifs :

1) 🛠️ Intégrer toutes les données sensibles dans des variables d'environnements :
   - docker-compose.yml (POSTGRES_PASSWORD) du service db. Intégrer un fichier.env et les charger dans le service.
   - backend\src\config\datasource.ts

```
db:
  image: postgres
  restart: always
  ports:
    - "5434:5432"
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: postgres
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -d postgres -U ${POSTGRES_USER}"]
    interval: 10s
    timeout: 5s
    retries: 20
  volumes:
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    - pgdata_new1:/var/lib/postgresql/data
```

2) ❌ Pour la database, créer un utilisateur et ne pas utiliser root pour la gestion du SGBDR (Modifier le service db du docker-compose.yml en rajoutant des scripts d'initialisation).
3) ❌ Décommenter le démarrage et le lancement des tests situés dans le workflow `github\workflows\jest-ci.yml` et résoudre les erreurs playwrights et l'environnement de test avec `pnpm run test:e2e`
4) Enlever tous les console logs de l'app, en particulier les informations sensibles (payload, token...)
5) 🛠️ Réintégrer l'exposition des ports des services directement à partir du fichier `docker-compose.prod` ?? Ou laisser gérer le reverse proxy nginx ?? S'interroger pour db car actuellement dans la configuration, la base de données db n'est pas exposé au port 5432.
6) ❌ Lors de la déconnexion de l'utilisateur, le rediriger vers la route `/login` et pas vers `/`.
7) ❌ Après l'ajout d'un article, faire un refetch des articles car le nouvel article ne s'affiche pas directement lorsque l'on se rend dans "Tous les articles" `(route /products)`. Contraint de se rendre sur la page d'accueil `(route "/")` ou de devoir recharger la page pour voir le nouvel article.
8) ✅ Corriger l'affichage de l'image d'un nouvel article dans `/backoffice/productslist`.
9) ❌ Corriger l'édition d'un article à partir de la route `/backoffice/productslist`.

10) ✅ Regarder les secrets de DOCKERHUB et configurer sur mon espace DockerHub.
```
   username: ${{ secrets.DOCKERHUB_USERNAME }}
   password: ${{ secrets.DOCKERHUB_TOKEN }}
```
11) ❌ backend : Résoudre les erreurs de commandes de migrations avec typeorm : 
```
pnpm run typeorm
pnpm run migration:generate
```
12) ❌ backend : Regarder `"dev": "ts-node-dev --watch ./src src/index.mts",`
13) ❌ backend : Résoudre les erreurs en démarrant l'environnement de dev avec `pnpm run dev`. Adapter le mode production et développement en introduisant la variable NODE_ENV notamment (important pour l'optimisation des ressources, code splitting, minification...).
NODE_ENV accepte 3 valeurs par défaut : development, production et test.
14) ❌ backend : Changer startprod en start:prod
15) ❌ Upgrader les versions de dépendances de tous les packages.json et vérifier que cela ne cause pas d'effet de bord et d'autres erreurs.
16) ❌ Fix <img> ESlint frontend en remplacant par <Image/> provenant de Next.
17) ❌ Voir si possibilité de minifier et d'optimiser encore plus la compilation lors du build du projet (hors code splitting et division en chunks)
18) ❌ Tenter de faire fonctionner indépendamment les services (hors contexte docker compose) comme backend et frontend. Tenter de se connecter à la base de données postgres en dehors du contexte docker en exposant sur le port 5432.
19) ❌ Résoudre les erreurs d'ajout d'image lors de la création d'un article (service imagesupload localhost dans network). Fonctionne déjà sur localhost:7000 en local avec npm start. Rajouter une image par défaut en cas de non publication lors de la création.
Voir `TODO` dans recherche, et constater le changement à effectuer sur `"http://localhost:8000/upload"`. Exclure les fichiers .spec.ts.

20) ❌ Remplacer les variables dynamiques et les intégrer dans des fichiers d'environnements pour plus de flexibilité pour le passage d'un mode à un autre. Reprendre ce que j'ai déjà fait sur une autre branche et l'adapter.
21) ❌ Exposer le service db sur le port 5432 dans dockercompose.prod ?? Pour pouvoir y avoir accès depuis le container ou l'extérieur de docker compose.
22) ❌ Voir pour intégrer :
- `"type":"module"` dans package.json à la racine pour la conversion des fichiers commonJS par des fichiers ESModules ?
- Voir ce que je peux envisager dans le fichier tsconfig.json avec les options : module et target.
23) ❌ Faire un squash des derniers commits afin de les fusionnes et les regrouper.
24) ❌ Introduire un Salt pour le hachage du mdp (changement de signature à chaque définition du mot de passe). Et ne pas définir tout le temps le même pour tous les mots de passe.
25) ❌ Mettre * dans le formulaire d'inscription et d'authentification pour les champs obligatoires.
26) ❌ Mettre en place des hooks de détection pour automatiser le déploiement lorsque les images ont été publiés sur Dockerhub.