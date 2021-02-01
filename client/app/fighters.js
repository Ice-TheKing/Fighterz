/// sends request to create fighter
const handleFighter = (e) => {
  e.preventDefault();
  
  const sliders = getSliders();
  
  // thought it was confusing enough to warrant its own error message ("wait but I set everything!")
  if(sliders.name == '') {
    sendToast('Fighter Name is required');
    return false;
  }
  
  if(sliders.health == '' ||
     sliders.damage == '' ||
     sliders.speed == '' ||
     sliders.armor == '' ||
     sliders.crit == ''
    ) {
    sendToast('All stats are required');
    return false;
  }
  
  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function() {
    // loadFightersFromServer();
    // TODO: Show a success window and reset forms
    sendToast('Fighter created successfully');
    resetForm();
  });
  
  return false;
};

/// called by the delete html button
const handleDeleteClick = (e) => {
  DeleteFighter(e);
};


/// sends a delete request to the server
const DeleteFighter = (e) => {
  let csrfToken = $("#_csrf").val();
  
  let currentFighter = {
    name: e.target.name,
    _csrf: csrfToken,
  };
  
  sendAjax('POST', '/deleteFighter', currentFighter, function() {
    loadFightersFromServer();
  });
};

/// Create a fighter React page
const FighterForm = (props) => {
  return (
    <form id="fighterForm"
          onSubmit={handleFighter}
          name="fighterForm"
          action="/maker"
          method="POST"
          className="fighterForm"
      >
      <div className="row">
        <div className="input-field col s12">
          <input id="fighterName" type="text" name="name" />
          <label for="name">Fighter Name</label>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="health">
              <input type="range" id="fighterHealth" name="health" min="1" max="15"/>
            Health</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="damage">
              <input type="range" id="fighterDamage" name="damage" min="1" max="15"/>
            Damage</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="speed">
              <input type="range" id="fighterSpeed" name="speed" min="1" max="15"/>
            Speed</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="armor">
              <input type="range" id="fighterArmor" name="armor" min="1" max="15"/>
            Armor</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <p className="range-field">
            <label for="crit">
              <input type="range" id="fighterCrit" name="crit" min="1" max="15"/>
            Crit</label>
          </p>
        </div>
        
        <div className="input-field col s4">
          <h6 id="pointsField">Points Left: 31</h6>
        </div>
      </div>
      
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      <input className="waves-effect waves-purple btn" type="submit" value="Create Fighter"/>
    </form>
  );
};

/// Page to render while the AJAX call comes back
const LoadingPage = function(props) {
  return (
    <form id="loadingForm" name="loadingForm">
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </form>
  );
};

const startFight = (e) => {
  const ourFighter = e.target.parentElement.parentElement.title.split("-");
  const theirFighter = e.target.id.split("-");
  const csrf = $("#_csrf").val();
  
  let form = `fighterName1=${ourFighter[0]}`;
  form = `${form}&fighterId1=${ourFighter[1]}`;
  form = `${form}&fighterName2=${theirFighter[0]}`;
  form = `${form}&fighterId2=${theirFighter[1]}`;
  form = `${form}&_csrf=${csrf}`;
  
  sendAjax('POST', '/fight', `${form}`, redirect);
};

const handleUpgrade = (e) => {
  // format for id is 'fighterName-stat'
  // so we just have to split it to get the pieces of the form
  const nameStat = e.target.id.split("-");
  const name = nameStat[0];
  const stat = nameStat[1];
  const csrf = $("#_csrf").val();
  
  let form = `name=${name}`;
  form = `${form}&stat=${stat}`;
  form = `${form}&_csrf=${csrf}`;
  
  // send the ajax
  sendAjax('POST', '/upgradeFighter', `${form}`, () => {
    loadFightersFromServer();
  });
};

const handleRevive = (e) => {
  let csrfToken = $("#_csrf").val();
  
  let currentFighter = {
    name: e.target.name,
    _csrf: csrfToken,
  };
  
  sendAjax('POST', '/reviveFighter', currentFighter, () => {
    sendToast('Fighter has been revived');
    loadFightersFromServer();
  });
}

