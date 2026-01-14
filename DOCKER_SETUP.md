# 🐳 Guide de Démarrage Docker

## ✅ Problèmes Corrigés

Les erreurs suivantes ont été identifiées et corrigées :

1. ❌ **Fichier .env manquant (template)** → ✅ Créé `.env.example`
2. ❌ **CORS mal configuré** → ✅ Corrigé (`http://front:3000` → `http://frontend:3000`)
3. ❌ **Nom de fichier non-standard** → ✅ Renommé (`Docker-compose.yml` → `docker-compose.yml`)
4. ✅ **PostgreSQL sur AWS RDS** → Configuration SSL maintenue pour AWS

## 📋 Architecture

### Services Docker

Le projet utilise **2 services Docker** :

1. **backend** : FastAPI + Uvicorn (Python)
   - Port : 8000
   - Healthcheck : `/docs` endpoint
   - Connexion à PostgreSQL AWS RDS (externe)

2. **frontend** : React + Vite + Nginx
   - Port : 3000 (mappé sur 80 interne)
   - Dépend de : backend (attend qu'il soit healthy)

### Base de Données

**PostgreSQL est hébergé sur AWS RDS** (service externe, pas dans Docker)
- Connexion sécurisée avec SSL (requis par AWS)
- Configuré via variables d'environnement dans `.env`

## 🚀 Lancement du Projet

### 1. Configuration des Variables d'Environnement

Le fichier `.env` existe déjà localement (ignoré par git pour la sécurité).

Vérifiez que votre `.env` contient les bonnes valeurs :

```bash
# Base de données AWS RDS
POSTGRES_USER=votre_user_rds
POSTGRES_PASSWORD=votre_password_rds
POSTGRES_HOST=votre-endpoint-rds.region.rds.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_DB=ai_code_mentor

# Clés API obligatoires
BACKBOARD_API_KEY=votre_vraie_clé_api_ici
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google

# JWT Secret (clé sécurisée)
JWT_SECRET_KEY=votre_clé_jwt_min_32_caractères
```

### 2. Lancer tous les services

```bash
# Construction et lancement
docker-compose up --build

# Ou en mode détaché (arrière-plan)
docker-compose up --build -d
```

### 3. Vérifier que tout fonctionne

```bash
# Voir les logs de tous les services
docker-compose logs -f

# Vérifier le statut des containers
docker-compose ps

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Accéder aux services

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **API Docs (Swagger)** : http://localhost:8000/docs
- **PostgreSQL** : AWS RDS (endpoint configuré dans .env)

### 5. Commandes Utiles

```bash
# Arrêter tous les services
docker-compose down

# Reconstruire un service spécifique
docker-compose build backend

# Redémarrer un service
docker-compose restart backend

# Voir les logs en temps réel
docker-compose logs -f

# Exécuter une commande dans un container
docker-compose exec backend bash
```

### 6. Initialiser la Base de Données (si nécessaire)

Exécutez les migrations Alembic sur AWS RDS :

```bash
# Accéder au container backend
docker-compose exec backend bash

# Dans le container, exécuter les migrations
alembic upgrade head

# Ou en une commande
docker-compose exec backend alembic upgrade head
```

## 🔧 Structure Docker

### Services

1. **backend** : FastAPI + Uvicorn
   - Port : 8000
   - Connexion à PostgreSQL AWS RDS via SSL
   - Healthcheck : `curl -f http://localhost:8000/docs`

2. **frontend** : React + Vite + Nginx
   - Port : 3000 (mappé sur 80 interne)
   - Dépend de : backend (attend qu'il soit healthy)
   - Proxy les requêtes API vers le backend

### Ordre de Démarrage

```
backend (démarre et se connecte à AWS RDS)
    ↓ (attend healthcheck)
frontend (démarre quand backend est prêt)
```

## 🐛 Dépannage

### Erreur : "port already in use"

```bash
# Vérifier quel process utilise le port
lsof -i :8000  # ou :3000

# Arrêter le process ou changer le port dans docker-compose.yml
```

### Erreur : "connection refused" depuis le backend vers RDS

1. Vérifiez les credentials dans `.env` :
   - `POSTGRES_HOST` doit être l'endpoint AWS RDS complet
   - `POSTGRES_USER` et `POSTGRES_PASSWORD` doivent être corrects

2. Vérifiez les Security Groups AWS RDS :
   - Le port 5432 doit être ouvert depuis votre IP
   - Ou depuis 0.0.0.0/0 (uniquement en développement)

3. Vérifiez que le backend a accès internet pour joindre AWS

### Erreur SSL avec PostgreSQL

La connexion SSL est **requise** pour AWS RDS. Si vous avez une erreur SSL :

```bash
# Vérifiez que votre .env ne désactive pas SSL
# La config dans database.py doit avoir :
# "ssl": "require"
```

### Erreur de build

```bash
# Nettoyer le cache Docker
docker-compose down
docker system prune -a
docker-compose up --build
```

## 🔐 Sécurité

### Variables Sensibles

- Le fichier `.env` est **ignoré par git** (via `.gitignore`)
- Ne commitez **JAMAIS** le fichier `.env` réel
- Utilisez `.env.example` comme template

### AWS RDS

- Utilisez des **Security Groups** restrictifs
- Activez les **backups automatiques**
- Surveillez les **logs CloudWatch**
- Utilisez **IAM Authentication** en production (optionnel)

## 📝 Notes de Production

Pour déployer en production :

1. **Variables d'environnement** (`.env`) :
   - `ENVIRONMENT=production`
   - `DEBUG=False`
   - Mots de passe forts et complexes
   - Vraies clés API de production
   - Endpoint RDS de production

2. **AWS RDS** :
   - Utilisez Multi-AZ pour haute disponibilité
   - Activez les backups automatiques
   - Configurez les Security Groups strictement
   - Surveillez les métriques CloudWatch

3. **Docker Compose** :
   - Utilisez des secrets Docker au lieu d'env_file
   - Ajoutez des limites de ressources (memory, cpu)
   - Configurez un reverse proxy (Traefik, Nginx)
   - Activez HTTPS avec Let's Encrypt

4. **Backend** :
   - Utilisez Gunicorn + Uvicorn workers
   - Configurez le logging vers CloudWatch
   - Activez le monitoring (Sentry, DataDog, etc.)

## 🎉 C'est Prêt !

Votre stack Docker est maintenant correctement configurée pour :
- ✅ Backend FastAPI connecté à AWS RDS
- ✅ Frontend React servi par Nginx
- ✅ Configuration SSL sécurisée
- ✅ CORS correctement configuré
