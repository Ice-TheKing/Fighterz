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

const BuyDiamondsPage = (props) => {
  return (
    <form id="buyDiamondsForm" name="buyDiamondsForm">
      <div className="container">
        <div className="row">
          <div className="col s4 m4">
            
            <div className="card">
              <div className="card-image">
                <img src="/assets/img/diamondsBkd.png"></img>
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue" id="100" onClick={handleBuyDiamonds}>$0.99</a>
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
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue" id="400" onClick={handleBuyDiamonds}>$3.49</a>
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
                <a className="btn-floating btn-large halfway-fab waves-effect waves-light soft-blue" id="2000" onClick={handleBuyDiamonds}>$14.99</a>
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
  
  // const fighterNodes = props.fighters.map(function(fighter) {
  //   return (
  //     <div key={fighter._id} className="fighter">
  //       <h3 className="fighterName"> Name: {fighter.name} </h3>
  //       <h3 className="fighterHealth"> Health: {fighter.health} </h3>
  //       <h3 className="fighterDamage"> Damage: {fighter.damage} </h3>
  //       <input type="submit" className="waves-effect waves-purple btn" value="Delete Fighter" name={fighter.name} onClick={handleDeleteClick} />
  //     </div>
  //   );
  // });
  
  const fighterNodes = props.fighters.map(function(fighter) {
    return (
      <div key={fighter._id} className="fighter">
        <div className="col s12 m12">
          <div className="card dark-purple lighten-1">
            <div className="card-content white-text">
              <span className="card-title">{fighter.name}</span>
              <p>Health: {fighter.health}</p>
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
  
  const fighterNodes = props.fighters.map(function(fighter) {
    return (
      <div key={fighter._id} className="fighter">
        <div className="col s3 m3">
          <div className="card dark-purple lighten-1">
            <div className="card-content white-text">
              <span className="card-title">{fighter.name}</span>
              <p id="accountField">Created By {fighter.username}</p>
              <p>Health: {fighter.health}</p>
              <p>Damage: {fighter.damage}</p>
              <p>Speed: {fighter.speed}</p>
              <p>Armor: {fighter.armor}</p>
              <p>Crit Chance: {fighter.crit * 2}%</p>
            </div>
            <div className="card-action">
              {/*<a name={fighter.name} onClick={handleDeleteClick}>Delete Fighter</a>*/}
            </div>
          </div>
        </div>      
      </div>
    );
  });
  
  return (
    <div className="fighterList row">
      {fighterNodes}
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
    </div>
  );
};

/// gets back all fighters owned by the current user from the server, then renders fighter list
const loadFightersFromServer = () => {
  let csrf = $("#_csrf").val();
  sendAjax('GET', '/getFighters', null, (data) => {
    ReactDOM.render(
      <YourFighterList fighters={data.fighters} csrf={csrf} />,
      document.querySelector("#content")
    );
  });
};

const loadAllFightersFromServer = () => {
  let csrf = $("#_csrf").val();
  sendAjax('GET', '/getAllFighters', null, (data) => {
    ReactDOM.render(
      <AllFighterList fighters={data.fighters} csrf={csrf} />,
      document.querySelector("#content")
    );
  });
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

/// renders the change password page
const setupChangePassPage = function(csrf) {
  ReactDOM.render(
    <ChangePassForm csrf={csrf} />, document.querySelector("#content")
  );
  
  updateUrl('/changePass');
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
    $('.collapsible').collapsible();
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

const resetForm = () => {
  
};