// TODO: move this function. Actually honestly, break every page out into its own app file
const BattleLogForm = (props) => {
  let logTitle = props.logs.shift();
  
  // TODO: format this
  
  // print out each log
  let logNodes = props.logs.map(function(log) {
    return (
      <div className="log">
        <p>{log}</p>
      </div>
    );
  });
  
  return (
    <div className="logList row">
      <h4>{logTitle}</h4>
      {logNodes}
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </div>
  );
};

/// Renders all fighters owned by player
const YourFighterList = function(props) {
  if(props.fighters.length === 0) {
    return (
      <div className="fighterList">
        <h3 className="emptyFighter">No Fighters yet</h3>
        <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      </div>
    );
  }
  
  const fighterNodes = props.fighters.map(function(fighter) {
    // check to see if the fighter has level up points available
    // don't let players upgrade dead fighters lol
    if(fighter.levelupPts > 0 && fighter.health != 0) {
      // ids for upgrading stats
      const healthId = `${fighter.name}-health`;
      const damageId = `${fighter.name}-damage`;
      const speedId = `${fighter.name}-speed`;
      const armorId = `${fighter.name}-armor`;
      const critId = `${fighter.name}-crit`;
      // displayed as the fighter level, so the user knows how many points they have to spend
      const fighterLevel = `${fighter.level-fighter.levelupPts} + ${fighter.levelupPts}`;
      
      const logId = `log${fighter._id}`;
      
      let currentFighterLogs = fighter.logs.split('~');
      // TODO: Every log has an empty index at the end. Fix it lol
      currentFighterLogs.pop();
      
      let logNodes = currentFighterLogs.map(function(log) {
        const logLines = log.split('&');
        const logTitle = logLines[0];
        // TODO: give the container div some sort of meaningful id/class
        
        let renderBattleLog = () => {
          setupBattleLogPage(logLines);
        };
        
        return (
          <li><a className="battleLog" href="#" onClick={renderBattleLog}>{logTitle}</a></li>
        );
      });
      
      return (
        <div key={fighter._id} className="fighter">
          <div className="col s12 m12">
            <div className="card dark-purple lighten-1">
              <div className="card-content white-text">
                <a className="dropdown-trigger soft-violet right waves-effect waves-light" data-target={logId}>Logs</a><br></br>
                <ul id={logId} className='dropdown-content'>
                  {logNodes}
                </ul>
                <span className="card-title">{fighter.name}</span><p></p>
                <p className="levelField">Level {fighterLevel}</p>
                <p>xp: {fighter.xp.toFixed(1)}/{fighter.xpToNext}</p>
                <p>Wins: {fighter.wins}{/*({(100*fighter.wins/fighter.fights).toFixed(1)}%)*/}</p>
                <p>Fights: {fighter.fights}</p>
                <p>Kills: {fighter.kills}</p>
                <p>Revivals: {fighter.revivals}</p>
                <br></br>
                <p>Health: {fighter.health}<i id={healthId} className="tiny material-icons upgradebtn" onClick={handleUpgrade}>add</i></p>
                <p>Damage: {fighter.damage}<i id={damageId} className="tiny material-icons upgradebtn" onClick={handleUpgrade}>add</i></p>
                <p>Speed: {fighter.speed}<i id={speedId} className="tiny material-icons upgradebtn" onClick={handleUpgrade}>add</i></p>
                <p>Armor: {fighter.armor}<i id={armorId} className="tiny material-icons upgradebtn" onClick={handleUpgrade}>add</i></p>
                <p>Crit Chance: {fighter.crit * 2}% <i id={critId} className="tiny material-icons upgradebtn" onClick={handleUpgrade}>add</i></p>
              </div>
              <div className="card-action">
                <a name={fighter.name} onClick={handleDeleteClick}>Delete Fighter</a>
              </div>
            </div>
          </div>      
        </div>
      );
    }
    else {
      // fighter name changes depending on if they are dead or not
      let fighterName = fighter.name;
      let health = fighter.health;
      let reviveBtn = <p></p>;
      // if the fighter is dead, change the way its displayed
      if(fighter.health == 0) {
        // change the name of the fighter to tell the user the fighter is dead
        fighterName = `${fighter.name} (dead)`;
        // make the health display 0/maxHealth
        health = `${fighter.health}/${fighter.maxHealth}`;
        
        // make a revive button
        reviveBtn = (
          <a name={fighter.name} className="waves-effect waves-light btn" onClick={handleRevive}>Revive ({props.revivals})</a>
        );
      }
      
      return (
        <div key={fighter._id} className="fighter">
          <div className="col s12 m12">
            <div className="card dark-purple lighten-1">
              <div className="card-content white-text">
                <span className="card-title fighterName">{fighterName}</span>
                {reviveBtn}
                <p className="levelField">Level {fighter.level}</p>
                <p>xp: {fighter.xp.toFixed(1)}/{fighter.xpToNext}</p>
                <p>Fights: {fighter.fights}</p>
                <p>Wins: {fighter.wins}{/*({(100*fighter.wins/fighter.fights).toFixed(1)}%)*/}</p>
                <p>Kills: {fighter.kills}</p>
                <p>Revivals: {fighter.revivals}</p>
                <br></br>
                <p>Health: {health}</p>
                <p>Damage: {fighter.damage}</p>
                <p>Speed: {fighter.speed}</p>
                <p>Armor: {fighter.armor}</p>
                <p>Crit Chance: {fighter.crit * 2}%</p>
              </div>
              <div className="card-action">
                <a name={fighter.name} onClick={handleDeleteClick}>Delete Fighter</a>
              </div>
            </div>
          </div>      
        </div>
      );
    }
  });
  
  return (
    <div className="fighterList row">
      {fighterNodes}
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </div>
  );
};

