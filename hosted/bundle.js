'use strict';

/// sends request to create fighter
var handleFighter = function handleFighter(e) {
  e.preventDefault();

  var sliders = getSliders();

  // thought it was confusing enough to warrant its own error message ("wait but I set everything!")
  if (sliders.name == '') {
    sendToast('Fighter Name is required');
    return false;
  }

  if (sliders.health == '' || sliders.damage == '' || sliders.speed == '' || sliders.armor == '' || sliders.crit == '') {
    sendToast('All stats are required');
    return false;
  }

  sendAjax('POST', $("#fighterForm").attr("action"), $("#fighterForm").serialize(), function () {
    // loadFightersFromServer();
    // TODO: Show a success window and reset forms
    sendToast('Fighter created successfully');
    resetForm();
  });

  return false;
};

/// called by the delete html button
var handleDeleteClick = function handleDeleteClick(e) {
  DeleteFighter(e);
};

/// sends a delete request to the server
var DeleteFighter = function DeleteFighter(e) {
  var csrfToken = $("#_csrf").val();

  var currentFighter = {
    name: e.target.name,
    _csrf: csrfToken
  };

  sendAjax('POST', '/deleteFighter', currentFighter, function () {
    loadFightersFromServer();
  });
};

/// Create a fighter React page
var FighterForm = function FighterForm(props) {
  return React.createElement(
    'form',
    { id: 'fighterForm',
      onSubmit: handleFighter,
      name: 'fighterForm',
      action: '/maker',
      method: 'POST',
      className: 'fighterForm'
    },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'input-field col s12' },
        React.createElement('input', { id: 'fighterName', type: 'text', name: 'name' }),
        React.createElement(
          'label',
          { 'for': 'name' },
          'Fighter Name'
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'health' },
            React.createElement('input', { id: 'fighterHealth', name: 'health', value: '1', min: '1', max: '15' }),
            'Health'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'damage' },
            React.createElement('input', { type: 'range', id: 'fighterDamage', name: 'damage', min: '1', max: '15' }),
            'Damage'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'speed' },
            React.createElement('input', { type: 'range', id: 'fighterSpeed', name: 'speed', min: '1', max: '15' }),
            'Speed'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'armor' },
            React.createElement('input', { type: 'range', id: 'fighterArmor', name: 'armor', min: '1', max: '15' }),
            'Armor'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'p',
          { className: 'range-field' },
          React.createElement(
            'label',
            { 'for': 'crit' },
            React.createElement('input', { type: 'range', id: 'fighterCrit', name: 'crit', min: '1', max: '15' }),
            'Crit'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'input-field col s4' },
        React.createElement(
          'h6',
          { id: 'pointsField' },
          'Points Left: 31'
        )
      )
    ),
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'waves-effect waves-purple btn', type: 'submit', value: 'Create Fighter' })
  );
};

/// Page to render while the AJAX call comes back
var LoadingPage = function LoadingPage(props) {
  return React.createElement(
    'form',
    { id: 'loadingForm', name: 'loadingForm' },
    React.createElement(
      'div',
      { className: 'progress' },
      React.createElement('div', { className: 'indeterminate' })
    ),
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
  );
};

/// React page for change password page
var ChangePassForm = function ChangePassForm(props) {
  return React.createElement(
    'form',
    { id: 'changePassForm', name: 'changePassForm',
      onSubmit: handleChangePass,
      action: '/changePass',
      method: 'POST'
    },
    React.createElement(
      'label',
      { htmlFor: 'newPass' },
      'Current Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'newPass' },
      'New Password: '
    ),
    React.createElement('input', { id: 'newPass', type: 'password', name: 'newPass', placeholder: 'new password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Retype Password: '
    ),
    React.createElement('input', { id: 'newPass2', type: 'password', name: 'newPass2', placeholder: 'retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit waves-effect waves-purple btn', type: 'submit', value: 'Submit' })
  );
};

/// sends change password request to server
var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords must match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};

