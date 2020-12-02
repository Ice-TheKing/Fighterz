"use strict";

/// sends request to create fighter
var handleFighter = function handleFighter(e) {
  e.preventDefault();
  var sliders = getSliders(); // thought it was confusing enough to warrant its own error message ("wait but I set everything!")

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
}; /// called by the delete html button


var handleDeleteClick = function handleDeleteClick(e) {
  DeleteFighter(e);
}; /// sends a delete request to the server


var DeleteFighter = function DeleteFighter(e) {
  var csrfToken = $("#_csrf").val();
  var currentFighter = {
    name: e.target.name,
    _csrf: csrfToken
  };
  sendAjax('POST', '/deleteFighter', currentFighter, function () {
    loadFightersFromServer();
  });
}; /// Create a fighter React page


var FighterForm = function FighterForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "fighterForm",
    onSubmit: handleFighter,
    name: "fighterForm",
    action: "/maker",
    method: "POST",
    className: "fighterForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "input-field col s12"
  }, /*#__PURE__*/React.createElement("input", {
    id: "fighterName",
    type: "text",
    name: "name"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "name"
  }, "Fighter Name")), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "range-field"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "health"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: "fighterHealth",
    name: "health",
    min: "1",
    max: "15"
  }), "Health"))), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "range-field"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "damage"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: "fighterDamage",
    name: "damage",
    min: "1",
    max: "15"
  }), "Damage"))), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "range-field"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "speed"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: "fighterSpeed",
    name: "speed",
    min: "1",
    max: "15"
  }), "Speed"))), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "range-field"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "armor"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: "fighterArmor",
    name: "armor",
    min: "1",
    max: "15"
  }), "Armor"))), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "range-field"
  }, /*#__PURE__*/React.createElement("label", {
    "for": "crit"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: "fighterCrit",
    name: "crit",
    min: "1",
    max: "15"
  }), "Crit"))), /*#__PURE__*/React.createElement("div", {
    className: "input-field col s4"
  }, /*#__PURE__*/React.createElement("h6", {
    id: "pointsField"
  }, "Points Left: 31"))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "waves-effect waves-purple btn",
    type: "submit",
    value: "Create Fighter"
  }));
}; /// Page to render while the AJAX call comes back


var LoadingPage = function LoadingPage(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loadingForm",
    name: "loadingForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "indeterminate"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  }));
}; /// React page for change password page


var ChangePassForm = function ChangePassForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePass",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "Current Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit waves-effect waves-purple btn",
    type: "submit",
    value: "Submit"
  }));
}; /// sends change password request to server


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
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("form", {
    id: "accountForm",
    name: "accountForm",
    onSubmit: increaseMaxFighters,
    action: "/increaseMaxFighters",
    method: "POST"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Max Fighters: ", props.maxFighters), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("input", {
    className: "formSubmit waves-effect waves-purple btn",
    type: "submit",
    value: "Purchase 1 Additional Fighter Slot (80 diamonds)"
  }))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  })), /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePass",
    method: "POST"
  }, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h5", null, "Change Password:"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "Current Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit waves-effect waves-purple btn",
    type: "submit",
    value: "Submit"
  })));
};

var StorePage = function StorePage(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("form", {
    id: "storeForm",
    name: "storeForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col s4 m4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/revivalBkd.png"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-title card-content"
  }, /*#__PURE__*/React.createElement("p", null, "Revival - ", props.revivals)), /*#__PURE__*/React.createElement("div", {
    className: "card-action"
  }, /*#__PURE__*/React.createElement("a", {
    className: "waves-effect waves-light btn",
    onClick: handleBuyRevival
  }, "80 ", /*#__PURE__*/React.createElement("img", {
    className: "inlineImg",
    src: "/assets/img/diamondTiny.png"
  })))))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  })));
};

var handleBuyRevival = function handleBuyRevival(e) {
  var csrf = $("#_csrf").val();
  sendAjax('POST', '/addRevivals', "revivals=1&_csrf=".concat(csrf), redirect);
};

