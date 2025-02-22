# Angular Test

## Installation du projet
Lancer ces deux commandes l'une après l'autre à la racine du projet :

• npm install (installe vos packages dans le node_modules)

• ng serve -o (lance votre application angular et l'ouvre dans votre navigateur par défaut)

## Descriptions du projet

### Mission : ******* - Développement d'une Application de Gestion de Comptes Rendus d'Activité

Briefing de la Mission : Agents développeurs, votre nouvelle mission, baptisée "Opération CRA", est de développer une application Angular pour la gestion des comptes rendus d'activité (CRA) de trois de nos meilleurs agents spéciaux.

#### Directives Opérationnelles :

• Gestion des Congés : Chaque agent dispose d’une semaine de repos bien mérité et stratégique durant la mission. Votre application devra montrer ces pauses comme des sanctuaires de tranquillité dans le chaos du calendrier opérationnel.

• Codage des Projets : Les agents sont engagés sur trois projets secrets majeurs. Assurez-vous que votre application permette une imputation transparente et sans erreur des efforts déployés sur chaque projet.

#### Exigences fonctionnelles :

1. Interface de Commande : Développez une page intuitive pour visualiser et modifier les CRA des agents.

2. Visualisation Temporelle : Assurez une représentation claire sur trois mois, avec des vues mensuelles.

3. Gestion des Ressources : Intégrez les semaines de congés des agents dans l'interface, assurez-vous qu'elles soient visibles et modifiables.
Technologie de Support :Votre arsenal pour cette mission comprend le modèle de gestion de l'état NGRX

#### Paramètres Techniques :

1. Architecture Secrète : Angular sera votre toile de fond, sur laquelle vous allez peindre votre chef-d'œuvre de fonctionnalités et de performances.

2. Sécurité des Opérations : Avec NGRX, aucun détail n'échappe au contrôle central. Gardez la situation bien en main.

3. Défenses Permanentes : Les tests unitaires sont vos gardes du corps. Ils ne dorment jamais, veillant à ce que chaque ligne de code soit prête au combat.

#### Livraison :

• Dépôt de Documents : Livrez le fruit de votre génie dans un répertoire GitHub. Ce bastion numérique sera votre point de contact avec le commandement.

• Manuel de l'Opérateur : Incluez des instructions détaillées dans votre README.md pour que même un novice puisse déployer l'application sans appeler à l'aide.

Note de Briefing : Vous avez une semaine pour mener à bien cette mission. En cas de turbulences ou de questions sur le terrain, votre ligne de communication est toujours ouverte. Lancez-vous, la réussite de cette mission repose sur vos épaules. Bon courage, agent !


## Pour build le projet

ng build --output-path docs --base-href /test-gan-vie/

bouger tout de browser dans docs et supprimer browser
dupliquer le index.html et le renommer 404.html

remplacer `<base href="C:/Program Files/Git/test-gan-vie/">` par `<base href="/test-gan-vie/">` dans index et 404 html

commit et push le dossier docs sur github