var AccountForm = function AccountForm(props) {
  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'form',
      { id: 'accountForm', name: 'accountForm',
        onSubmit: increaseMaxFighters,
        action: '/increaseMaxFighters',
        method: 'POST'
      },
      React.createElement(
        'div',
        null,
        React.createElement(
          'h5',
          null,
          'Max Fighters: ',
          props.maxFighters
        ),
        React.createElement(
          'p',
          null,
          React.createElement('input', { className: 'formSubmit waves-effect waves-purple btn', type: 'submit', value: 'Purchase 1 Additional Fighter Slot (80 diamonds)' })
        )
      ),
      React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
    ),
    React.createElement(
      'form',
      { id: 'changePassForm', name: 'changePassForm',
        onSubmit: handleChangePass,
        action: '/changePass',
        method: 'POST'
      },
      React.createElement('br', null),
      React.createElement('br', null),
      React.createElement(
        'h5',
        null,
        'Change Password:'
      ),
      React.createElement('br', null),
      React.createElement(
        'label',
        { htmlFor: 'newPass' },
        'Current Password: '
      ),
      React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
      React.createElement(
        'label',
        { htmlFor: 'newPass' },
        'New Password: '
      ),
      React.createElement('input', { id: 'newPass', type: 'password', name: 'newPass', placeholder: 'new password' }),
      React.createElement(
        'label',
        { htmlFor: 'pass2' },
        'Retype Password: '
      ),
      React.createElement('input', { id: 'newPass2', type: 'password', name: 'newPass2', placeholder: 'retype password' }),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('input', { className: 'formSubmit waves-effect waves-purple btn', type: 'submit', value: 'Submit' })
    )
  );
};

var BuyDiamondsPage = function BuyDiamondsPage(props) {
  return React.createElement(
    'form',
    { id: 'buyDiamondsForm', name: 'buyDiamondsForm' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col s4 m4' },
          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-image' },
              React.createElement('img', { src: '/assets/img/diamondsBkd.png' }),
              React.createElement(
                'a',
                { className: 'btn-floating btn-large halfway-fab waves-effect waves-light soft-blue', id: '100', onClick: handleBuyDiamonds },
                '$0.99'
              )
            ),
            React.createElement(
              'div',
              { className: 'card-title card-content' },
              React.createElement(
                'p',
                null,
                '100 Diamonds'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col s4 m4' },
          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-image' },
              React.createElement('img', { src: '/assets/img/diamondsBkd.png' }),
              React.createElement(
                'a',
                { className: 'btn-floating btn-large halfway-fab waves-effect waves-light soft-blue', id: '400', onClick: handleBuyDiamonds },
                '$3.49'
              )
            ),
            React.createElement(
              'div',
              { className: 'card-title card-content' },
              React.createElement(
                'p',
                null,
                '400 Diamonds'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col s4 m4' },
          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-image' },
              React.createElement('img', { src: '/assets/img/diamondsBkd.png' }),
              React.createElement(
                'a',
                { className: 'btn-floating btn-large halfway-fab waves-effect waves-light soft-blue', id: '2000', onClick: handleBuyDiamonds },
                '$14.99'
              )
            ),
            React.createElement(
              'div',
              { className: 'card-title card-content' },
              React.createElement(
                'p',
                null,
                '2000 Diamonds'
              )
            )
          )
        )
      )
    ),
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
  );
};

var handleBuyDiamonds = function handleBuyDiamonds(e) {
  var amount = Number(e.target.id);
  var csrf = $("#_csrf").val();

  sendAjax('POST', '/addDiamonds', 'diamonds=' + amount + '&_csrf=' + csrf, redirect);
};

var increaseMaxFighters = function increaseMaxFighters(e) {
  e.preventDefault();

  var csrf = $("#_csrf").val();

  sendAjax('POST', $("#accountForm").attr("action"), 'numFighters=1&_csrf=' + csrf, redirect);

  return false;
};

