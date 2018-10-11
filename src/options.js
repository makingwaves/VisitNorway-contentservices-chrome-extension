document.body.onload = function() {  
  chrome.storage.local.get("data", function(items) {
    if (!chrome.runtime.error) {
	  var languages = items.data.split(";");
	  
	  for(var i=0;i<languages.length;i++){
				document.getElementById(languages[i]).checked = true;
	  }
     }
	 else {
		console.log("Something went wrong.");
	 }
	 
	});
  
}

document.getElementById("set").onclick = function() {
  
  var checkedBoxes = document.querySelectorAll('input[name=languages]:checked');
  
  var selectedLanguages ="";
  
  for(var i=0;i<checkedBoxes.length;i++)
  {
	  selectedLanguages += checkedBoxes[i].id + ";";
  }
  
  selectedLanguages = selectedLanguages.slice(0, -1);
  
  chrome.storage.local.set({ "data" : selectedLanguages }, function() {    
    if (chrome.runtime.error) {
      alert("Something went wrong");
    }
	alert("Saved successfully");
  });
  
  window.close();
}