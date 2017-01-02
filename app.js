var scraperjs = require('scraperjs');
var mkdirp = require('mkdirp');
//setup the collection arrays
var arrayOfHrefs = [];
var arrayOfTitles = [];
var arrayOfImages = [];
var putTogetherArray = [];
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
        //then scrape the sub-array
        function scrapeArrayLinks() {
            //push the hrefs into an array
            for(i=0;i<scrapeArray.length;i++){
                var shirtLink = "http://www.shirts4mike.com/";
                shirtLink += scrapeArray[i];
                arrayOfHrefs.push(shirtLink);
            }
        }

        scrapeArrayLinks();
        //scrape for the shirt details, based on this array
        shirtScraping();
    });
function shirtScraping() {
    for (i = 0; i < arrayOfHrefs.length; i++) {
        scraperjs.StaticScraper.create(arrayOfHrefs[i])
            .scrape(function ($) {
                return {
                    shirt: $(".shirt-picture span img").first().attr("src"),
                    title: $(".shirt-details h1").first().contents().filter(function() {
                        return this.nodeType == 3;
                    }).text(),
                    price: $(".price").first().text()
                };
            })
            .then(function (data, options) {
                console.log(data);
            })
    }
}



//TODO: Don't forget error handling
//TODO: Write data to CSV file and save