const AllFighterList = function(props) {
  if(props.fighters.length === 0) {
    return (
      <div className="fighterList">
        <h3 className="emptyFighter">No Fighters yet</h3>
        <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      </div>
    );
  }
  
  const yourFighterNodes = props.yourFighters.map(function(fighter) {
    const id = `${fighter.name}-${fighter.account}`;
    const itemName = `${fighter.name} - ${fighter.level}`;
    // if one of your fighters is dead, don't have it as an option to fight
    if(fighter.health != 0) return (
      <li><a href="#" id={id} onClick={startFight}>{itemName}</a></li>
    );
  });
  
  const fighterNodes = props.fighters.map(function(fighter) {
    // have to use some sort of iterator to key each dropdown lists ids, otherwise some dropdowns
    // might refer to a random different dropdown
    const dropdownId = `dropdown${fighter._id}-${fighter.account}`;
    const title = `${fighter.name}-${fighter.account}`;
    const logId = `log${fighter._id}-${fighter.account}`;
    
    // for setting up each card as a modal
    const modalhref = `modal${fighter._id}`;
    const modalhrefId = `#${modalhref}`;
    
    let currentFighterLogs = fighter.logs.split('~');
    // TODO: Every log has an empty index at the end. Fix it lol
    currentFighterLogs.pop();
    
    let logNodes = currentFighterLogs.map(function(log) {
      const logLines = log.split('&');
      const logTitle = logLines[0];
      // TODO: give the container div some sort of meaningful id/class
      
      let renderBattleLog = () => {
        setupBattleLogPage(logLines);
      };
      
      return (
        <li><a className="battleLog" href="#" onClick={renderBattleLog}>{logTitle}</a></li>
      );
    });
    
    
    // used to retrieve fighter logs
    const id = `${fighter.name}-${fighter.account}`;
    
    // if a fighter is dead, don't display it
    if(fighter.health != 0) return (
      <div key={fighter._id} className="fighter">
        <div className="col s3 m3">
          <div className="card clickable dark-purple lighten-1">
            <div className="card-content white-text modal-trigger" href={modalhrefId}>
              <span className="card-title">{fighter.name}</span>
              <p className="accountField">Created By {fighter.username}</p>
              <p className="levelField">Level {fighter.level}</p>
              <p>Health: {fighter.health}</p>
              <p>Damage: {fighter.damage}</p>
              <p>Speed: {fighter.speed}</p>
              <p>Armor: {fighter.armor}</p>
              <p>Crit Chance: {fighter.crit * 2}%</p>
            </div>
            <div id={modalhref} className="modal">
              <div className="modal-content card-content dark-purple lighten-1 white-text">
                  <a className="dropdown-trigger soft-violet right waves-effect waves-light" data-target={logId}>Logs</a><br></br>
                  <ul id={logId} className='dropdown-content'>
                    {logNodes}
                  </ul>
                  <span className="card-title">{fighter.name}</span>
                  <p className="accountField">Created By {fighter.username}</p>
                  <p className="levelField">Level {fighter.level}</p>
                  {/*<p>xp: {fighter.xp.toFixed(1)}/{fighter.xpToNext}</p>*/}
                  <p>Fights: {fighter.fights}</p>
                  <p>Wins: {fighter.wins}{/*({(100*fighter.wins/fighter.fights).toFixed(1)}%)*/}</p>
                  <p>Kills: {fighter.kills}</p>
                  <p>Revivals: {fighter.revivals}</p>
                  <br></br>
                  <p>Health: {fighter.health}</p>
                  <p>Damage: {fighter.damage}</p>
                  <p>Speed: {fighter.speed}</p>
                  <p>Armor: {fighter.armor}</p>
                  <p>Crit Chance: {fighter.crit * 2}%</p>
                  <br></br>
                  <a className="dropdown-trigger btn-floating btn-large soft-violet waves-effect waves-light" title={title} data-target={dropdownId}>Fight</a>
                  <ul id={dropdownId} title={title} className='dropdown-content'>
                    {yourFighterNodes}
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  
  return (
    <div className="fighterList row">
        <h5 className="emptyFighter">Click a Fighter to fight, or view more info</h5><br></br>
      {fighterNodes}
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </div>
  );
};

/// gets back all fighters owned by the current user from the server, then renders fighter list
const loadFightersFromServer = () => {
  let csrf = $("#_csrf").val();
  // get fighters
  sendAjax('GET', '/getFighters', null, (data) => {
    // get revives, so the user can know how many they have
    sendAjax('GET', '/getRevivals', null, (revivalData) => {
      ReactDOM.render(
        <YourFighterList fighters={data.fighters} revivals={revivalData.revivals} csrf={csrf} />,
        document.querySelector("#content")
      );
      
      // set up materialize elements
      $('.dropdown-trigger').dropdown();
    });
  });
};

const loadAllFightersFromServer = () => {
  let csrf = $("#_csrf").val();
  sendAjax('GET', '/getAllFighters', null, (data) => {
    sendAjax('GET', '/getFighters', null, (accountData) => {
      ReactDOM.render(
        <AllFighterList fighters={data.fighters} yourFighters={accountData.fighters} csrf={csrf} />,
        document.querySelector("#content")
      );
      
      // set up materialize elements
      $('.dropdown-trigger').dropdown();
      $('.modal').modal();
      
    });
  });
};

const setupFightersPage = function(csrf) {
  // ReactDOM.render(
  //   <AllFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through
  
  ReactDOM.render(
    <LoadingPage csrf={csrf} />, document.querySelector("#content")
  );
  
  loadAllFightersFromServer();
  
  updateUrl('/fighters');
};

const setupYourFightersPage = function(csrf) {
  // ReactDOM.render(
  //   <YourFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through
  
  ReactDOM.render(
    <LoadingPage csrf={csrf} />, document.querySelector("#content")
  );
  
  loadFightersFromServer();
  
  updateUrl('/yourFighters');
};

/// renders the create fighter page
const setupMakerPage = function(csrf) {
  ReactDOM.render(
    <FighterForm csrf={csrf} />, document.querySelector("#content")
  );
  
  // setup sliders
  setupMaterializeElements();
  
  updateUrl('/createFighter');
};

const setupBattleLogPage = function(logs) {
  let csrf = $("#_csrf").val();
  
  ReactDOM.render(
    <BattleLogForm csrf={csrf} logs={logs} />, document.querySelector("#content")
  );
};

const getMaxFighters = (callback) => {
  sendAjax('GET', '/getMaxFighters', null, (result) => callback);
};
