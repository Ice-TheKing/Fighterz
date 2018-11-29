const models = require('../models');

const Fighter = models.Fighter;
const Account = models.Account; // need this to reference number of fighters already on the account

const makerPage = (req, res) => {
  Fighter.FighterModel.findByAccount(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred ' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), fighters: docs });
  });
};

const getFighters = (request, response) => {
  const req = request;
  const res = response;

  return Fighter.FighterModel.findByAccount(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ fighters: docs });
  });
};

const getAllFighters = (request, response) => {
  const res = response;

  return Fighter.FighterModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ fighters: docs });
  });
};

const deleteFighter = (request, response) => {
  const req = request;
  const res = response;

  return Fighter.FighterModel.deleteByName(req.session.account._id, req.body.name, (err) => {
    // add one more fighter to the account model
    Account.AccountModel.findByUsername(req.session.account.username, (er, doc) => {
      if (er) {
        console.dir(er);
      }

      const account = doc;
      account.numFighters -= 1;

      const accountPromise = doc.save();

      accountPromise.then(() => {

      });

      accountPromise.catch(error => {
        console.dir(error);
      });
    });

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ message: 'Fighter deleted successfully' });
  });
};

const makeFighter = (req, res) => {
  // cast everything as a number (except name of course)
  const name = req.body.name;
  const health = Number(req.body.health);
  const damage = Number(req.body.damage);
  const speed = Number(req.body.speed);
  const armor = Number(req.body.armor);
  const crit = Number(req.body.crit);
  // console.log(req.session.username);

  if (!name || !health || !damage || !speed || !armor || !crit) {
    return res.status(400).json({ error: 'All fighter stats required' });
  }

  if (health + damage + speed + armor + crit > 36) {
    return res.status(400).json({ error: 'stats must not exceed 36' });
  }

  // check how many fighters the account has
  return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error occurred' });
    }

    const account = doc;

    // console.log(`num fighters: ${account.numFighters} max fighters: ${account.maxFighters}`);
    // console.dir(account);

    // if the user is at max fighters, don't let them make another one
    if (account.numFighters >= account.maxFighters) {
      return res.status(400).json({
        error: `You hit your fighter limit. Delete one of your existing fighters 
        to create a new one, or purchase an additional slot from the account page`,
      });
    }

    const fighterData = {
      name,
      health,
      damage,
      speed,
      armor,
      crit,
      username: req.session.username,
      account: req.session.account._id,
    };

    const newFighter = new Fighter.FighterModel(fighterData);

    const fighterPromise = newFighter.save();

    fighterPromise.then(() => {
      // increase number of fighters on the account
      // console.dir(account.username);

      account.numFighters += 1;
      const accountPromise = doc.save();

      accountPromise.then(() => {

      });

      accountPromise.catch(error => {
        console.dir(error);
      });

      res.json({ redirect: '/maker' });
    });

    fighterPromise.catch((er) => {
      // console.log(err);
      if (er.code === 11000) {
        return res.status(400).json({ error: 'Fighter already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return fighterPromise;
  });
};

module.exports.makerPage = makerPage;
module.exports.getFighters = getFighters;
module.exports.getAllFighters = getAllFighters;
module.exports.make = makeFighter;
module.exports.deleteFighter = deleteFighter;
