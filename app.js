/* Content Scraper for Mike's T-shirts, a project by Bevin Hernandez for the Treehouse Full Stack Javascript TechDegree */

var scraperjs = require('scraperjs');
var mkdirp = require('mkdirp');
const fs = require('fs');
var csv = require("fast-csv");

//setup the collection arrays
var arrayOfHrefs = [];
var path = "data";
var dataKept = [];

//the mkdirp module makes the folder, but if it already exists, it does nothing
mkdirp(path, function (err) {
    if (err) console.error(err);
    else console.log('Made data folder');
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
        //then set up the sub-array function to scrape the links
        function scrapeArrayLinks() {
            //push the hrefs into an array
            for(i=0;i<scrapeArray.length;i++){
                var shirtLink = "http://www.shirts4mike.com/";
                shirtLink += scrapeArray[i];
                arrayOfHrefs.push(shirtLink);
            }
        }
        //execute the function, to be clear
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
                //push each data object into an array
                dataKept.push(data);
                //use the csv Populate function to write the file
                csvPopulate(dataKept);
            })

    }

}

function csvPopulate(data){
    var csvStream = csv.createWriteStream({headers: true}),
        writableStream = fs.createWriteStream("data/shirts.csv");

    writableStream.on("finish", function(){
        console.log("DONE!");
    });

    csvStream.pipe(writableStream);
    for(i=0;i<data.length;i++){
        csvStream.write(data[i]);
    }

    csvStream.end();
}


//TODO: Don't forget error handling
