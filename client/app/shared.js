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
