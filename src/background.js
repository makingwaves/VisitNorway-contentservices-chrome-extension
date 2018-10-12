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
                var postfix = [];
                for (var i = 0; i < languages.length; i++) {
                    var x = 'document.querySelectorAll("[data-language-site=' + languages[i] 
                    + ']")[0].getElementsByTagName("span")[0].attributes[0].value';

                    if(languages[i] == 'uk' || languages[i] == 'usa'){
                        postfix.push('?lang=' + languages[i]);
                    }                    

                    chrome.tabs.executeScript(activeTab.id, { code: x }, function(result) {
                        var url = result[0];

                        if(url.includes('.com/') && postfix.length > 0){
                            url += postfix[0];
                            postfix = postfix.splice(1,1); 
                        }

                        chrome.tabs.create({ url: url}, function(newTab) {
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

