chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (tab.url.includes('visitnorway')) {
            chrome.pageAction.show(tabId);
        } else {
            chrome.pageAction.hide(tabId);
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.includes('visitnorway')) {
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
});

chrome.pageAction.onClicked.addListener(function (activeTab) {
    chrome.storage.local.get(['data'], function (items) {
        if (items && items.data && items.data != '') {
            var menu = 'document.querySelector("[data-header-btn=\'menu\']").click();';

            chrome.tabs.executeScript(activeTab.id, { code: menu }, function () { }); //toggle menu
            chrome.tabs.executeScript(activeTab.id, { code: menu }, function () { }); //close menu

            if (!chrome.runtime.error) {
                var languages = items.data.split(";");

                for (let i = 0; i < languages.length; i++) {
                    var x = 'document.querySelectorAll("[data-language-site=' + languages[i] + ']")[0].getElementsByTagName("a")[0].href';
                    let postfix = [];
                    if (languages[i] == 'uk' || languages[i] == 'usa' || languages[i] == 'primary') {
                        postfix.push('?lang=' + languages[i]);
                    }

                    chrome.tabs.executeScript(activeTab.id, { code: x }, function (result) {
                        var url = result[0];
                        if (url == '') {
                            // in case of listing page there are no links inside html
                            // opens same link in new tab and then clicks on specific language to load it
                            // delays are necessary to let DOM render everything and attach all events
                            chrome.tabs.create({ url: activeTab.url }, function (newTab) {
                                let x = "setTimeout(function(){document.querySelectorAll('li.language-item.locale.code_" + languages[i] + " a')[0].click();},3000);";
                                setTimeout(function () {
                                    chrome.tabs.executeScript(newTab.id, { code: x }, function (r) { });
                                }, 2000);
                                console.log(newTab);
                            });
                        } else {
                            if (url.includes('.com/') && postfix.length > 0) {
                                url += postfix[0];
                            }
                            chrome.tabs.create({ url: url }, function (newTab) {
                                console.log(newTab);
                            });
                        }
                    });
                }
            } else {
                console.log('Something went wrong.');
            }
        } else {
            chrome.runtime.openOptionsPage();
        }
    });
});