var BuyDiamondsPage = function BuyDiamondsPage(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "buyDiamondsForm",
    name: "buyDiamondsForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col s4 m4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/diamondsBkd.png"
  }), /*#__PURE__*/React.createElement("a", {
    className: "btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse",
    id: "100",
    onClick: handleBuyDiamonds
  }, "$0.99")), /*#__PURE__*/React.createElement("div", {
    className: "card-title card-content"
  }, /*#__PURE__*/React.createElement("p", null, "100 Diamonds")))), /*#__PURE__*/React.createElement("div", {
    className: "col s4 m4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/diamondsBkd.png"
  }), /*#__PURE__*/React.createElement("a", {
    className: "btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse",
    id: "400",
    onClick: handleBuyDiamonds
  }, "$3.49")), /*#__PURE__*/React.createElement("div", {
    className: "card-title card-content"
  }, /*#__PURE__*/React.createElement("p", null, "400 Diamonds")))), /*#__PURE__*/React.createElement("div", {
    className: "col s4 m4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/diamondsBkd.png"
  }), /*#__PURE__*/React.createElement("a", {
    className: "btn-floating btn-large halfway-fab waves-effect waves-light soft-blue pulse",
    id: "2000",
    onClick: handleBuyDiamonds
  }, "$14.99")), /*#__PURE__*/React.createElement("div", {
    className: "card-title card-content"
  }, /*#__PURE__*/React.createElement("p", null, "2000 Diamonds")))))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  }));
};

var handleBuyDiamonds = function handleBuyDiamonds(e) {
  var amount = Number(e.target.id);
  var csrf = $("#_csrf").val();
  sendAjax('POST', '/addDiamonds', "diamonds=".concat(amount, "&_csrf=").concat(csrf), redirect);
};

var increaseMaxFighters = function increaseMaxFighters(e) {
  e.preventDefault();
  var csrf = $("#_csrf").val();
  sendAjax('POST', $("#accountForm").attr("action"), "numFighters=1&_csrf=".concat(csrf), redirect);
  return false;
};

var startFight = function startFight(e) {
  // console.dir(e.target.id);
  // console.dir(e.target.parentElement.parentElement.title);
  var ourFighter = e.target.parentElement.parentElement.title.split("-");
  var theirFighter = e.target.id.split("-");
  var csrf = $("#_csrf").val();
  var form = "fighterName1=".concat(ourFighter[0]);
  form = "".concat(form, "&fighterId1=").concat(ourFighter[1]);
  form = "".concat(form, "&fighterName2=").concat(theirFighter[0]);
  form = "".concat(form, "&fighterId2=").concat(theirFighter[1]);
  form = "".concat(form, "&_csrf=").concat(csrf);
  sendAjax('POST', '/fight', "".concat(form), redirect);
};

var handleUpgrade = function handleUpgrade(e) {
  // console.dir(e.target.id);
  // format for id is 'fighterName-stat'
  // so we just have to split it to get the pieces of the form
  var nameStat = e.target.id.split("-");
  var name = nameStat[0];
  var stat = nameStat[1];
  var csrf = $("#_csrf").val();
  var form = "name=".concat(name);
  form = "".concat(form, "&stat=").concat(stat);
  form = "".concat(form, "&_csrf=").concat(csrf); // console.dir(`name: ${name} account:${acct} stat: ${stat}`);
  // send the ajax

  sendAjax('POST', '/upgradeFighter', "".concat(form), function () {
    loadFightersFromServer();
  });
};

var handleRevive = function handleRevive(e) {
  var csrfToken = $("#_csrf").val();
  var currentFighter = {
    name: e.target.name,
    _csrf: csrfToken
  };
  sendAjax('POST', '/reviveFighter', currentFighter, function () {
    sendToast('Fighter has been revived');
    loadFightersFromServer();
  });
}; /// Renders all fighters owned by player


