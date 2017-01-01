var scraperjs = require('scraperjs');
//setup the collection arrays
var arrayOfHrefs = [];
var arrayOfPrices = [];
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
                var shirtLink = "http://www.shirts4mike.com/"
                shirtLink += scrapeArray[i];
                arrayOfHrefs.push(shirtLink);
            }
            console.log(arrayOfHrefs);
        }
        scrapeArrayLinks();
        postScraping();


    });
function postScraping() {
    for (i = 0; i < arrayOfHrefs.length; i++) {
        scraperjs.StaticScraper.create(arrayOfHrefs[i])
            .scrape(function ($) {
                return $(".price").map(function () {
                    return $(this).text();
                }).get();
            })
            .then(function (shirtData) {
                var price = shirtData;
                arrayOfPrices.push(price);
                console.log(arrayOfPrices);
            })

    }
}


//TODO: Check for data folder
//TODO: Create data folder if folder doesn't exist

//TODO: Write data to CSV file and save