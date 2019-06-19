var isPushEnabled = false;
var pushButton = document.querySelector(".pushButton");
var desc = document.querySelector(".desc");
var disableText = "Unsubscribe";
var enableText = "Subscribe";
var disableDesc = "Thank you message";
var enableDesc = "Click <span class='high'>Allow</span> button top left.";

document.addEventListener("DOMContentLoaded", function () {
    if (isPushEnabled) {
        unsubscribe();
    } else {
        subscribe();
    }
    serviceWorkerCall();
});