var YourFighterList = function YourFighterList(props) {
  if (props.fighters.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fighterList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyFighter"
    }, "No Fighters yet"), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      id: "_csrf",
      name: "_csrf",
      value: props.csrf
    }));
  }

  var fighterNodes = props.fighters.map(function (fighter) {
    // check to see if the fighter has level up points available
    // don't let players upgrade dead fighters lol
    if (fighter.levelupPts > 0 && fighter.health != 0) {
      // ids for upgrading stats
      var healthId = "".concat(fighter.name, "-health");
      var damageId = "".concat(fighter.name, "-damage");
      var speedId = "".concat(fighter.name, "-speed");
      var armorId = "".concat(fighter.name, "-armor");
      var critId = "".concat(fighter.name, "-crit"); // displayed as the fighter level, so the user knows how many points they have to spend

      var fighterLevel = "".concat(fighter.level - fighter.levelupPts, " + ").concat(fighter.levelupPts);
      return /*#__PURE__*/React.createElement("div", {
        key: fighter._id,
        className: "fighter"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col s12 m12"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card dark-purple lighten-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card-content white-text"
      }, /*#__PURE__*/React.createElement("span", {
        className: "card-title"
      }, fighter.name), /*#__PURE__*/React.createElement("p", null), /*#__PURE__*/React.createElement("p", {
        className: "levelField"
      }, "Level ", fighterLevel), /*#__PURE__*/React.createElement("p", null, "xp: ", fighter.xp.toFixed(1), "/", fighter.xpToNext), /*#__PURE__*/React.createElement("p", null, "Wins: ", fighter.wins), /*#__PURE__*/React.createElement("p", null, "Fights: ", fighter.fights), /*#__PURE__*/React.createElement("p", null, "Kills: ", fighter.kills), /*#__PURE__*/React.createElement("p", null, "Revivals: ", fighter.revivals), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Health: ", fighter.health, /*#__PURE__*/React.createElement("i", {
        id: healthId,
        className: "tiny material-icons upgradebtn",
        onClick: handleUpgrade
      }, "add")), /*#__PURE__*/React.createElement("p", null, "Damage: ", fighter.damage, /*#__PURE__*/React.createElement("i", {
        id: damageId,
        className: "tiny material-icons upgradebtn",
        onClick: handleUpgrade
      }, "add")), /*#__PURE__*/React.createElement("p", null, "Speed: ", fighter.speed, /*#__PURE__*/React.createElement("i", {
        id: speedId,
        className: "tiny material-icons upgradebtn",
        onClick: handleUpgrade
      }, "add")), /*#__PURE__*/React.createElement("p", null, "Armor: ", fighter.armor, /*#__PURE__*/React.createElement("i", {
        id: armorId,
        className: "tiny material-icons upgradebtn",
        onClick: handleUpgrade
      }, "add")), /*#__PURE__*/React.createElement("p", null, "Crit Chance: ", fighter.crit * 2, "% ", /*#__PURE__*/React.createElement("i", {
        id: critId,
        className: "tiny material-icons upgradebtn",
        onClick: handleUpgrade
      }, "add"))), /*#__PURE__*/React.createElement("div", {
        className: "card-action"
      }, /*#__PURE__*/React.createElement("a", {
        name: fighter.name,
        onClick: handleDeleteClick
      }, "Delete Fighter")))));
    } else {
      // fighter name changes depending on if they are dead or not
      var fighterName = fighter.name;
      var health = fighter.health;
      var reviveBtn = /*#__PURE__*/React.createElement("p", null); // if the fighter is dead, change the way its displayed

      if (fighter.health == 0) {
        // change the name of the fighter to tell the user the fighter is dead
        fighterName = "".concat(fighter.name, " (dead)"); // make the health display 0/maxHealth

        health = "".concat(fighter.health, "/").concat(fighter.maxHealth); // make a revive button

        reviveBtn = /*#__PURE__*/React.createElement("a", {
          name: fighter.name,
          className: "waves-effect waves-light btn",
          onClick: handleRevive
        }, "Revive (", props.revivals, ")");
      }

      return /*#__PURE__*/React.createElement("div", {
        key: fighter._id,
        className: "fighter"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col s12 m12"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card dark-purple lighten-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card-content white-text"
      }, /*#__PURE__*/React.createElement("span", {
        className: "card-title fighterName"
      }, fighterName), reviveBtn, /*#__PURE__*/React.createElement("p", {
        className: "levelField"
      }, "Level ", fighter.level), /*#__PURE__*/React.createElement("p", null, "xp: ", fighter.xp.toFixed(1), "/", fighter.xpToNext), /*#__PURE__*/React.createElement("p", null, "Fights: ", fighter.fights), /*#__PURE__*/React.createElement("p", null, "Wins: ", fighter.wins), /*#__PURE__*/React.createElement("p", null, "Kills: ", fighter.kills), /*#__PURE__*/React.createElement("p", null, "Revivals: ", fighter.revivals), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Health: ", health), /*#__PURE__*/React.createElement("p", null, "Damage: ", fighter.damage), /*#__PURE__*/React.createElement("p", null, "Speed: ", fighter.speed), /*#__PURE__*/React.createElement("p", null, "Armor: ", fighter.armor), /*#__PURE__*/React.createElement("p", null, "Crit Chance: ", fighter.crit * 2, "%")), /*#__PURE__*/React.createElement("div", {
        className: "card-action"
      }, /*#__PURE__*/React.createElement("a", {
        name: fighter.name,
        onClick: handleDeleteClick
      }, "Delete Fighter")))));
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fighterList row"
  }, fighterNodes, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  }));
};

