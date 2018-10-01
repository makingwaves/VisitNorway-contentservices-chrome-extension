chrome.runtime.onInstalled.addListener(function() {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {


        chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostContains: 'visitnorway' }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }

        ]);
    });
});

chrome.pageAction.onClicked.addListener(function(activeTab) {

    chrome.storage.sync.get("data", function(items) {
        if (items && items.data) {

            var menu = 'document.querySelector("[data-header-btn=' + '\'menu\'' + ']").click();';
            chrome.tabs.executeScript(activeTab.id, { code: menu }, function() {}); //toggle menu
            chrome.tabs.executeScript(activeTab.id, { code: menu }, function() {}); //close menu

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
        };
    });
});