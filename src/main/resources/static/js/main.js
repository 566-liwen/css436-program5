$(window).on('load', function() {
 $.ajax({
    type : "GET",
   	url : window.location + "api/movies",
   	success: function(result, status){
   	    dataLoaded(result);
   	},
   	error: function (xhr, ajaxOptions, thrownError) {
        console.log("get failed");
   	}
   });
});

function dataLoaded(data){
    var banner = document.getElementById('banner');
    var moviesList = document.getElementById('movies_list_loading');
    banner.innerHTML = null;
    moviesList.innerHTML = null;
    banner.innerHTML += generateBanner();
    generateMoviesList(moviesList, data);
}

function generateBanner(){
    return "A super banner."
}

function generateMoviesList(moviesListDiv, data){
    for (var item of data) {
        var name = item["name"];
        // create btn
        var inputElement = document.createElement('input');
        inputElement.type = "button"
        inputElement.value = name;
        inputElement.addEventListener('click', displayMovie);
        // attach to parent div
        moviesListDiv.appendChild(inputElement);
    }
}

function displayMovie(event){

    var btn = event.target;
    if(btn == null) return;
    var data = btn.value;
    if(data == null) return;
    window.location = 'movie.html?name=' + data;
//    var main = document.getElementById('main');
//    main.style.display = "none";
//
//    var single = document.getElementById('single');
//    single.style.display = "block";
//
//    fetchMovieByName(data);
}

function fetchMovieByName(data) {
    if(!data) return;
    $.ajax({
        type : "GET",
       	url : window.location + "api/movies/" + data,
       	success: function(result, status){
       	    getMovieByNameSuccess(result);
       	},
       	error: function (xhr, ajaxOptions, thrownError) {
            console.log("get failed");
       	}
    });
}

function getMovieByNameSuccess(data) {
    var movieItem = document.getElementById('movie_item');
    movieItem.innerHTML = null;
    generateSingleMovieInformation(movieItem, data);
}

function generateSingleMovieInformation(movieItem, data){
    var information = document.createElement('p');
    information.innerHTML = data["description"];
    movieItem.appendChild(information);
}


//function getData() {
//
//  disableBtns();
//  var lastName = document.getElementById('firstName').value
//  var firstName = document.getElementById('lastName').value
//  $.ajax({
//    type : "GET",
//  	url : window.location + "api/data",
//  	data: {
//        "firstName": firstName? firstName : '',
//        "lastName": lastName? lastName : ''
//    },
//  	success: function(result, status){
//  	    addData(result);
//  	    if(result.length == 0){
//  	        enableBtns("Get data done! Empty data.");
//  	    } else {
//  	        enableBtns("Get data done!");
//  	    }
//  	},
//  	error: function (xhr, ajaxOptions, thrownError) {
//        enableBtns("Failed to get data!");
//  	}
//  });
//}
//
//function loadData() {
//    disableBtns();
//    $.ajax({
//        type : "POST",
//  	    url : window.location + "api/data",
//  	    success: function(result){
//            enableBtns("Load data done!");
//  	    },
//        error: function (xhr, ajaxOptions, thrownError) {
//            enableBtns("Failed to load data!");
//        }
//    });
//}
//
//function clearData() {
//    disableBtns();
//    $.ajax({
//        type : "POST",
//  	    url : window.location + "api/data/remover",
//  	    success: function(result){
//            enableBtns("Clear data done!");
//  	    },
//        error: function (xhr, ajaxOptions, thrownError) {
//            enableBtns("Failed to clear data!");
//        }
//    });
//}
//
//function addData(data) {
//    var tableDiv = document.getElementById('infoTable');
//    tableDiv.innerHTML = null;
//    for (var item of data) {
//        var htmlValue = "";
//        htmlValue += item["firstName"] + " ";
//        htmlValue += item["lastName"] + " ";
//        var information = item["information"];
//        for (var prop in information) {
//            if (!information.hasOwnProperty(prop)) continue;
//            var value = information[prop];
//            htmlValue += prop + "=" + value + " ";
//        }
//        tableDiv.innerHTML += '<p>' + htmlValue + '</p>';
//    }
//}
//
//function disableBtns() {
//    document.getElementById("loadData").disabled = true;
//    document.getElementById("clearData").disabled = true;
//    document.getElementById("query").disabled = true;
//    var tableDiv = document.getElementById('infoTable');
//    tableDiv.innerHTML = null;
//    var statusDiv = document.getElementById('status');
//    statusDiv.innerHTML = null;
//}
//
//function enableBtns(msg) {
//    document.getElementById("loadData").disabled = false;
//    document.getElementById("clearData").disabled = false;
//    document.getElementById("query").disabled = false;
//    var statusDiv = document.getElementById('status');
//    statusDiv.innerHTML = null;
//    statusDiv.innerHTML += '<p style=\"color:red\">' + msg + '</p>';
//}