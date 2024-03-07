'use strict';
import express from 'express';
import { Issuer, Strategy } from 'openid-client';
import passport from 'passport';
import expressSession from 'express-session';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

// Définition du répertoire des vues (optionnel si vous avez un répertoire différent)

// use the issuer url here
const keycloakIssuer = await Issuer.discover("http://localhost:8080/realms/keycloak-express")

console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);

const client = new keycloakIssuer.Client({
    client_id: 'express-app',
    client_secret: 'ZXkqvOEAaZC7tWSCvpH0q9OY4gwZBAf1',
    redirect_uris: ['http://localhost:3000/auth/callback'],
    post_logout_redirect_uris: ['http://localhost:3000/logout/callback'],
    response_types: ['code'],
  });

  const memoryStore = new expressSession.MemoryStore()
  app.use(
    expressSession({
        secret: 'theSecretKey',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
  )

  app.use(passport.initialize());
app.use(passport.authenticate('session'));

// this creates the strategy
passport.use('oidc', new Strategy({client}, (tokenSet, userinfo, done)=>{
        return done(null, tokenSet.claims());
    })
)

passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// default protected route /test
app.get('/login', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
});

// callback always routes to test 
app.get('/auth/callback', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: '/testauth',
      failureRedirect: '/'
    })(req, res, next);
});

// function to check weather user is authenticated, req.isAuthenticated is populated by password.js
// use this function to protect all routes
var checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next() 
    }
    res.redirect("/login")
}

app.get('/testauth', checkAuthenticated, (req, res) => {
    res.render('test');
});

app.get('/other', (req, res) => {
    res.render('other');
});

//unprotected route
app.get('/',function(req,res){
    res.render('index');
});

// start logout request
app.get('/logout', (req, res) => {
    res.redirect(client.endSessionUrl());
});

// logout callback
app.get('/logout/callback', (req, res) => {
    // clears the persisted user from the local storage
    req.logout();
    // redirects the user to a public route
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Listening at http://localhost:3000');
  });