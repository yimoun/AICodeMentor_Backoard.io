# 🐳 Guide de Démarrage Docker

## ✅ Problèmes Corrigés

Les erreurs suivantes ont été identifiées et corrigées :

1. ❌ **Fichier .env manquant** → ✅ Créé
2. ❌ **PostgreSQL absent** → ✅ Ajouté au docker-compose.yml
3. ❌ **Configuration SSL invalide** → ✅ Corrigée (désactivée en dev)
4. ❌ **CORS mal configuré** → ✅ Corrigé (frontend au lieu de front)
5. ❌ **Pas de volumes** → ✅ Volume PostgreSQL ajouté
6. ❌ **Pas de healthchecks** → ✅ Healthchecks ajoutés
7. ❌ **Pas de depends_on** → ✅ Dépendances configurées

## 🚀 Lancement du Projet

### 1. Configuration des Variables d'Environnement

Le fichier `.env` a été créé avec des valeurs par défaut pour le développement.

**⚠️ IMPORTANT** : Avant de lancer, modifiez les valeurs suivantes dans `.env` :

```bash
# Clés API obligatoires
BACKBOARD_API_KEY=votre_vraie_clé_api_ici
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google

# JWT Secret (générez une clé forte)
JWT_SECRET_KEY=générez_une_clé_sécurisée_min_32_caractères

# Mot de passe PostgreSQL (changez en production)
POSTGRES_PASSWORD=changez_ce_mot_de_passe_en_production
```

### 2. Lancer tous les services

```bash
# Construction et lancement de tous les services
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
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### 4. Accéder aux services

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **API Docs (Swagger)** : http://localhost:8000/docs
- **PostgreSQL** : localhost:5432

### 5. Commandes Utiles

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker-compose down -v

# Reconstruire un service spécifique
docker-compose build backend

# Redémarrer un service
docker-compose restart backend

# Voir les logs en temps réel
docker-compose logs -f

# Exécuter une commande dans un container
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d ai_code_mentor
```

### 6. Initialiser la Base de Données

Si nécessaire, exécutez les migrations Alembic :

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

1. **postgres** : Base de données PostgreSQL 16
   - Port : 5432
   - Volume persistant : `postgres_data`
   - Healthcheck : `pg_isready`

2. **backend** : FastAPI + Uvicorn
   - Port : 8000
   - Dépend de : postgres (attend qu'il soit healthy)
   - Healthcheck : `/docs` endpoint

3. **frontend** : React + Vite + Nginx
   - Port : 3000 (mappé sur 80 interne)
   - Dépend de : backend (attend qu'il soit healthy)

### Ordre de Démarrage

```
postgres (démarre)
    ↓ (attend healthcheck)
backend (démarre quand postgres est prêt)
    ↓ (attend healthcheck)
frontend (démarre quand backend est prêt)
```

## 🐛 Dépannage

### Erreur : "port already in use"

```bash
# Vérifier quel process utilise le port
lsof -i :8000  # ou :3000 ou :5432

# Arrêter le process ou changer le port dans docker-compose.yml
```

### Erreur : "connection refused" depuis le backend

- Vérifiez que `POSTGRES_HOST=postgres` dans `.env` (nom du service)
- Vérifiez que PostgreSQL est démarré : `docker-compose ps`

### Erreur de build

```bash
# Nettoyer le cache Docker
docker-compose down
docker system prune -a
docker-compose up --build
```

### Les données PostgreSQL persistent entre les redémarrages

```bash
# Pour supprimer toutes les données
docker-compose down -v

# Puis relancer
docker-compose up
```

## 📝 Notes de Production

Pour déployer en production, modifiez :

1. `.env` :
   - `ENVIRONMENT=production`
   - `DEBUG=False`
   - Mots de passe forts
   - Vraies clés API

2. `backend/app/config/database.py` :
   - Décommentez `"ssl": "require"` pour AWS RDS

3. `docker-compose.yml` :
   - Utilisez des secrets Docker au lieu d'env_file
   - Ajoutez des limites de ressources
   - Configurez un reverse proxy (Traefik, Nginx)

## 🎉 C'est Prêt !

Votre stack Docker est maintenant correctement configurée et devrait démarrer sans erreurs.
