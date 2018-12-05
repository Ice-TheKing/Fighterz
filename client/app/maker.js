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
              <input id="fighterHealth" name="health" value="1" min="1" max="15"/>
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

/// React page for change password page
const ChangePassForm = (props) => {
  return (
    <form id="changePassForm" name="changePassForm"
          onSubmit={handleChangePass}
          action="/changePass"
          method="POST"
      >
      <label htmlFor="newPass">Current Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="newPass">New Password: </label>
      <input id="newPass" type="password" name="newPass" placeholder="new password" />
      <label htmlFor="pass2">Retype Password: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit waves-effect waves-purple btn" type="submit" value="Submit" />
    </form>      
  );
};

/// sends change password request to server
const handleChangePass = (e) => {
  e.preventDefault();
  
  if($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  if($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords must match");
    return false;
  }
  
  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  
  return false;
};

const AccountForm = (props) => {
  return (
    <div className="container">
      <form id="accountForm" name="accountForm"
            onSubmit={increaseMaxFighters}
            action="/increaseMaxFighters"
            method="POST"
        >
        
        <div>
          {/* Number of Fighters */}
          <h5>
            Max Fighters: {props.maxFighters}
          </h5>
          <p>
            {/* Button for purchasing additional fighters */}
            <input className="formSubmit waves-effect waves-purple btn" type="submit" value="Purchase 1 Additional Fighter Slot (80 diamonds)" />
          </p>
        </div>
        <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      </form>
      <form id="changePassForm" name="changePassForm"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
        >
        <br></br><br></br>
        <h5>Change Password:</h5>
        <br></br>
        <label htmlFor="newPass">Current Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <label htmlFor="newPass">New Password: </label>
        <input id="newPass" type="password" name="newPass" placeholder="new password" />
        <label htmlFor="pass2">Retype Password: </label>
        <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit waves-effect waves-purple btn" type="submit" value="Submit" />
      </form>    
    </div>
  );
};

const StorePage = (props) => {
  return (
    <div className="container">
      <form id="storeForm" name="storeForm">
        <div className="row">
          <div className = "col s4 m4">
            <div className="card">
              <div className="card-image">
                <img src="/assets/img/revivalBkd.png"></img>
              </div>
              <div className="card-title card-content">
                <p>Revival - {props.revivals}</p>
              </div>
              <div className="card-action">
                <a className="waves-effect waves-light btn" onClick={handleBuyRevival}>80 <img className="inlineImg" src="/assets/img/diamondTiny.png"></img></a>
              </div>
            </div>
          </div>
        </div>
        <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      </form>
    </div>
  );
};

const handleBuyRevival = (e) => {
  let csrf = $("#_csrf").val();
  sendAjax('POST', '/addRevivals', `revivals=1&_csrf=${csrf}`, redirect);
};

const BuyDiamondsPage = (props) => {
  return (
    <form id="buyDiamondsForm" name="buyDiamondsForm">
      <div className="container">
        <div className="row">
          <div className="col s4 m4">
            
            <div className="card">
              <div className="card-image">
                <img src="/assets/img/diamondsBkd.png"></img>
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse" id="100" onClick={handleBuyDiamonds}>$0.99</a>
              </div>
              <div className="card-title card-content">
                <p>100 Diamonds</p>
              </div>
            </div>
          </div>
          <div className="col s4 m4">
            <div className="card">
              <div className="card-image">
                <img src="/assets/img/diamondsBkd.png"></img>
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse" id="400" onClick={handleBuyDiamonds}>$3.49</a>
              </div>
              <div className="card-title card-content">
                <p>400 Diamonds</p>
              </div>
            </div>
          </div>
          <div className="col s4 m4">
            <div className="card">
              <div className="card-image">
                <img src="/assets/img/diamondsBkd.png"></img>
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse" id="2000" onClick={handleBuyDiamonds}>$14.99</a>
              </div>
              <div className="card-title card-content">
                <p>2000 Diamonds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </form>
  );
};

const handleBuyDiamonds = (e) => {
  const amount = Number(e.target.id);
  const csrf = $("#_csrf").val();
  
  sendAjax('POST', '/addDiamonds', `diamonds=${amount}&_csrf=${csrf}`, redirect);
};

const increaseMaxFighters = (e) => {
  e.preventDefault();
  
  let csrf = $("#_csrf").val();
  
  sendAjax('POST', $("#accountForm").attr("action"), `numFighters=1&_csrf=${csrf}`, redirect);
  
  return false;
};

const startFight = (e) => {
  // console.dir(e.target.id);
  // console.dir(e.target.parentElement.parentElement.title);
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
  // console.dir(e.target.id);
  // format for id is 'fighterName-stat'
  // so we just have to split it to get the pieces of the form
  const nameStat = e.target.id.split("-");
  const name = nameStat[0];
  const stat = nameStat[1];
  const csrf = $("#_csrf").val();
  
  let form = `name=${name}`;
  form = `${form}&stat=${stat}`;
  form = `${form}&_csrf=${csrf}`;
  // console.dir(`name: ${name} account:${acct} stat: ${stat}`);
  
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
      
      return (
        <div key={fighter._id} className="fighter">
          <div className="col s12 m12">
            <div className="card dark-purple lighten-1">
              <div className="card-content white-text">
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
                <p>Wins: {fighter.wins}{/*({(100*fighter.wins/fighter.fights).toFixed(1)}%)*/}</p>
                <p>Fights: {fighter.fights}</p>
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
  
  let i = 0;  
  const fighterNodes = props.fighters.map(function(fighter) {
    // have to use some sort of iterator to key each dropdown lists ids, otherwise some dropdowns
    // might refer to a random different dropdown
    i++;
    const dropdownId = `dropdown${i}-${fighter.account}`;
    const title = `${fighter.name}-${fighter.account}`;
    
    // for setting up each card as a modal
    const modalhref = `modal${i}`;
    const modalhrefId = `#${modalhref}`;
    
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
              {/*<br></br>
              <a className="dropdown-trigger btn-floating btn-large soft-violet waves-effect waves-light" data-target={dropdownId}>Fight</a>
                <ul id={dropdownId} title={title} className='dropdown-content'>
                  {yourFighterNodes}
                </ul>*/}
            </div>
            <div id={modalhref} className="modal">
              <div className="modal-content card-content dark-purple lighten-1 white-text">
                  <span className="card-title">{fighter.name}</span>
                  <p className="accountField">Created By {fighter.username}</p>
                  <p className="levelField">Level {fighter.level}</p>
                  <p>xp: {fighter.xp.toFixed(1)}/{fighter.xpToNext}</p>
                  <p>Wins: {fighter.wins}{/*({(100*fighter.wins/fighter.fights).toFixed(1)}%)*/}</p>
                  <p>Fights: {fighter.fights}</p>
                  <p>Kills: {fighter.kills}</p>
                  <p>Revivals: {fighter.revivals}</p>
                  <br></br>
                  <p>Health: {fighter.health}</p>
                  <p>Damage: {fighter.damage}</p>
                  <p>Speed: {fighter.speed}</p>
                  <p>Armor: {fighter.armor}</p>
                  <p>Crit Chance: {fighter.crit * 2}%</p>
                  <br></br>
                  <a className="dropdown-trigger btn-floating btn-large soft-violet waves-effect waves-light" data-target={dropdownId}>Fight</a>
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

/// renders the change password page
const setupChangePassPage = function(csrf) {
  ReactDOM.render(
    <ChangePassForm csrf={csrf} />, document.querySelector("#content")
  );
  
  updateUrl('/changePass');
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

/// renders the store page
const setupStorePage = function(csrf) {
  // render the loading page before we ask the server for our items
  ReactDOM.render(
    <StorePage csrf={csrf} />, document.querySelector("#content")
  );
  
  // get diamonds
  sendAjax('GET', '/getRevivals', null, (data) => {
    console.dir(data.revivals);
    ReactDOM.render(
      <StorePage csrf={csrf} revivals={data.revivals} />, document.querySelector("#content")
    );
  });
  
  updateUrl('/store');
};

const setupAccountPage = function(csrf) {
  ReactDOM.render(
    <LoadingPage csrf={csrf} />, document.querySelector("#content")
  );
  
  // get current number of fighters
  sendAjax('GET', '/getMaxFighters', null, (result) => {
    ReactDOM.render(
      <AccountForm csrf={csrf} maxFighters={result.maxFighters} />, document.querySelector("#content")
    );
    
    // initialize materialize elements
    // $('.collapsible').collapsible();
  });
  
  updateUrl('/account');
};

const setupBuyDiamondsPage = function(csrf) {
  csrf = $("#_csrf").val();
  
  ReactDOM.render(
    <BuyDiamondsPage csrf={csrf} />, document.querySelector("#content")
  );
  
  updateUrl('/buyDiamonds', setupBuyDiamondsPage);
}

/// sets up click events for the navigation buttons to re-render the page with react
const setupNavButtons = function(csrf) {
  const makerButton = document.querySelector("#makerButton");
  // const changePassButton = document.querySelector("#changePassButton");
  const yourFightersButton = document.querySelector("#yourFightersButton");
  const fightersButton = document.querySelector("#fightersButton");
  const accountButton = document.querySelector("#accountButton");
  const storeButton = document.querySelector("#storeButton");
  
  makerButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupMakerPage(csrf);
    return false;
  });
    
  // changePassButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   setupChangePassPage(csrf);
  //   return false;
  // });
  
  yourFightersButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupYourFightersPage(csrf);
    return false;
  });
  
  fightersButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupFightersPage(csrf);
    return false;
  });
  
  storeButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupStorePage(csrf);
    return false;
  });
  
  accountButton.addEventListener("click", (e) => {
    e.preventDefault();
    setupAccountPage(csrf);    
    return false;
  });
};

