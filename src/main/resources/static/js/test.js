function getData() {
  disableBtns();
  var lastName = document.getElementById('firstName').value
  var firstName = document.getElementById('lastName').value
  $.ajax({
    type : "GET",
  	url : window.location + "api/data",
  	data: {
        "firstName": firstName? firstName : '',
        "lastName": lastName? lastName : ''
    },
  	success: function(result, status){
  	    addData(result);
  	    if(result.length == 0){
  	        enableBtns("Get data done! Empty data.");
  	    } else {
  	        enableBtns("Get data done!");
  	    }
  	},
  	error: function (xhr, ajaxOptions, thrownError) {
        enableBtns("Failed to get data!");
  	}
  });
}

function loadData() {
    disableBtns();
    $.ajax({
        type : "POST",
  	    url : window.location + "api/data",
  	    success: function(result){
            enableBtns("Load data done!");
  	    },
        error: function (xhr, ajaxOptions, thrownError) {
            enableBtns("Failed to load data!");
        }
    });
}

function clearData() {
    disableBtns();
    $.ajax({
        type : "POST",
  	    url : window.location + "api/data/remover",
  	    success: function(result){
            enableBtns("Clear data done!");
  	    },
        error: function (xhr, ajaxOptions, thrownError) {
            enableBtns("Failed to clear data!");
        }
    });
}

function addData(data) {
    var tableDiv = document.getElementById('infoTable');
    tableDiv.innerHTML = null;
    for (var item of data) {
        var htmlValue = "";
        htmlValue += item["firstName"] + " ";
        htmlValue += item["lastName"] + " ";
        var information = item["information"];
        for (var prop in information) {
            if (!information.hasOwnProperty(prop)) continue;
            var value = information[prop];
            htmlValue += prop + "=" + value + " ";
        }
        tableDiv.innerHTML += '<p>' + htmlValue + '</p>';
    }
}

function disableBtns() {
    document.getElementById("loadData").disabled = true;
    document.getElementById("clearData").disabled = true;
    document.getElementById("query").disabled = true;
    var tableDiv = document.getElementById('infoTable');
    tableDiv.innerHTML = null;
    var statusDiv = document.getElementById('status');
    statusDiv.innerHTML = null;
}

function enableBtns(msg) {
    document.getElementById("loadData").disabled = false;
    document.getElementById("clearData").disabled = false;
    document.getElementById("query").disabled = false;
    var statusDiv = document.getElementById('status');
    statusDiv.innerHTML = null;
    statusDiv.innerHTML += '<p style=\"color:red\">' + msg + '</p>';
}