/// Renders all fighters owned by player
var YourFighterList = function YourFighterList(props) {
  if (props.fighters.length === 0) {
    return React.createElement(
      'div',
      { className: 'fighterList' },
      React.createElement(
        'h3',
        { className: 'emptyFighter' },
        'No Fighters yet'
      ),
      React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
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

  var fighterNodes = props.fighters.map(function (fighter) {
    return React.createElement(
      'div',
      { key: fighter._id, className: 'fighter' },
      React.createElement(
        'div',
        { className: 'col s12 m12' },
        React.createElement(
          'div',
          { className: 'card dark-purple lighten-1' },
          React.createElement(
            'div',
            { className: 'card-content white-text' },
            React.createElement(
              'span',
              { className: 'card-title' },
              fighter.name
            ),
            React.createElement(
              'p',
              null,
              'Health: ',
              fighter.health
            ),
            React.createElement(
              'p',
              null,
              'Damage: ',
              fighter.damage
            ),
            React.createElement(
              'p',
              null,
              'Speed: ',
              fighter.speed
            ),
            React.createElement(
              'p',
              null,
              'Armor: ',
              fighter.armor
            ),
            React.createElement(
              'p',
              null,
              'Crit Chance: ',
              fighter.crit * 2,
              '%'
            )
          ),
          React.createElement(
            'div',
            { className: 'card-action' },
            React.createElement(
              'a',
              { name: fighter.name, onClick: handleDeleteClick },
              'Delete Fighter'
            )
          )
        )
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'fighterList row' },
    fighterNodes,
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
  );
};

var AllFighterList = function AllFighterList(props) {
  if (props.fighters.length === 0) {
    return React.createElement(
      'div',
      { className: 'fighterList' },
      React.createElement(
        'h3',
        { className: 'emptyFighter' },
        'No Fighters yet'
      ),
      React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
    );
  }

  var fighterNodes = props.fighters.map(function (fighter) {
    return React.createElement(
      'div',
      { key: fighter._id, className: 'fighter' },
      React.createElement(
        'div',
        { className: 'col s3 m3' },
        React.createElement(
          'div',
          { className: 'card dark-purple lighten-1' },
          React.createElement(
            'div',
            { className: 'card-content white-text' },
            React.createElement(
              'span',
              { className: 'card-title' },
              fighter.name
            ),
            React.createElement(
              'p',
              { id: 'accountField' },
              'Created By ',
              fighter.username
            ),
            React.createElement(
              'p',
              null,
              'Health: ',
              fighter.health
            ),
            React.createElement(
              'p',
              null,
              'Damage: ',
              fighter.damage
            ),
            React.createElement(
              'p',
              null,
              'Speed: ',
              fighter.speed
            ),
            React.createElement(
              'p',
              null,
              'Armor: ',
              fighter.armor
            ),
            React.createElement(
              'p',
              null,
              'Crit Chance: ',
              fighter.crit * 2,
              '%'
            )
          ),
          React.createElement('div', { className: 'card-action' })
        )
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'fighterList row' },
    fighterNodes,
    React.createElement('input', { type: 'hidden', id: '_csrf', name: '_csrf', value: props.csrf })
  );
};

/// gets back all fighters owned by the current user from the server, then renders fighter list
var loadFightersFromServer = function loadFightersFromServer() {
  var csrf = $("#_csrf").val();
  sendAjax('GET', '/getFighters', null, function (data) {
    ReactDOM.render(React.createElement(YourFighterList, { fighters: data.fighters, csrf: csrf }), document.querySelector("#content"));
  });
};

var loadAllFightersFromServer = function loadAllFightersFromServer() {
  var csrf = $("#_csrf").val();
  sendAjax('GET', '/getAllFighters', null, function (data) {
    ReactDOM.render(React.createElement(AllFighterList, { fighters: data.fighters, csrf: csrf }), document.querySelector("#content"));
  });
};

/// renders the create fighter page
var setupMakerPage = function setupMakerPage(csrf) {
  ReactDOM.render(React.createElement(FighterForm, { csrf: csrf }), document.querySelector("#content"));

  // setup sliders
  setupMaterializeElements();

  updateUrl('/createFighter');
};

/// renders the change password page
var setupChangePassPage = function setupChangePassPage(csrf) {
  ReactDOM.render(React.createElement(ChangePassForm, { csrf: csrf }), document.querySelector("#content"));

  updateUrl('/changePass');
};

var setupYourFightersPage = function setupYourFightersPage(csrf) {
  // ReactDOM.render(
  //   <YourFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through

  ReactDOM.render(React.createElement(LoadingPage, { csrf: csrf }), document.querySelector("#content"));

  loadFightersFromServer();

  updateUrl('/yourFighters');
};

var setupFightersPage = function setupFightersPage(csrf) {
  // ReactDOM.render(
  //   <AllFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through

  ReactDOM.render(React.createElement(LoadingPage, { csrf: csrf }), document.querySelector("#content"));

  loadAllFightersFromServer();

  updateUrl('/fighters');
};

var setupAccountPage = function setupAccountPage(csrf) {
  ReactDOM.render(React.createElement(LoadingPage, { csrf: csrf }), document.querySelector("#content"));

  // get current number of fighters
  sendAjax('GET', '/getMaxFighters', null, function (result) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf, maxFighters: result.maxFighters }), document.querySelector("#content"));

    // initialize materialize elements
    $('.collapsible').collapsible();
  });

  updateUrl('/account');
};

var setupBuyDiamondsPage = function setupBuyDiamondsPage(csrf) {
  csrf = $("#_csrf").val();

  ReactDOM.render(React.createElement(BuyDiamondsPage, { csrf: csrf }), document.querySelector("#content"));

  updateUrl('/buyDiamonds', setupBuyDiamondsPage);
};

/// sets up click events for the navigation buttons to re-render the page with react
var setupNavButtons = function setupNavButtons(csrf) {
  var makerButton = document.querySelector("#makerButton");
  // const changePassButton = document.querySelector("#changePassButton");
  var yourFightersButton = document.querySelector("#yourFightersButton");
  var fightersButton = document.querySelector("#fightersButton");
  var accountButton = document.querySelector("#accountButton");

  makerButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupMakerPage(csrf);
    return false;
  });

  // changePassButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   setupChangePassPage(csrf);
  //   return false;
  // });

  yourFightersButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupYourFightersPage(csrf);
    return false;
  });

  fightersButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupFightersPage(csrf);
    return false;
  });

  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupAccountPage(csrf);
    return false;
  });
};