/// request a csrfToken
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupNavButtons(result.csrfToken);
    setupFightersPage(result.csrfToken);
    setupIcons();
  });
};

const getUsername = () => {
  sendAjax('GET', '/getUsername', null, (result) => {
    return result.username;
  });
};

const getMaxFighters = (callback) => {
  sendAjax('GET', '/getMaxFighters', null, (result) => callback);
};

const DiamondIcon = function(props) {
  return (
    <div className="collection" id="diamondCollection">
      <a className="collection-item soft-violet" type="submit" onClick={setupBuyDiamondsPage}><img id="diamondImg" src="/assets/img/diamondIcon.png"></img><p id="diamondText">{props.diamonds}</p><i className="material-icons" id="addDiamondsBtn">add</i></a>
    </div>
  );
};

const setupIcons = () => {
  // get number of diamonds
  sendAjax('GET', '/getDiamonds', null, (result) => {
    const diamonds = result.diamonds;
    
    // get the navbar
    const rightNav = document.querySelector("#right-nav");
    const leftNav = document.querySelector("#left-nav");
    
    // Div to render the diamond icon to
    let diamondDiv = document.createElement('div');
    diamondDiv.setAttribute('id', 'diamondIcon');
    rightNav.insertBefore(diamondDiv, rightNav.firstChild);
    
    // render the icon in the div we just made
    ReactDOM.render(
      <DiamondIcon diamonds={result.diamonds} />, document.querySelector("#diamondIcon")
    );
  });
};

