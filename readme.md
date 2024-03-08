# :rocket: Keycloak: Assurer l'authentification dans une application
Keycloak est un outil open-source d'authentification et d'autorisation. Il peut être utilisé pour :
- la sécurisation d'interface graphique
- la séucirisation d'API
- la gestion des utilisateurs et des groupes
- Le Single sign on
- La gestions d'autorisation
- L'Intégration de login des réseaux sociaux
- L'Intégration des annuaires LDAP
Pour tester les fonctionnalitées de keycloak, nous avons utilisé une application web en javascript.
---
## Descriptions des objets dans keycloak
### `Realm`
un realm permet d’organiser et de séparer des utilisateurs, des applications et des configurations.  C’est un conteneur pour les utilisateurs, les groupes et les rôles, les applications et les configurations de sécurité.
chaque realm a sa configuration de sécurité, sa politique d’authentification et autorisations. 
Un realm peut être importer ou exporter

###  `Client`
Dans le contexte de keyCloack, un “client” fait référence à une application ou service qui souhaite déléguer l’authentification à keycloack. En intégrant une application à keycloack, nous créons un client. Chaque client est ajouté à 1 ou plusieur realm et dispose des configurations spécifiques adaptées à ses besoins d’authentification et d’autorisation. 
- `Clients Roles`:  rôle spécifique aux clients

- `Clients adapter`: élément permettant la connexion avec keycloak (se fait côté keycloak)

- `Consent (consentement)` :autorisation d’un user pour un client donné après login 

- `Access Token` : Ce token est délivré lorsqu'un utilisateur s'authentifie avec succès. Il contient des informations sur l'utilisateur et ses autorisations. L'access token est utilisé pour accéder aux ressources protégées par le serveur Keycloak.
  
- `Indentity Token`: Ce token contient des informations sur l'utilisateur qui s'est authentifié. Il est délivré lors du processus d'authentification et peut être utilisé par les clients pour obtenir des détails sur l'utilisateur authentifié. L'ID token est souvent utilisé dans les applications côté client pour afficher des informations sur l'utilisateur connecté.
  
- `Refresh token`  : Ce token est utilisé pour obtenir de nouveaux access tokens sans que l'utilisateur ait besoin de s'authentifier à nouveau. Il est souvent utilisé dans les flux d'authentification OAuth 2.0 pour prolonger la durée de validité des sessions utilisateur.

### `User Federation Provider`

connexion à un stockage local(sens infrastructure) externe (AD ou LDAP)

### `Identity Provider Federation`

utilisation d’une identification externe

exemple : reseaux sociaux, ldap

### `Roles`
Un rôle dans keycloak est un ensemble de permissions qui peuvent être assignées à un utilisateur ou à un groupe. Les rôles sont utilisés pour déterminer ce que les utilisateurs sont autorisés à faire dans une application.
Le role peut être attribué au niveau du client (application) ou au niveau du realm (ensemble des applications). 

### `Groups`
Un groupe est un ensemble d’utilisateurs. Les groupes sont utilisés pour organiser les utilisateurs et pour assigner des rôles à un ensemble d’utilisateurs.

Pour réaliser ses fonctions, keycloak utilise deux protocoles principaux
- `OpenID Connect`
L'openID Connect est un protocole d'authentification qui permet de sécuriser une application. Il est basé sur le web et utilise le protocole OAuth 2.0. Il permet de vérifier l'identité d'un utilisateur en utilisant des tokens(JSON Web Token -JWT) auprès d'un fournisseur d'identité(IDP). Il permet également à des applications tierces à accéder à des ressources d'un utilisateur sans avoir à partager les identifiants de l'utilisateur.
- `SAML2.0` 
SAML-security assertion markup language est un protocole standard utilisé pour l'authentification unique(SSO) et l'autorisation entre différents systèmes.

##### Différence entre SAML et OpenID Connect
Saml est basé sur XML 
OpenID Connect est basé sur OAuth 2.0 et utilise des tokens JWT et permet aux clients d'accéder à des informations supplémentaires sur l'utilisateur.
Format de message : SAML utilise XML et OpenID Connect utilise JSON

##### Ajouter une application à keycloak
1. Se connecter à la console administrateur
2. Selectionner le realm 
3. Selectionner le champ client
4. cliquer sur le boutton
5. Remplir les champ
    - Client ID: `myclientID`
    - Client Protocol: `Select the protocol`
    - Root URL: `the client url`
    - Access Type:
    - Valid Redirect URIs:
#####  Importer et exporter un realm
  Une fonctionnalité intéressante de Keycloak est la possibilité d'importer et d'exporter un realm. Cela permet de sauvegarder un realm et de le restaurer plus tard. Cela peut être utile pour la migration d'un serveur Keycloak ou pour la mise en place d'un environnement de développement.

***Exporter un realm***
1. connecter à la console d'administration de Keycloak
2. selectioner le realm à exporter
3. cliquer sur le bouton "Export"
4. sauvegarder le fichier json

***Importer un realm***
1. cliquer sur le bouton "Select file" et selectionner le fichier json
2. cliquer sur le bouton "Create" pour importer le realm
3. le realm est importé avec succès
4. cliquer sur le bouton "View details" pour voir les détails du realm importé
  
Pour intégrer keycloak à une application, il existe différent librairie en fonction du langage de programation utilisé. 

---
## Structure de l'application web
Notre application dispose de trois pages à savoir:
- `index` Page d'acceuil 
- `secret` Page accessible à tout utilisant qui s'est authentifié
- `admin` Page accessible uniquement aux utilisateurs ayant le role `admini` 

### Executer ce projet
Pour tester ce projet localement sur votre machine suivre ces étapes:
 1. cloner ce repository sur votre machine `git clone https://github.com/itsFanix/keycloak-express.git`
 2. Accèder au dossier dans un terminal `cd /chemin/vers/dossier`
 3. Installer les dépendances de ce projet en faisant `npm install`
 4. Lancer l'application `npm run start`
 5. Accèder à l'application dans votre navigateur à l'adrresse `http://localhost:3000`

### Configuration de keycloak
Pour configurer keycloak, il faut:
1. importer le realm `express-app` dans keycloak 
   
### Les utilisateurs de l'application
Nous avons défini deux groups dans keycloak:
- `Devs` : qui a accès à la page `secret`
- `Pm` :  qui a accès à la page `secret` et `admin`
  
| Nom | Mdp | groupe |
|-----------|-----------|-----------|
| Alina   | alina24   | Dev  |
| Lucas | lucas24   | pm   |
| lisa  | lisa24   | Dev  |
| fafa  | fafa24  | pm   |

Par defaut keycloak n'ajoute pas les informations sur les rôles des utilisateurs dans le token. Pour ajouter les rôles dans le token, il faut:
  1. Se connecter à l'interface d'administration de keycloak
  2. Aller dans le realm `The-realm` > `Clients-scopes` > `role` >  `settings`  
  3.  Activer `Include in token` (enable)
  4.  Aller dans `client-scopes`> `role` > `Mapper` 
  5.  Activer `add to userinfo` (enable)` 
   
Cette configuration à déjà été faite dans le realm `express-app` de ce projet. Donc en inportant le fichier `express-app.json` dans keycloak, vous n'aurez pas besoin de refaire cette configuration.


### References
- [open-client Documentation](https://github.com/panva/node-openid-client/blob/main/docs/README.md)
- [keycloak-Documentation](https://github.com/panva/node-openid-client/blob/main/docs/README.md)
  
