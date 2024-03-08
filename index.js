'use strict';
import express from 'express';
import { Issuer, Strategy } from 'openid-client';
import passport from 'passport';
import expressSession from 'express-session';
import config from './config.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

let clientUserInfo;


// use the issuer url here
const keycloakIssuer = await Issuer.discover(config.realmURL)

console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);

const client = new keycloakIssuer.Client({
    client_id: config.clientID,
    client_secret: config.clientSecret,
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
        clientUserInfo = userinfo;
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


// use this function to protect all routes
var checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next() 
    }
    res.redirect("/login")
}

let checkAutorized = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(clientUserInfo.resource_access['express-app'].roles)
        if(clientUserInfo && clientUserInfo.resource_access['express-app'].roles.includes('admini')){
            return next()
        }
        else{
            res.status(403).send('Forbidden');
    
        }
    }
}
app.get('/testauth', checkAuthenticated, (req, res) => {
     console.log(clientUserInfo)
    let username = clientUserInfo.preferred_username
    res.render('test', {username : username});
});

app.get('/other',checkAutorized, (req, res) => {
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
app.get('/logout/callback', (req, res,next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
app.listen(3000, function () {
    console.log('Listening at http://localhost:3000');
  });