/// as soon as the document loads
$(document).ready(function() {
  getToken();
  getUsername();
});

/* Sliders for Create Page */
// (yes its that difficult lol)

/// setup the sliders with materialize and kendoui
const setupMaterializeElements = () => {
  const slideHealth = (e) => slidePoints(e, 'health');
  const slideDamage = (e) => slidePoints(e, 'damage');
  const slideSpeed = (e) => slidePoints(e, 'speed');
  const slideArmor = (e) => slidePoints(e, 'armor');
  const slideCrit = (e) => slidePoints(e, 'crit');
  
  let health = $("#fighterHealth").kendoSlider({
    change: updatePoints,
    slide: slideHealth,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let damage = $("#fighterDamage").kendoSlider({
    change: updatePoints,
    slide: slideDamage,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let speed = $("#fighterSpeed").kendoSlider({
    change: updatePoints,
    slide: slideSpeed,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let armor = $("#fighterArmor").kendoSlider({
    change: updatePoints,
    slide: slideArmor,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
  let crit = $("#fighterCrit").kendoSlider({
    change: updatePoints,
    slide: slideCrit,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0,
  }).data("kendoSlider");
};

const updatePoints = (e) => {
  const sliders = getSliders();
  let newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
  pointsField.textContent = `Points Left: ${newPoints}`;
};

/// since when we slide, e.value just gives the int value of the current slider and we don't know which is active, 
/// we have to make a switch statement for everything that it could be, substituting e.value for that stat so we don't add it twice
const slidePoints = (e, text) => {
  const sliders = getSliders();
  let newPoints = 36;
  switch(text) {
    case 'health':
      newPoints = 36 - e.value - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
      break;
    case 'damage':
      newPoints = 36 - sliders.health - e.value - sliders.speed - sliders.armor - sliders.crit;
      break;
    case 'speed':
      newPoints = 36 - sliders.health - sliders.damage - e.value - sliders.armor - sliders.crit;
      break;
    case 'armor':
      newPoints = 36 - sliders.health - sliders.damage - sliders.speed - e.value - sliders.crit;
      break;
    case 'crit':
      newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - e.value;
      break;
    default:
      newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
      break;
  }
  pointsField.textContent = `Points Left: ${newPoints}`;
};

/// helper function to easily retrieve values from the stat sliders in the creator app
const getSliders = () => {
  const sliders = {};
  sliders.name = $("#fighterName").val();
  sliders.health = $("#fighterHealth").val();
  sliders.damage = $("#fighterDamage").val();
  sliders.speed = $("#fighterSpeed").val();
  sliders.armor = $("#fighterArmor").val();
  sliders.crit = $("#fighterCrit").val();
  return sliders;
};

// clears the create a fighter form
const resetForm = () => {
  
};

