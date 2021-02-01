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


const DiamondIcon = function(props) {
  return (
    <div className="collection" id="diamondCollection">
      <a className="collection-item soft-violet" type="submit" onClick={setupBuyDiamondsPage}><img id="diamondImg" src="/assets/img/diamondIcon.png"></img><p id="diamondText">{props.diamonds}</p><i className="material-icons" id="addDiamondsBtn">add</i></a>
    </div>
  );
};

/// renders the change password page
const setupChangePassPage = function(csrf) {
  ReactDOM.render(
    <ChangePassForm csrf={csrf} />, document.querySelector("#content")
  );
  
  updateUrl('/changePass');
};

/// renders the store page
const setupStorePage = function(csrf) {
  // render the loading page before we ask the server for our items
  ReactDOM.render(
    <StorePage csrf={csrf} />, document.querySelector("#content")
  );
  
  // get diamonds
  sendAjax('GET', '/getRevivals', null, (data) => {
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
};