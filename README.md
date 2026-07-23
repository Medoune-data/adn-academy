# ADN Academy — Site web

Site Next.js (App Router) pour ADN Academy : vitrine publique, catalogue de
formations, communauté WhatsApp, et espace élève privé avec ressources
(rediffusions + fichiers) par formation.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Firebase Auth (email/mot de passe) + Firestore

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local   # puis renseigne tes clés Firebase
npm run dev
```

## Configuration Firebase

1. Crée un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Active **Authentication > Email/Password**
3. Active **Firestore Database**
4. Copie les clés de config web dans `.env.local`
5. Déploie les règles de sécurité : copie le contenu de `firestore.rules`
   dans Firebase Console > Firestore > Règles

## Devenir admin (accéder à /admin)

La page `/admin` n'apparaît dans le menu que pour un compte marqué comme
admin, et reste bloquée pour tout autre visiteur même s'il devine l'URL.

Il n'y a **pas d'inscription publique** sur le site (les comptes élèves
sont créés depuis `/admin/eleves`) — donc pour ton tout premier compte
(le tien), il faut passer une fois par la Firebase Console :

1. Firebase Console > **Authentication > Users > Add user** — renseigne
   ton email et un mot de passe
2. Copie l'**UID** généré (colonne "UID utilisateur")
3. Firestore Database > Data, crée un document dans une collection
   `students` avec pour **ID cet UID**, contenu :
   `{ name: "...", email: "...", enrolledFormations: [] }`
4. Crée aussi un document dans une collection `admins`, avec pour **ID
   ce même UID** (contenu libre, ex: `{ role: "admin" }`)
5. Va sur `/connexion`, connecte-toi avec cet email/mot de passe — le
   lien **Admin** apparaît dans le menu

Tous les comptes élèves suivants se créent ensuite normalement depuis
`/admin/eleves`, sans repasser par la console.

Depuis `/admin`, tu peux :
- Ajouter/modifier/supprimer les séances de chaque formation (titre, lien
  YouTube de la rediffusion, description) — les élèves inscrits regardent
  directement la vidéo dans leur espace
- Créer des comptes élèves et activer/désactiver leur accès à une
  formation, en un clic (`/admin/eleves`)
- Créer, modifier et générer les certificats des élèves (`/admin/certificats`)

**Restriction d'accès par formation** : un élève ne voit que les
formations auxquelles il est inscrit. Un élève inscrit uniquement à
Excel ne verra ni les séances ni les fichiers de SQL ou R — c'est
appliqué à la fois côté interface et côté règles Firestore
(`firestore.rules`), donc même en modifiant l'URL directement un élève
non-inscrit ne peut pas accéder aux ressources d'une autre formation.

## Modèle de données

```
students/{uid}                              // Firestore
  name, whatsapp, email, enrolledFormations: string[], createdAt

formations/{slug}/seances/{seanceId}        // Firestore — géré depuis /admin
  semaine, titre, description, youtubeId, date

lib/fichiers.ts                             // dans le code — pas de Firestore
  FICHIERS[slug][semaine] = [{ nom, url, type }]

certificates/{certId}                       // Firestore
  studentName, courseTitle, issueDate, duration, level, mention,
  skills: string[], projectDescription, projectUrl
