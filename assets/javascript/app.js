// giphy api key : x6ZEkt0MNBEzavwLgHLGLOyulDDrwcE6

// create array of strings pertaining to topic; 'emotions'
var topics = ["smile", "frown", "cringe", "grimace", "happy", "rage", "sad", "excited",
              "interest", "disgust"];
// define array to store user's favorite Gifs
var favsArray = [];

$(document).ready(function() {

// function that generates buttons with text by looping through each item in 'topics' and displays on .html
function buttonGenerate () {
  // empty div containing buttons each time new buttons are added
    $("#gifButtons").empty();
    for (var i = 0; i < topics.length; i++) {
        $("#gifButtons").append($("<button class='gifGenButton'>" + topics[i] + "</button>"));
    };
};

// function on clicking one of the topic buttons
$(document).on("click", ".gifGenButton", function() {
    // query to be searched from giphy api is the value of the button  
    var queryTopic = $(this).text();
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=x6ZEkt0MNBEzavwLgHLGLOyulDDrwcE6&q=" + queryTopic + "&limit=10&offset=0&rating=PG&lang=en";


    $.ajax({
      url: queryURL,    
      method: "GET"
    }).then(function(response) {
        var results = response.data;
        
        //empty the div to display generated gifs in preparation for new gifs to populate the page
        $("#allGifs").empty();

        // display the first 10 images from the query results
        for (var i = 0; i < 10; i++) {

            //store the still image URLS and animated image URLs in these variables
            var stillUrl = results[i].images.original_still.url;
            var animUrl = results[i].images.original.url;

            // create div to hold gif and relevant information
            var gifContainer = $("<div class='gifContainer'>");

            // creating an image in memory with URLs from line 40-41
            var addGif = $("<img class='aGif'>");
            addGif.attr("state", "still");
            addGif.attr("src", stillUrl);
            addGif.attr("anim", animUrl);
            addGif.attr("still", stillUrl);
            addGif.attr("alt", queryTopic + " image");

            // creating a paragraph to store rating and title information of the gif
            var gifInfo = $("<p class='gifInfo'>");
            var gifRating = results[i].rating;
            var gifTitle = results[i].title;
            $(gifInfo).html("Title : " + gifTitle + "<br>" +
                            "Rating : " + gifRating + "<br>");

            // creating an add to favorites Button 'addToFav'. storing the same URL information on the button
            var addToFav  = $("<button class='addToFav'>");
            addToFav.attr("buttonName", gifTitle);
            addToFav.attr("src", stillUrl);
            addToFav.attr("still", stillUrl);
            addToFav.attr("anim", animUrl);
            addToFav.text("Add to Favorites");

            // append the image, paragraph, and addToFav Button to the gifContainer div, then display on page in #allGifs div
            $(gifContainer).append(addGif, gifInfo, addToFav);

            $("#allGifs").prepend(gifContainer);           
          }
      });
  });

// function on clicking #submitButton -- for user to create their own buttons
  $("#submitButton").on("click", function() {

    // prevent the default event of clicking a submission button, in this case; would refresh the page
    event.preventDefault();

    // storing the user's textbox input, trimming whitespace from the front and end
    var userInput = $("#userInput").val().trim();

    // if topics array includes the user's input, do not push the input into topic. if the user's input is blank, do not push into the topics array
    // otherwise, push their input into the topics array!
    if (topics.includes(userInput.toLowerCase())) {
        console.log("repeat topic");
    }else if(userInput === "") {
        console.log("invalid topic")
    }else {
    topics.push(userInput);
    }

    // run buttonGenerate function to create buttons including user's new button
    buttonGenerate();

    // reset the text box input
    var inputField = document.getElementById("inputForm");
        inputField.reset();
    });

// function on clicking a gif on the page
  $(document).on("click", ".aGif", function() {

    // if the gif state is currently still, change the state to animated, and change the img src to its animated URL
      if ($(this).attr("state") == "still") {

          $(this).attr("state", "animated");
          
          $(this).attr("src", $(this).attr("anim"));
        //same thing the other way
      } else {
        
        $(this).attr("state", "still");

        $(this).attr("src", $(this).attr("still"));
      }
    });

// function on clicking the addToFav button
  $(document).on("click", ".addToFav", function() {

    // create a 'favorite' button. take the name and src/still/animation URLS from the addToFav (this) button
   // var favButton = $("<button class='myFavButton'>" + $(this).attr("buttonName") + "</button>");

    // create favGifInfo object and take information from the .addToFav button and store for later use
    var favGifInfo = {};
    favGifInfo.favButton = $("<button class='myFavButton'>" + $(this).attr("buttonName") + "</button>");
    favGifInfo.name = $(this).attr("buttonName");
    favGifInfo.src = $(this).attr("src");
    favGifInfo.still = $(this).attr("still");
    favGifInfo.anim = $(this).attr("anim");

    favsArray.push(favGifInfo);

    // display the favButton in the #favorites div on the page
    $("#favorites").append(favGifInfo.favButton);
  });
    

        // function on clicking the 'favorite Button'
      $(document).on("click", ".myFavButton", function() {
        // empty the div displaying all Gifs
        $("#allGifs").empty();
        
            for (var i = 0; i < favsArray.length; i++) {
                // create a div to store the Gif
                var favGifContainer = $("<div class='favGifContainer'>");

                // create the Gif image
                var favoGif = $("<img class='aGif'>");

                // take the the image attributes from favGifInfo objects in the favsArray
                favoGif.attr("state", "still");
                favoGif.attr("src", favsArray[i].src);
                favoGif.attr("still", favsArray[i].still);
                favoGif.attr("anim", favsArray[i].anim);

                var removeFav = $("<button class='removeFav'>");
                removeFav.text("Remove from Favorites");
                removeFav.attr("data-attr", i);

              // attach the image to the gif container, and display the content on the page   
              $(favGifContainer).append(favoGif, removeFav);

              $("#allGifs").prepend(favGifContainer);
        
         }
        });
        // function for removing favorites from favorite section
         $(document).on("click", ".removeFav", function() {

          var whereToSpliceFav = ($(this).attr("data-attr"));

          favsArray.splice(parseInt(whereToSpliceFav), 1);

          $("#favorites").empty();
          
          $("#allGifs").empty();

            for (var i = 0; i < favsArray.length; i++) {
                // create a div to store the Gif
                var favGifContainer = $("<div class='favGifContainer'>");

                // create the Gif image
                var favoGif = $("<img class='aGif'>");

                // take the the image attributes from favGifInfo objects in the favsArray
                favoGif.attr("state", "still");
                favoGif.attr("src", favsArray[i].src);
                favoGif.attr("still", favsArray[i].still);
                favoGif.attr("anim", favsArray[i].anim);

                var removeFav = $("<button class='removeFav'>");
                removeFav.text("Remove from Favorites");
                removeFav.attr("data-attr", i);


              // attach the image to the gif container, and display the content on the page   
              $(favGifContainer).append(favoGif, removeFav);

              $("#allGifs").prepend(favGifContainer);
              $("#favorites").append(favsArray[i].favButton);
        
          }
                  
        });

    // call initial buttons to be generated onto the page
    buttonGenerate();

      });

