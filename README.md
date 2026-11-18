# Site Synthérapies

Site statique (HTML/CSS, sans outil de build).
Il est publié avec GitHub Pages.

## Structure
- `index.html` : accueil
- `approche.html` : déroulement d'une séance et outils
- `a-propos.html` : présentation du praticien
- `tarifs.html` : formules et prix
- `faq.html` : questions fréquentes
- `rendez-vous.html` : formulaire de demande de rendez-vous et carte
- `assets/css/tokens.css` : couleurs, polices et espacements de la charte (à modifier ici)
- `assets/css/style.css` : mise en page
- `assets/img/` : logo enso, portrait, favicon
- `_archive/` : contenu de l'ancien site WordPress, non publié (exclu par `.gitignore`)

## Site non référencé (pour le moment)
Chaque page contient `<meta name="robots" content="noindex, nofollow, noarchive">` : les moteurs de recherche ne l'affichent pas dans leurs résultats. Le site reste accessible à toute personne qui en connaît l'adresse.

Pour le référencer plus tard : retirer cette ligne dans les 6 fichiers `.html`, puis remettre `_archive/sitemap.xml` à la racine du site.

## Principes du design
L'audit complet, avec ses sources et les mesures relevées, est dans `_archive/audit-design.md`.

- **Un seul système de proportions** : tailles de texte sur une échelle au nombre d'or (× 1,272 par cran), espacements et largeurs en suite de Fibonacci, colonnes en section dorée (61,8 % / 38,2 %), portrait en rectangle d'or. Tout est réglé dans `assets/css/tokens.css`.
- **Trois voix typographiques** : Cormorant Garamond pour les titres, Jost pour le texte, Dancing Script pour le nom et la signature uniquement.
Le design s'inspire de principes issus des neurosciences de la perception et de la structure d'une séance d'hypnose ericksonienne. Ce sont des choix de mise en forme : ils ne promettent aucun effet thérapeutique et ne changent pas les textes.
- **Un point de fixation** : le cercle enso est le seul élément animé de la page.
- **Le rythme du souffle** : 10 s partagées en section dorée, 3,82 s d'inspiration et 6,18 s d'expiration (6 respirations par minute, expiration plus longue). Le bouton « Prendre une minute pour respirer » guide six cycles, à la demande du visiteur uniquement.
- **La descente puis le retour** : l'accueil passe en fondu du papier clair à des tons de plus en plus profonds, jusqu'au bleu nuit de la citation, puis revient à la lumière pour la prise de rendez-vous.
- **Aucune rupture** : pas de bord net entre les sections, formes arrondies, apparitions lentes, en-tête qui s'efface à la descente.
- **Peu de choses à la fois** : groupes de trois ou quatre éléments, une seule action principale par écran, lignes courtes, un seul axe de lecture à gauche.
- **Les ondes** : une onde fine quitte le cercle toutes les 2 s (cinq par souffle), comme à la surface de l'eau ; un écho discret les reprend dans la bande nuit.
- **Couleurs** : un papier crème chaleureux, le violet et le gris-bleu de l'enso sur les titres, les filets et les boutons, une pointe d'ocre pour les détails. La descente de l'accueil suit les teintes d'un crépuscule (crème, sable, brume gris-bleu, nuit indigo), sans rose ni mauve dans les fonds clairs. Jamais de blanc pur ni de noir pur.
- **Respect du visiteur** : toutes les animations se coupent si l'appareil demande moins de mouvement ; contrastes des textes supérieurs à 4,5:1.

Les réglages (couleurs, durées du souffle, profondeur des teintes) sont dans `assets/css/tokens.css`.

## Activer le formulaire de demande de rendez-vous (gratuit)
La page `rendez-vous.html` envoie les demandes par e-mail grâce à Web3Forms (offre gratuite : 250 demandes par mois). Vos disponibilités ne sont jamais affichées.
1. Aller sur https://web3forms.com, saisir l'adresse e-mail qui doit recevoir les demandes et récupérer la clé d'accès (« Access Key ») reçue par e-mail.
2. Dans `_archive/gabarits/rendez-vous.main.html`, mettre cette clé dans le champ `access_key`, puis régénérer les pages.
3. Publier (commit et push), puis envoyer une demande test depuis le site en ligne.

La clé est renseignée depuis le 15 novembre 2026. Les demandes arrivent à l'adresse e-mail choisie sur Web3Forms. Pour changer d'adresse de réception, passer par le tableau de bord Web3Forms : rien à modifier sur le site.

## Modifier le site
Ouvrir le fichier `.html` voulu, changer le texte, enregistrer, puis faire un commit et un push : GitHub Pages met le site à jour en une à deux minutes.
L'en-tête et le pied de page sont répétés dans chaque page : une modification du menu doit donc être faite dans les 6 fichiers.

## Prévisualiser en local
```
python -m http.server 8080 --directory site
```
puis ouvrir http://localhost:8080

## Nom de domaine
Pour utiliser un domaine (par exemple `syntherapies.com`) :
1. ajouter un fichier `CNAME` contenant le domaine ;
2. chez le registrar, créer les enregistrements DNS vers GitHub Pages ;
3. activer « Enforce HTTPS » dans les réglages Pages du dépôt.

Pensez aussi à mettre à jour les adresses dans `sitemap.xml` au moment du référencement.

## Gabarits
`_archive/gabarits/` contient l'en-tête, le pied de page et le contenu de chaque page séparément. Ils ne sont pas publiés.

Pour modifier un texte présent sur toutes les pages (menu, pied de page) ou le contenu d'une page, modifier le gabarit puis régénérer les 6 fichiers `.html` :
```
pwsh -File _archive/gabarits/build.ps1
```
Attention : ce script réécrit les 6 pages. Une modification faite directement dans un fichier `.html` sans passer par le gabarit serait perdue à la régénération suivante.