```

**Activation d'un accès élève** : depuis `/admin/eleves`, coche la
formation à activer pour l'élève concerné après confirmation du paiement
WhatsApp — plus besoin de passer par la Firebase Console.

**Ajout d'une séance (vidéo)** : depuis `/admin/[slug]` (accessible via le
tableau de bord `/admin`), remplis le formulaire — semaine, titre,
description, date, lien YouTube complet (l'ID est extrait automatiquement).
La vidéo apparaît immédiatement dans l'espace ressources des élèves
inscrits.

**Ajout des fichiers à télécharger** (pas de Storage payant, tout est
statique — comme sur ton site perso) :
1. Dépose le fichier dans `/public/fichiers/{slug}/` (ex :
   `/public/fichiers/excel/semaine-2-tp.xlsx`)
2. Ajoute une ligne dans `lib/fichiers.ts`, sous la formation et la
   semaine correspondantes, avec son titre et son chemin
   (`/fichiers/excel/semaine-2-tp.xlsx`)
3. Redéploie le site (`git push`, Vercel se charge du reste)

Le titre saisi dans `lib/fichiers.ts` (ex : *"Ressources de la séance 2 —
Excel"*) est ce que l'élève voit dans son espace ressources.

## SEO

- `app/sitemap.ts` et `app/robots.ts` génèrent `/sitemap.xml` et
  `/robots.txt` automatiquement — les pages privées (`/admin`,
  `/espace-eleve`, `/connexion`, `/inscription`) sont exclues de
  l'indexation
- Chaque page publique a son propre titre/description (`export const
  metadata`), avec un modèle `%s | ADN Academy` défini dans le layout racine
- Open Graph, Twitter Card et données structurées (JSON-LD
  `EducationalOrganization`) sont configurés dans `app/layout.tsx`
- Pense à définir `NEXT_PUBLIC_SITE_URL` avec ton vrai nom de domaine une
  fois déployé — le sitemap et les métadonnées Open Graph en dépendent
- Une fois en ligne, soumets le sitemap dans **Google Search Console**
  (comme pour ton site perso)

## Certificats

Depuis `/admin/certificats` :
- Renseigne le nom de l'élève, la formation, la date, la mention, et
  éventuellement un lien de projet + une description
- Les **compétences se préremplissent automatiquement** selon la
  formation choisie (Excel / SQL / R) — pas besoin de les ressaisir
- **↓ PDF** génère le certificat officiel (mise en page identique à ton
  système existant : QR code de vérification, signature, mention) —
  géré par `lib/generateCertificate.ts`
- Chaque certificat est consultable publiquement sur `/verify/{id}`,
  le lien affiché à côté de chaque certificat dans la liste

Pour un rendu optimal du PDF, ajoute (facultatif) dans `/public/` :
- `logo-adn.png` — logo affiché en en-tête du certificat
- `signature.png` — signature affichée au-dessus du nom de l'académie

Sans ces fichiers, le PDF utilise un texte de repli automatiquement.

## ADN Battle

Un mini-jeu de quiz data (Excel/SQL/R) pour les élèves connectés :
- **Solo vs IA** (`/battle/solo`) : 10 questions générées à la volée par
  Groq (IA), adaptées à la formation et au niveau choisis, avec chrono de
  10s par question, score, XP et explications à la fin
- **Défi hebdomadaire** (`/battle/hebdo`) : les mêmes questions pour tout
  le monde chaque semaine, avec un Top 10 en direct
- **Progression** : XP cumulé sur `students/{uid}.xp`, badge affiché
  automatiquement selon le total (Débutant → Master Data), voir
  `lib/xp.ts` pour les seuils

### Pourquoi une API génère les questions au lieu du client

La clé Groq ne doit **jamais** être exposée côté navigateur (elle serait
visible par n'importe qui et épuiserait vite le quota gratuit). Les
questions sont donc générées côté serveur, via deux routes :

- `app/api/battle/questions/route.ts` — un appel Groq **par partie**
  (10 questions d'un coup), pas un appel par question
- `app/api/battle/weekly/route.ts` — un appel Groq **par semaine**
  seulement (le premier élève qui ouvre le défi le génère pour tout le
  monde ; les suivants récupèrent le même jeu de questions depuis
  Firestore) — c'est aussi ce qui garantit un classement juste, tout le
  monde répond aux mêmes questions

Avec ce découpage, même une académie de plusieurs centaines d'élèves
tient largement dans le quota gratuit de Groq (~30 requêtes/minute,
jusqu'à 14 400/jour selon le modèle) : le nombre d'appels dépend du
nombre de *parties* jouées, pas du nombre de *questions* affichées.

**Important — ne pas faire tourner plusieurs clés Groq en rotation** :
chez Groq, les limites s'appliquent au niveau du compte, pas par clé —
plusieurs clés du même compte partagent le même plafond, et créer
plusieurs comptes pour contourner la limite viole leurs conditions
d'utilisation. Le découpage ci-dessus (1 appel/partie, 1 appel/semaine)
est la façon prévue de rester large dans le quota gratuit.

### Configuration requise

En plus des variables Firebase déjà en place, ajoute dans `.env.local` :
- `GROQ_API_KEY` — récupérable gratuitement sur
  [console.groq.com/keys](https://console.groq.com/keys)
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`,
  `FIREBASE_ADMIN_PRIVATE_KEY` — depuis Firebase Console > Paramètres du
  projet > **Comptes de service** > Générer une nouvelle clé privée
  (télécharge un JSON, les 3 valeurs sont dedans)

Si Groq est indisponible ou en limite de débit, le jeu bascule
automatiquement sur un petit stock de questions codées en dur
(`lib/battle-fallback.ts`) — une partie ne casse jamais.

## Structure du site

- `/` — accueil
- `/formations`, `/formations/[slug]` — catalogue et détail (public)
- `/communaute` — présentation ADN Community + lien WhatsApp
- `/a-propos` — mission et équipe
- `/contact`
- `/connexion` — connexion élève (Firebase Auth)
- `/inscription` — page d'information (pas de formulaire — les comptes
  sont créés depuis `/admin/eleves`)
- `/espace-eleve` — tableau de bord élève (formations actives)
- `/espace-eleve/[slug]` — ressources d'une formation (replays, fichiers) —
  réservé aux élèves inscrits à cette formation
- `/admin`, `/admin/[slug]`, `/admin/eleves`, `/admin/certificats` —
  panneau admin (séances, accès élèves, certificats) — réservé aux
  comptes marqués admin, invisible du menu pour tout autre visiteur
- `/verify/[id]` — vérification publique d'un certificat
- `/battle`, `/battle/solo`, `/battle/hebdo` — ADN Battle (quiz Solo vs
  IA et défi hebdomadaire), réservé aux élèves connectés
- `/api/battle/questions`, `/api/battle/weekly`,
  `/api/battle/weekly-score` — routes serveur (appellent Groq, jamais
  exposées côté client)

## Déploiement (Vercel)

```bash
npm run build
```

Puis connecte le repo sur [vercel.com](https://vercel.com) et ajoute
toutes les variables de `.env.local` dans les réglages du projet Vercel
(les 6 `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_SITE_URL`, et pour ADN
Battle : `GROQ_API_KEY`, `FIREBASE_ADMIN_PROJECT_ID`,
`FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`).