var AllFighterList = function AllFighterList(props) {
  if (props.fighters.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fighterList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyFighter"
    }, "No Fighters yet"), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      id: "_csrf",
      name: "_csrf",
      value: props.csrf
    }));
  }

  var yourFighterNodes = props.yourFighters.map(function (fighter) {
    var id = "".concat(fighter.name, "-").concat(fighter.account);
    var itemName = "".concat(fighter.name, " - ").concat(fighter.level); // if one of your fighters is dead, don't have it as an option to fight

    if (fighter.health != 0) return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#",
      id: id,
      onClick: startFight
    }, itemName));
  });
  var i = 0;
  var fighterNodes = props.fighters.map(function (fighter) {
    // have to use some sort of iterator to key each dropdown lists ids, otherwise some dropdowns
    // might refer to a random different dropdown
    i++;
    var dropdownId = "dropdown".concat(i, "-").concat(fighter.account);
    var title = "".concat(fighter.name, "-").concat(fighter.account);
    var logId = "log".concat(i, "-").concat(fighter.account); // for setting up each card as a modal

    var modalhref = "modal".concat(i);
    var modalhrefId = "#".concat(modalhref);
    var currentFighterLogs = fighter.logs.split('~'); // TODO: Every log has an empty index at the end. Fix it lol

    currentFighterLogs.pop();
    var logNodes = currentFighterLogs.map(function (log) {
      var logLines = log.split('&');
      var logTitle = logLines[0];
      return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
        href: "#"
      }, logTitle));
    }); // used to retrieve fighter logs

    var id = "".concat(fighter.name, "-").concat(fighter.account); // if a fighter is dead, don't display it

    if (fighter.health != 0) return /*#__PURE__*/React.createElement("div", {
      key: fighter._id,
      className: "fighter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col s3 m3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card clickable dark-purple lighten-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-content white-text modal-trigger",
      href: modalhrefId
    }, /*#__PURE__*/React.createElement("span", {
      className: "card-title"
    }, fighter.name), /*#__PURE__*/React.createElement("p", {
      className: "accountField"
    }, "Created By ", fighter.username), /*#__PURE__*/React.createElement("p", {
      className: "levelField"
    }, "Level ", fighter.level), /*#__PURE__*/React.createElement("p", null, "Health: ", fighter.health), /*#__PURE__*/React.createElement("p", null, "Damage: ", fighter.damage), /*#__PURE__*/React.createElement("p", null, "Speed: ", fighter.speed), /*#__PURE__*/React.createElement("p", null, "Armor: ", fighter.armor), /*#__PURE__*/React.createElement("p", null, "Crit Chance: ", fighter.crit * 2, "%")), /*#__PURE__*/React.createElement("div", {
      id: modalhref,
      className: "modal"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-content card-content dark-purple lighten-1 white-text"
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-trigger soft-violet right waves-effect waves-light",
      "data-target": logId
    }, "Logs"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("ul", {
      id: logId,
      className: "dropdown-content"
    }, logNodes), /*#__PURE__*/React.createElement("span", {
      className: "card-title"
    }, fighter.name), /*#__PURE__*/React.createElement("p", {
      className: "accountField"
    }, "Created By ", fighter.username), /*#__PURE__*/React.createElement("p", {
      className: "levelField"
    }, "Level ", fighter.level), /*#__PURE__*/React.createElement("p", null, "Fights: ", fighter.fights), /*#__PURE__*/React.createElement("p", null, "Wins: ", fighter.wins), /*#__PURE__*/React.createElement("p", null, "Kills: ", fighter.kills), /*#__PURE__*/React.createElement("p", null, "Revivals: ", fighter.revivals), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Health: ", fighter.health), /*#__PURE__*/React.createElement("p", null, "Damage: ", fighter.damage), /*#__PURE__*/React.createElement("p", null, "Speed: ", fighter.speed), /*#__PURE__*/React.createElement("p", null, "Armor: ", fighter.armor), /*#__PURE__*/React.createElement("p", null, "Crit Chance: ", fighter.crit * 2, "%"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-trigger btn-floating btn-large soft-violet waves-effect waves-light",
      title: title,
      "data-target": dropdownId
    }, "Fight"), /*#__PURE__*/React.createElement("ul", {
      id: dropdownId,
      title: title,
      className: "dropdown-content"
    }, yourFighterNodes))))));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fighterList row"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "emptyFighter"
  }, "Click a Fighter to fight, or view more info"), /*#__PURE__*/React.createElement("br", null), fighterNodes, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    id: "_csrf",
    name: "_csrf",
    value: props.csrf
  }));
}; /// gets back all fighters owned by the current user from the server, then renders fighter list


