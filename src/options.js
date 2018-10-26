document.body.onload = function () {
    chrome.storage.local.get("data", function (items) {
        if (!chrome.runtime.error && items != '' && items.data != undefined && items.data != '') {
            var languages = items.data.split(";");
            for (var i = 0; i < languages.length; i++) {
                document.getElementById(languages[i]).checked = true;
            }
        }
    });
};

document.getElementById("set").onclick = function () {
    var checkedBoxes = document.querySelectorAll('input[name=languages]:checked');
    var selectedLanguages = [];
    for (var i = 0; i < checkedBoxes.length; i++) {
        selectedLanguages.push(checkedBoxes[i].id);
    }

    chrome.storage.local.set({ "data": selectedLanguages.join(';') }, function () {
        if (chrome.runtime.error) {
            alert("Something went wrong");
        }
        alert("Saved successfully");
    });
    window.close();
};

document.getElementById("select-all").onclick = function () {
    var checkedBoxes = document.querySelectorAll('input[name=languages]');
    for (var i = 0; i < checkedBoxes.length; i++) {
        checkedBoxes[i].checked = true;
    }
};

document.getElementById("select-none").onclick = function () {
    var checkedBoxes = document.querySelectorAll('input[name=languages]');
    for (var i = 0; i < checkedBoxes.length; i++) {
        checkedBoxes[i].checked = false;
    }
};