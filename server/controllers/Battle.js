const models = require('../models');

const Fighter = models.Fighter;
// const Account = models.Account;

// battle variables
const critMultiplier = 1.5;
const xpRamp = 1.2;

// rolls a random value between 0 and sides
// add 1 to sides because since this is Math.floor, sides is exclusive
const roll = (sides) => Math.floor(Math.random() * sides + 1);

// rolls a random value between -sides and sides
const deviate = (sides) => (Math.floor(Math.random() * (sides * 2) + 1)) - sides;

// handles all updates to database objects for the end of a fight
// including gaining xp, leveling up, increasing battles/wins/kills stats etc
const handleGameEnd = (wnr, lsr, log, callback) => {
  const winner = wnr;
  const loser = lsr;
  const battleLog = log;

  // check to see if the match was a death match
  // let deathMatch = false;
  if (winner.level > 4 && loser.level > 4) {
    // deathMatch = true;
  }

  // TODO: check to see if loser dies

  // give each fighter some xp
  // You get 1/yourlevel * opponents level xp * 5
  // so in an equal match, winner gets 5 xp, loser gets 1
  // and if you fight a level 2 as a level 5 and win, you get 2 xp
  // and they get 2.5xp
  // benefit for fighting a higher level is capped at a 5 level difference
  const winnerxp = (Math.min((1 / winner.level * loser.level), 5) * 5);
  const loserxp = ((1 / loser.level * Math.min(winner.level, 5)) * 1);
  winner.xp += winnerxp;
  loser.xp += loserxp;

  battleLog.push(`${winner.name} has earned ${winnerxp}xp`);
  battleLog.push(`${loser.name} has earned ${loserxp}xp`);

  // check to see if they leveled up
  // this is a while loop in case somehow they leveled up a bunch of times
  while (winner.xp > winner.xpToNext) {
    winner.xp -= winner.xpToNext;
    winner.level += 1;
    winner.levelupPts += 1;
    winner.xpToNext = Math.floor(winner.xpToNext * xpRamp);
  }
  while (loser.xp > loser.xpToNext) {
    loser.xp -= loser.xpToNext;
    loser.level += 1;
    loser.levelupPts += 1;
    loser.xpToNext = Math.floor(loser.xpToNext * xpRamp);
  }

  // increase num fights and wins
  winner.wins += 1;
  winner.fights += 1;
  loser.fights += 1;

  // update database
  const winnerPromise = winner.save();
  winnerPromise.then(() => {
    const loserPromise = loser.save();
    loserPromise.then(() =>
      // all good. Both are saved
       callback());
  });
};

// returns how much damage is blocked given attacker damage and defender armor
const runArmor = (dmg, arm) => {
  const damage = dmg;
  const armor = Math.max(arm, 1);

  // make sure armor is a min of 1.
  // cause if they figure out how to get negative armor,
  // they could have like a 2,400% chance to block damage lol

  // I'm running a y = x / ((1/m)x + (1/a)) function to approach m but never go above it.
  // 'a' just changes how the curve of the function goes
  // note that it's 1/m and 1/a to get the inverse of each one. I just did this
  // so the numbers make more sense to me
  // 1/m makes it so the number the graph approaches is 'm'. and 1/a is so that
  // as 'a' increases, the initial slope of the graph is higher
  // So right now it is approaching a 95% chance to block damage. I think a 95%
  // chance at infinity armor is pretty good.
  // That means it won't get into 99% or anything like that. Deal 100 damage and
  // only ~1 goes through. That would suck lmfao (not that anyone will get infinity armor)

  // To visualize this graph, just google 'graph (x / ((1/95)x + (1/5)))'
  // so at 15, the max they can set from the beginning, chance to block
  // every point of damage is about 42%
  // chance at 50 is 68%
  const armorChance = (armor / ((1 / 95/* approaches 95*/) * armor + (1 / 5)));

  let damageBlocked = 0;
  // loop through each damage and check to see if one was blocked
  for (let i = 0; i < damage; i++) {
    // roll a percentile and check it against armor chance
    if (roll(100) < armorChance) {
      // that damage was blocked
      damageBlocked += 1;
    }
  }

  return damageBlocked;
};

// run a single attack round given an attacker and defender
const battleRound = (attk, dfnd, battleLog) => {
  const attacker = attk;
  const defender = dfnd;

  // roll damage for attacker
  // damage can deviate by 5 on either side (15 damage can hit from 10 to 20)
  let damage = attacker.damage + deviate(5);
  // It'd be cool to make this a percentage deviation. So if someone had 1000 damage,
  // it won't just deviate by 5, and will deviate by a number that scales well
  // to higher stats

  // make sure the damage is at least 1
  damage = Math.max(damage, 1);

  // check for a crit. If there is, increase damage
  if (roll(100) < attacker.crit) {
    damage = Math.floor(critMultiplier * damage);

    battleLog.push(`${attacker.name} CRIT and swung for ${damage} damage`);
  } else {
    battleLog.push(`${attacker.name} swung for ${damage} damage`);
  }

  // mitigate damage based on defender's armor
  const damageBlocked = runArmor(damage, defender.armor);
  damage -= damageBlocked;

  battleLog.push(`${defender.name} blocked ${damageBlocked} damage`);

  //  allocate damage to temp health
  defender.tempHealth -= damage;

  battleLog.push(
    `${
    defender.name} took ${
    damage} damage and has ${
    Math.max(defender.tempHealth, 0)} health remaining`
  );
};