var loadFightersFromServer = function loadFightersFromServer() {
  var csrf = $("#_csrf").val(); // get fighters

  sendAjax('GET', '/getFighters', null, function (data) {
    // get revives, so the user can know how many they have
    sendAjax('GET', '/getRevivals', null, function (revivalData) {
      ReactDOM.render( /*#__PURE__*/React.createElement(YourFighterList, {
        fighters: data.fighters,
        revivals: revivalData.revivals,
        csrf: csrf
      }), document.querySelector("#content"));
    });
  });
};

var loadAllFightersFromServer = function loadAllFightersFromServer() {
  var csrf = $("#_csrf").val();
  sendAjax('GET', '/getAllFighters', null, function (data) {
    sendAjax('GET', '/getFighters', null, function (accountData) {
      ReactDOM.render( /*#__PURE__*/React.createElement(AllFighterList, {
        fighters: data.fighters,
        yourFighters: accountData.fighters,
        csrf: csrf
      }), document.querySelector("#content")); // set up materialize elements

      $('.dropdown-trigger').dropdown();
      $('.modal').modal();
    });
  });
}; /// renders the change password page


var setupChangePassPage = function setupChangePassPage(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  updateUrl('/changePass');
};

var setupFightersPage = function setupFightersPage(csrf) {
  // ReactDOM.render(
  //   <AllFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through
  ReactDOM.render( /*#__PURE__*/React.createElement(LoadingPage, {
    csrf: csrf
  }), document.querySelector("#content"));
  loadAllFightersFromServer();
  updateUrl('/fighters');
};

var setupYourFightersPage = function setupYourFightersPage(csrf) {
  // ReactDOM.render(
  //   <YourFighterList fighters={[]} csrf={csrf} />, document.querySelector("#content")
  // );
  // Show a loading screen while the AJAX call goes through
  ReactDOM.render( /*#__PURE__*/React.createElement(LoadingPage, {
    csrf: csrf
  }), document.querySelector("#content"));
  loadFightersFromServer();
  updateUrl('/yourFighters');
}; /// renders the create fighter page


var setupMakerPage = function setupMakerPage(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FighterForm, {
    csrf: csrf
  }), document.querySelector("#content")); // setup sliders

  setupMaterializeElements();
  updateUrl('/createFighter');
}; /// renders the store page


var setupStorePage = function setupStorePage(csrf) {
  // render the loading page before we ask the server for our items
  ReactDOM.render( /*#__PURE__*/React.createElement(StorePage, {
    csrf: csrf
  }), document.querySelector("#content")); // get diamonds

  sendAjax('GET', '/getRevivals', null, function (data) {
    console.dir(data.revivals);
    ReactDOM.render( /*#__PURE__*/React.createElement(StorePage, {
      csrf: csrf,
      revivals: data.revivals
    }), document.querySelector("#content"));
  });
  updateUrl('/store');
};

