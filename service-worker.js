var self = this;
var urlMain;
self.addEventListener("push", function (event) {
    event.waitUntil(
            fetch("https://fitrahoindia.com/api/getNotification", {
                method: "get"
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {

                urlMain = result.data.url;
                const options = {
                    body: result.data.msg,
                    icon: result.data.logo,
                    image: result.data.name,
                    action: result.data.url
                };
                self.registration.showNotification(result.data.title, options);
            })
            );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    const promiseChain = clients.openWindow(urlMain);
    event.waitUntil(promiseChain);
});

function serviceWorkerCall() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
                .then(initialiseState);
    } else {
        console.warn("Service workers aren't supported in this browser.");
    }
}

function initialiseState() {
    if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
        console.log("Notifications aren't supported.");
        return;
    }

    if (Notification.permission === "denied") {
        console.log("The user has blocked notifications.");
        return;
    }

    if (!("PushManager" in window)) {
        console.log("Push messaging isn't supported.");
        return;
    }

    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager
                .getSubscription()
                .then(function (subscription) {
                    pushButton.disabled = false;
                    if (!subscription) {
                        return;
                    }
                    if (subscription) {
                        sendSubscriptionToServer(subscription);
                    }

                    pushButton.textContent = disableText;
                    desc.textContent = disableDesc;
                    isPushEnabled = true;
                })
                .catch(function (e) {
                    console.log("Error during getSubscription()", e);
                });
    });
}

function subscribe() {
    pushButton.disabled = true;
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager
                .subscribe({userVisibleOnly: true})
                .then(function (subscription) {
                    isPushEnabled = true;
                    pushButton.textContent = disableText;
                    desc.textContent = disableDesc;
                    pushButton.disabled = false;
                    if (subscription) {
                        sendSubscriptionToServer(subscription);
                    }
                })
                .catch(function (e) {
                    if (Notification.permission === "denied") {
                        console.warn("Permission for Notification is denied");
                        pushButton.disabled = true;
                    } else {
                        console.error("Unable to subscribe to push", e);
                        pushButton.disabled = true;
                        pushButton.textContent = "Enable Push Messages";
                    }
                });
    });
}

function unsubscribe() {
    pushButton.disabled = true;
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager
                .getSubscription()
                .then(function (pushSubscription) {
                    if (!pushSubscription) {
                        isPushEnabled = false;
                        pushButton.disabled = false;
                        pushButton.textContent = enableText;
                        desc.textContent = enableDesc;
                        return;
                    }

                    var temp = pushSubscription.endpoint.split("/");
                    var registration_id = temp[temp.length - 1];
                    deleteSubscriptionToServer(registration_id);

                    pushSubscription.unsubscribe().then(function (successful) {
                        pushButton.disabled = false;
                        pushButton.textContent = enableText;
                        desc.textContent = enableDesc;
                        isPushEnabled = false;
                    })
                            .catch(function (e) {
                                console.error("Error thrown while unsbscribing from push messaging.");
                            });
                });
    });
}
// send subscription id to server
function sendSubscriptionToServer(subscription) {
    var temp = subscription.endpoint.split("/");
    var registration_id = temp[temp.length - 1];
    fetch(
            "https://fitrahoindia.com/api/insertGCM/" + registration_id,
            {
                method: "get"
            }
    ).then(function (response) {
        return response.json();
    });
}

function deleteSubscriptionToServer(rid) {
    fetch("https://fitrahoindia.com/api/deleteGCM/" + rid, {
        method: "get"
    }).then(function (response) {
        return response.json();
    });
}