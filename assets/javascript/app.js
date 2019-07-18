// giphy api key : x6ZEkt0MNBEzavwLgHLGLOyulDDrwcE6

var topics = ["smile", "frown", "cringe", "grimace", "happy", "rage", "sad", "excited",
              "interest", "disgust"];


$(document).ready(function() {

function buttonGenerate () {
    $("#gifButtons").empty();
    for (var i = 0; i < topics.length; i++) {
        $("#gifButtons").append($("<button class='gifGenButton'>" + topics[i] + "</button>"));
    };
};

$(document).on("click", ".gifGenButton", function() {
    
    var queryTopic = $(this).text();
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=x6ZEkt0MNBEzavwLgHLGLOyulDDrwcE6&q=" + queryTopic + "&limit=10&offset=0&rating=PG&lang=en";


    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
        var results = response.data;
        $("#allGifs").empty();

        for (var i = 0; i < 10; i++) {

            var stillUrl = results[i].images.original_still.url;
            var animUrl = results[i].images.original.url;

            var gifContainer = $("<div class='gifContainer'>");

            var addGif = $("<img class='thisGif'>");
            addGif.attr("state", "still");
            addGif.attr("src", stillUrl);
            addGif.attr("anim", animUrl);
            addGif.attr("still", stillUrl);
            addGif.attr("alt", queryTopic + " image");

            var gifInfo = $("<p class='gifInfo'>");
            var gifRating = results[i].rating;
            var gifTitle = results[i].title;
            $(gifInfo).html("Title : " + gifTitle + "<br>" +
                            "Rating : " + gifRating + "<br>");


            var favButton  = $("<button class='favButton'>");
            favButton.attr("buttonName", gifTitle);
            favButton.attr("src", stillUrl);
            favButton.attr("still", stillUrl);
            favButton.attr("anim", animUrl);
            favButton.text("Add to Favorites");


            $(gifContainer).append(favButton, addGif, gifInfo);

            $("#allGifs").prepend(gifContainer);
            
        }
      });
  });

  $("#submitButton").on("click", function() {

    event.preventDefault();

    var userInput = $("#userInput").val().trim();

    if (topics.includes(userInput.toLowerCase())) {
        console.log("repeat topic");
    }else if(userInput === "") {
        console.log("invalid topic")
    }else {
    topics.push(userInput);
    }

    buttonGenerate();

    var inputField = document.getElementById("inputForm");
        inputField.reset();

    });


  $(document).on("click", ".thisGif", function() {

      if ($(this).attr("state") == "still") {

          $(this).attr("state", "animated");
          
          $(this).attr("src", $(this).attr("anim"));

      } else {
        
        $(this).attr("state", "still");

        $(this).attr("src", $(this).attr("still"));
      }
    });

  $(document).on("click", ".favButton", function() {

    var theFavButton = $("<button class='favGif'>" + $(this).attr("buttonName") + "</button>");
    theFavButton.attr("src", $(this).attr("src"));
    theFavButton.attr("still", $(this).attr("still"));
    theFavButton.attr("anim", $(this).attr("anim"));


    $("#favorites").append(theFavButton);

    $(document).on("click", ".favGif", function() {
        $("#allGifs").empty();
    
                var gifContainer = $("<div class='favGifContainer'>");
    
                var favoGif = $("<img class='thisGif'>");
                favoGif.attr("state", "still");
                favoGif.attr("src", $(this).attr("src"));
                favoGif.attr("still", $(this).attr("still"));
                favoGif.attr("anim", $(this).attr("anim"));
    
                
         $(gifContainer).append(favoGif);
    
         $("#allGifs").prepend(gifContainer);
    
    
      });
    
  });



    buttonGenerate();
});