var setupAccountPage = function setupAccountPage(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoadingPage, {
    csrf: csrf
  }), document.querySelector("#content")); // get current number of fighters

  sendAjax('GET', '/getMaxFighters', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountForm, {
      csrf: csrf,
      maxFighters: result.maxFighters
    }), document.querySelector("#content")); // initialize materialize elements
    // $('.collapsible').collapsible();
  });
  updateUrl('/account');
};

var setupBuyDiamondsPage = function setupBuyDiamondsPage(csrf) {
  csrf = $("#_csrf").val();
  ReactDOM.render( /*#__PURE__*/React.createElement(BuyDiamondsPage, {
    csrf: csrf
  }), document.querySelector("#content"));
  updateUrl('/buyDiamonds', setupBuyDiamondsPage);
}; /// sets up click events for the navigation buttons to re-render the page with react


var setupNavButtons = function setupNavButtons(csrf) {
  var makerButton = document.querySelector("#makerButton"); // const changePassButton = document.querySelector("#changePassButton");

  var yourFightersButton = document.querySelector("#yourFightersButton");
  var fightersButton = document.querySelector("#fightersButton");
  var accountButton = document.querySelector("#accountButton");
  var storeButton = document.querySelector("#storeButton");
  makerButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupMakerPage(csrf);
    return false;
  }); // changePassButton.addEventListener("click", (e) => {
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
  storeButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupStorePage(csrf);
    return false;
  });
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    setupAccountPage(csrf);
    return false;
  });
}; /// request a csrfToken


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
  return /*#__PURE__*/React.createElement("div", {
    className: "collection",
    id: "diamondCollection"
  }, /*#__PURE__*/React.createElement("a", {
    className: "collection-item soft-violet",
    type: "submit",
    onClick: setupBuyDiamondsPage
  }, /*#__PURE__*/React.createElement("img", {
    id: "diamondImg",
    src: "/assets/img/diamondIcon.png"
  }), /*#__PURE__*/React.createElement("p", {
    id: "diamondText"
  }, props.diamonds), /*#__PURE__*/React.createElement("i", {
    className: "material-icons",
    id: "addDiamondsBtn"
  }, "add")));
};

var setupIcons = function setupIcons() {
  // get number of diamonds
  sendAjax('GET', '/getDiamonds', null, function (result) {
    var diamonds = result.diamonds; // get the navbar

    var rightNav = document.querySelector("#right-nav");
    var leftNav = document.querySelector("#left-nav"); // Div to render the diamond icon to

    var diamondDiv = document.createElement('div');
    diamondDiv.setAttribute('id', 'diamondIcon');
    rightNav.insertBefore(diamondDiv, rightNav.firstChild); // render the icon in the div we just made

    ReactDOM.render( /*#__PURE__*/React.createElement(DiamondIcon, {
      diamonds: result.diamonds
    }), document.querySelector("#diamondIcon"));
  });
}; /// as soon as the document loads


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
  pointsField.textContent = "Points Left: ".concat(newPoints);
}; /// since when we slide, e.value just gives the int value of the current slider and we don't know which is active, 
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

  pointsField.textContent = "Points Left: ".concat(newPoints);
}; /// helper function to easily retrieve values from the stat sliders in the creator app


var getSliders = function getSliders() {
  var sliders = {};
  sliders.name = $("#fighterName").val();
  sliders.health = $("#fighterHealth").val();
  sliders.damage = $("#fighterDamage").val();
  sliders.speed = $("#fighterSpeed").val();
  sliders.armor = $("#fighterArmor").val();
  sliders.crit = $("#fighterCrit").val();
  return sliders;
}; // clears the create a fighter form


var resetForm = function resetForm() {};
"use strict";

var handleError = function handleError(message) {
  M.toast({
    html: "".concat(message)
  });
}; /// same thing as handle error. Just replacing it


var sendToast = function sendToast(message) {
  M.toast({
    html: "".concat(message)
  });
}; /// either redirects, sends a toast, or both


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
}; // turns an object with properties into 'key=value&key2=value2' string


var urlEncodeObject = function urlEncodeObject(object) {
  return Object.keys(object).map(function (key) {
    return key + '=' + object[key];
  }).join('&');
};

var updateUrl = function updateUrl(url, state) {
  var stateObj = {
    state: url
  };
  history.pushState(stateObj, '', url);
};