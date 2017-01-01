var scraperjs = require('scraperjs');
var mkdirp = require('mkdirp');
//setup the collection arrays
var arrayOfHrefs = [];
var arrayOfTitles = [];
var arrayOfImages = [];
var path = "data";

//the mkdirp module makes the folder, but if it already exists, it does nothing
mkdirp(path, function (err) {
    if (err) console.error(err);
    else console.log('Made data');
});

//scrape the site to determine the subpages
scraperjs.StaticScraper.create('http://www.shirts4mike.com/shirts.php')
    .scrape(function($) {
        return $(".products li a").map(function() {
            //pull the hrefs
            return $(this).attr("href");
        }).get();
    })
    .then(function(scrapeArray) {
        function scrapeArrayLinks() {
            //push the hrefs into an array
            for(i=0;i<scrapeArray.length;i++){
                var shirtLink = "http://www.shirts4mike.com/";
                shirtLink += scrapeArray[i];
                arrayOfHrefs.push(shirtLink);
            }
            console.log(arrayOfHrefs);
        }
        scrapeArrayLinks();
        imageScraping();
        detailsScraping();


    });
function imageScraping() {
    for (i = 0; i < arrayOfHrefs.length; i++) {
        scraperjs.StaticScraper.create(arrayOfHrefs[i])
            .scrape(function ($) {
                return $(".shirt-picture span img").map(function(){
                    return $(this).attr("src");
                }).get();
            })
            .then(function (shirtImg) {
                var img = shirtImg;
                arrayOfImages.push(img);
                console.log(arrayOfImages);
            })

    }
}
function detailsScraping() {
    for (i = 0; i < arrayOfHrefs.length; i++) {
        scraperjs.StaticScraper.create(arrayOfHrefs[i])
            .scrape(function ($) {
                return $(".shirt-details h1").map(function(){
                    return $(this).text();
                }).get();
            })
            .then(function (shirtTitle) {
                var title = shirtTitle;
                arrayOfTitles.push(title);
                console.log(arrayOfTitles);
            })

    }
}




//TODO: Write data to CSV file and save