// just a really quick helper function to see if a given fighter is dead
const isDead = (fighter) => {
  if (fighter.tempHealth < 1) { return true; }
  return false;
};

// direct call to server function. Starts off the entire fight between two fighters
// returns the result, and updates the fighter objects in the database.
const runFight = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.fighterName1 === req.body.fighterName2
    && req.body.fighterId1 === req.body.fighterId2) {
    return res.status(400).json({ error: "Fighters can't fight themselves!" });
  }

  // GET BOTH FIGHTERS FROM DATABASE
  return Fighter.FighterModel.
  findByNameId(req.body.fighterName1, req.body.fighterId1, (err1, f1) => {
    if (err1) {
      console.log(err1);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Fighter.FighterModel.
    findByNameId(req.body.fighterName2, req.body.fighterId2, (err2, f2) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }
      // GOT BOTH FIGHTERS FROM DATABASE
      const fighter1 = f1;
      const fighter2 = f2;

      // check if the fighter has the same account and name (fighters can't battle themselves)

      // give each fighter a tempHealth property to subtract from for running each round.
      // This is so if something messes up, it won't subtract
      // health without finishing the battle and giving a result
      fighter1.tempHealth = fighter1.health;
      fighter2.tempHealth = fighter2.health;

      // array of strings to hold information about the battle
      const battleLog = [];

      let winner;
      let loser;

      // while a fighter is alive
      while (fighter1.tempHealth > 0 && fighter2.tempHealth > 0) {
        // roll speeds to determine turn order
        let speed1 = fighter1.speed + roll(4);
        let speed2 = fighter2.speed + roll(4);

        let attacker;
        let defender;
        let turns = 1; // if someone has 8 speed in their roll and the defender has like 2,
        // the attacker gets to go 4 times that phase, cause its 4 times higher
        // but the order will always go: higher roll, lower roll,
        // rest of the rounds from higher roll

        while (true) { // can't have same speed. Keep looping till they find different vals
          if (speed1 > speed2) {
            attacker = fighter1;
            defender = fighter2;
            // check how many times speed 1 is higher than speed 2
            turns = Math.floor(speed1 / speed2);
            break;
          } else if (speed1 === speed2) {
            // reroll and start the loop again
            speed1 = fighter1.speed + roll(4);
            speed2 = fighter2.speed + roll(4);
            continue;
          } else {
            attacker = fighter2;
            defender = fighter1;
            // check how many times speed 2 is higher than speed 1
            turns = Math.floor(speed2 / speed1);
            break;
          }
        }
        battleLog.push(`${fighter1.name} prepares to fight with ${speed1} speed`);
        battleLog.push(`${fighter2.name} prepares to fight with ${speed2} speed`);

        battleLog.push(`${attacker.name} will go first`);
        battleLog.push(`${defender.name} will go second`);

        // If the attacker goes more than 2 times, push that to the log.
        if (turns > 2) {
          battleLog.push(`${attacker.name} will then attack another ${turns - 1} times`);
        } else if (turns === 2) { // damn english language. 'will go another 1 times' nah
          battleLog.push(`${attacker.name} will then attack 1 more time`);
        }

        // run battle rounds based on speeds
        // attacker round
        battleRound(attacker, defender, battleLog);

        // check if defender is dead
        if (isDead(defender)) {
          winner = attacker;
          loser = defender;
          battleLog.push(`${winner.name} defeated ${loser.name}`);
          break;
        }

        // defender round
        battleRound(defender, attacker, battleLog);

        // check if attacker is dead
        if (isDead(attacker)) {
          winner = defender;
          loser = attacker;
          battleLog.push(`${winner.name} defeated ${loser.name}`);
          break;
        }

        // run the rest of the attackers rounds if they have any
        for (let i = 0; i < turns - 1; i++) {
          battleRound(attacker, defender, battleLog);

          // check if defender is dead
          if (isDead(defender)) {
            winner = attacker;
            loser = defender;
            battleLog.push(`${winner.name} defeated ${loser.name}`);
            break;
          }
        }
      }

      console.dir(battleLog);
      if (winner && loser) {
        // update the winner and loser
        return handleGameEnd(winner, loser, battleLog,
                             () => res.json({ message: `${winner.name} defeated ${loser.name}` }));
      }

      return res.json({ error: 'An error occurred' });
    });
  });
};

module.exports.runFight = runFight;
