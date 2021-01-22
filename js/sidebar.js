window.onload = function winOnLoad() {
    const ver_disabler = document.getElementById("ver_disabler");
    const ver_selector = document.getElementById("ver_selector");

    ver_disabler.style.display = "none";
    ver_selector.style.display = "none";

    // document.querySelector(".ver_selector a img").style.filter = "grayscale(100%)";

    var accessibilityOpts = document.getElementById("accessibility-bar");
    var opts = document.getElementById("settings-bar");
    var news = document.getElementById("news-bar");

    accessibilityOpts.style.right = "-500px";
    opts.style.right = "-500px";
    news.style.right = "0px";
}

function settingsApp() {
  var accessibilityOptions = document.getElementById("accessibility-bar");
  var options = document.getElementById("settings-bar");
  var news = document.getElementById("news-bar");
  var account = document.getElementById("account-bar");

  accessibilityOptions.style.right = "-500px";
  account.style.right = "-500px";
  news.style.right = "-500px";
  options.style.right = "0px";
}

function homeApp() {
  var accessibilityOptions = document.getElementById("accessibility-bar");
  var options = document.getElementById("settings-bar");
  var news = document.getElementById("news-bar");
  var account = document.getElementById("account-bar");

  accessibilityOptions.style.right = "-500px";
  account.style.right = "-500px";
  news.style.right = "0px";
  options.style.right = "-500px";
}

function accountApp() {
  var accessibilityOptions = document.getElementById("accessibility-bar");
  var options = document.getElementById("settings-bar");
  var news = document.getElementById("news-bar");
  var account = document.getElementById("account-bar");
    
  accessibilityOptions.style.right = "-500px";
  account.style.right = "-0px";
  news.style.right = "-500px";
  options.style.right = "-500px";
}

function accessibilityApp() {
  var accessibilityOptions = document.getElementById("accessibility-bar");
  var options = document.getElementById("settings-bar");
  var news = document.getElementById("news-bar");
  var account = document.getElementById("account-bar");
  
  accessibilityOptions.style.right = "-0px";
  account.style.right = "-500px";
  news.style.right = "-500px";
  options.style.right = "-500px";
}
