$(window).on('load', function() {
    if (window.location.search.split('?').length > 1) {
        var data = window.location.search.split('?')[1].split('=')[1];
        fetchMovieByName(data);
    }
});

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