/// request a csrfToken
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupNavButtons(result.csrfToken);
    setupFightersPage(result.csrfToken);
    setupIcons();
  });
};

var getUsername = function getUsername() {
  sendAjax('GET', '/getUsername', null, function (result) {
    return result.username;
  });
};

var getMaxFighters = function getMaxFighters(callback) {
  sendAjax('GET', '/getMaxFighters', null, function (result) {
    return callback;
  });
};

var DiamondIcon = function DiamondIcon(props) {
  return React.createElement(
    'div',
    { className: 'collection', id: 'diamondCollection' },
    React.createElement(
      'a',
      { className: 'collection-item soft-violet', type: 'submit', onClick: setupBuyDiamondsPage },
      React.createElement('img', { id: 'diamondImg', src: '/assets/img/diamondIcon.png' }),
      React.createElement(
        'p',
        { id: 'diamondText' },
        props.diamonds
      ),
      React.createElement(
        'i',
        { className: 'material-icons', id: 'addDiamondsBtn' },
        'add'
      )
    )
  );
};

var setupIcons = function setupIcons() {
  // get number of diamonds
  sendAjax('GET', '/getDiamonds', null, function (result) {
    var diamonds = result.diamonds;

    // get the navbar
    var rightNav = document.querySelector("#right-nav");
    var leftNav = document.querySelector("#left-nav");

    // Div to render the diamond icon to
    var diamondDiv = document.createElement('div');
    diamondDiv.setAttribute('id', 'diamondIcon');
    rightNav.insertBefore(diamondDiv, rightNav.firstChild);

    // render the icon in the div we just made
    ReactDOM.render(React.createElement(DiamondIcon, { diamonds: result.diamonds }), document.querySelector("#diamondIcon"));
  });
};

