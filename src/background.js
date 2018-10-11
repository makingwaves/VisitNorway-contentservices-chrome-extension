chrome.runtime.onInstalled.addListener(function() {

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        console.log("contains " + tab.url.includes('visitnorway'));
        if (tab.url.includes('visitnorway')) {
            chrome.pageAction.show(tabId);
        } else {
            chrome.pageAction.hide(tabId);
        }
    });
});

chrome.pageAction.onClicked.addListener(function(activeTab) {

    chrome.storage.local.get("data", function(items) {
        if (items && items.data) {

            var menu = 'document.querySelector("[data-header-btn=' + '\'menu\'' + ']").click();';

            chrome.tabs.executeScript(activeTab.id, { code: menu }, function() {}); //toggle menu
            setTimeout(function() {}, 500);
            chrome.tabs.executeScript(activeTab.id, { code: menu }, function() {}); //close menu
            setTimeout(function() {}, 500);

            if (!chrome.runtime.error) {
                var languages = items.data.split(";");

                for (var i = 0; i < languages.length; i++) {
                    var x = 'document.getElementsByClassName("language-item locale code_' + languages[i] + '")[0].getElementsByTagName("span")[0].attributes[0].value';
                    chrome.tabs.executeScript(activeTab.id, { code: x }, function(result) {
                        chrome.tabs.create({ url: result[0] }, function(newTab) {
                            console.log(newTab);
                        });
                    });
                }
            } else {
                console.log("Something went wrong.");
            }
        } else {
            //open options
            chrome.runtime.openOptionsPage();
        }
    });
});