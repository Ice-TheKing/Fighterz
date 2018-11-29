const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getUsername', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUsername);
  app.get('/getFighters', mid.requiresLogin, controllers.Fighter.getFighters);
  // be cool to make this so you dont need to be logged in
  // so you can peep the fighters before you play
  app.get('/getAllFighters', mid.requiresLogin, controllers.Fighter.getAllFighters);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/changePass', mid.requiresLogin, mid.requiresSecure, controllers.Account.changePass);
  app.post('/increaseMaxFighters', mid.requiresLogin, mid.requiresSecure,
           controllers.Account.increaseMaxFighters);
  app.get('/getMaxFighters', mid.requiresLogin, mid.requiresSecure,
          controllers.Account.getMaxFighters);
  app.get('/getDiamonds', mid.requiresLogin, mid.requiresSecure, controllers.Account.getDiamonds);
  app.post('/addDiamonds', mid.requiresLogin, mid.requiresSecure, controllers.Account.addDiamonds);
  app.get('/maker', mid.requiresLogin, controllers.Fighter.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Fighter.make);
  app.post('/deleteFighter', mid.requiresLogin, controllers.Fighter.deleteFighter);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
