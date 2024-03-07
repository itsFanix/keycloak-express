## :rocket: Keycloak: Assurer l'authentification dans une application
Keycloak est un outil open-source d'authentification et d'autorisation. Il peut être utilisé pour :
- la sécurisation d'interface graphique
- la séucirisation d'API
- la gestion des utilisateurs et des groupes
- Le Single sign on
- La gestions d'autorisation
- L'Intégration de login des réseaux sociaux
- L'Intégration des annuaires LDAP
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

- `Access Token` : une partie d’une requête HTTP donnant l'accès à un service. Ce token est fourni par keycloak au client pour autoriser et indiquer que le client a été vérifiée. Il se trouve dans le header
  
- `Indentity Token`: Ce token fournit les information sur l'utilisateur (email, username)

### `User Federation Provider`

connexion à un stockage local(sens infrastructure) externe (AD ou LDAP)

### `Identity Provider Federation`

utilisation d’une identification externe

exemple : reseaux sociaux, ldap


Se repose sur les protocoles OPENID Connect ou SAML2.0

### Reference