/// as soon as the document loads
$(document).ready(function () {
  getToken();
  getUsername();
});

/* Sliders for Create Page */
// (yes its that difficult lol)

/// setup the sliders with materialize and kendoui
var setupMaterializeElements = function setupMaterializeElements() {
  var slideHealth = function slideHealth(e) {
    return slidePoints(e, 'health');
  };
  var slideDamage = function slideDamage(e) {
    return slidePoints(e, 'damage');
  };
  var slideSpeed = function slideSpeed(e) {
    return slidePoints(e, 'speed');
  };
  var slideArmor = function slideArmor(e) {
    return slidePoints(e, 'armor');
  };
  var slideCrit = function slideCrit(e) {
    return slidePoints(e, 'crit');
  };

  var health = $("#fighterHealth").kendoSlider({
    change: updatePoints,
    slide: slideHealth,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var damage = $("#fighterDamage").kendoSlider({
    change: updatePoints,
    slide: slideDamage,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var speed = $("#fighterSpeed").kendoSlider({
    change: updatePoints,
    slide: slideSpeed,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var armor = $("#fighterArmor").kendoSlider({
    change: updatePoints,
    slide: slideArmor,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
  var crit = $("#fighterCrit").kendoSlider({
    change: updatePoints,
    slide: slideCrit,
    showButtons: false,
    min: 1,
    max: 15,
    smallStep: 1,
    largeStep: 0
  }).data("kendoSlider");
};

var updatePoints = function updatePoints(e) {
  var sliders = getSliders();
  var newPoints = 36 - sliders.health - sliders.damage - sliders.speed - sliders.armor - sliders.crit;
  pointsField.textContent = 'Points Left: ' + newPoints;
};

/// since when we slide, e.value just gives the int value of the current slider and we don't know which is active, 
/// we have to make a switch statement for everything that it could be, substituting e.value for that stat so we don't add it twice
var slidePoints = function slidePoints(e, text) {
  var sliders = getSliders();
  var newPoints = 36;
  switch (text) {
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
  pointsField.textContent = 'Points Left: ' + newPoints;
};

/// helper function to easily retrieve values from the stat sliders in the creator app
var getSliders = function getSliders() {
  var sliders = {};
  sliders.name = $("#fighterName").val();
  sliders.health = $("#fighterHealth").val();
  sliders.damage = $("#fighterDamage").val();
  sliders.speed = $("#fighterSpeed").val();
  sliders.armor = $("#fighterArmor").val();
  sliders.crit = $("#fighterCrit").val();
  return sliders;
};

var resetForm = function resetForm() {};
'use strict';

var handleError = function handleError(message) {
  M.toast({ html: '' + message });
};

/// same thing as handle error. Just replacing it
var sendToast = function sendToast(message) {
  M.toast({ html: '' + message });
};

/// either redirects, sends a toast, or both
var redirect = function redirect(response) {
  if (response.redirect) {
    window.location = response.redirect;
  }

  if (response.message) {
    sendToast(response.message);
  }
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      sendToast(messageObj.error);
    }
  });
};

// turns an object with properties into 'key=value&key2=value2' string
var urlEncodeObject = function urlEncodeObject(object) {
  return Object.keys(object).map(function (key) {
    return key + '=' + object[key];
  }).join('&');
};

var updateUrl = function updateUrl(url, state) {
  var stateObj = { state: url };
  history.pushState(stateObj, '', url);
};
