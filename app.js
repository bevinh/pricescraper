/* Content Scraper for Mike's T-shirts, a project by Bevin Hernandez for the Treehouse Full Stack Javascript TechDegree */

var mkdirp = require('mkdirp');
var fs = require('fs');
var csv = require("fast-csv");
var request = require('request');
var cheerio = require('cheerio');


//setup the collection arrays
var arrayOfHrefs = [];
var dataKept = [];
//variables to keep the individual shirts etc.
var hrefMike;
var shirtTitle;
var shirtImage;
var shirtPrice;
var shirtUrl;
var shirtTime;
//variable for the csv file folder
var path = "data";


//function to log errors
function logError(e){
    var path = 'scraper-error.log';
    var d = new Date();
    var eWrite = "[" + d + " ]";
    eWrite += ":" + e + "\n";

        fs.appendFileSync(path, eWrite, encoding='utf8');
}



//the mkdirp module makes the folder, but if it already exists, it does nothing
mkdirp(path, function (err) {
    if (err) console.error(err);
});

//make a request to the main page
    request('http://www.shirts4mike.com/shirts.php', function (error, response, body) {
        //Check for any errors
        if (error) {
            return logError('Oops, something went wrong, looks like an error:', error);
        }

        //Check for the status code
        if (response.statusCode !== 200) {
            return logError('Oops, something went wrong, looks like an error:', response.statusCode);
        }
        var $ = cheerio.load(body);
        $('.products li a').each(function (i, element) {
            hrefMike = "http://www.shirts4mike.com/" + $(this).attr("href");
            arrayOfHrefs.push(hrefMike);
        });

        for (i = 0; i < arrayOfHrefs.length; i++) {
            getShirtData(arrayOfHrefs[i]);
        }

    });



function getShirtData(shirtLink) {
    request(shirtLink, function (error, response, body) {
        //Check for any errors
        if (error) {
            return logError('Oops, something went wrong, looks like an error:', error);
        }

        //Check for the status code
        if (response.statusCode !== 200) {
            return logError('Oops, something went wrong, looks like an error:', response.statusCode);
        }

       //load the body of the html page we've requested
        var $ = cheerio.load(body);

        //find the info about each shirt - this could be different for whatever you're looking for
        shirtTitle = $('.shirt-details h1').first().contents().filter(function () {
            return this.nodeType == 3;
        }).text();
        shirtPrice = $(".price").first().text();
        shirtImage = $(".shirt-picture span img").first().attr("src");
        shirtUrl = shirtLink;
        shirtTime = new Date().toLocaleString();
        //make an array to hold each shirt set
        var newArray = [];
        //add the new array items
        newArray.push(shirtTitle, shirtPrice, shirtImage, shirtUrl, shirtTime, '\n');
        //push each of these into an array
        dataKept.push(newArray);
        //populate the CSV
        csvPopulate(dataKept);
    });


}

function csvPopulate(data){
    //Get the date to create the filename
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var fileName = year + "-" + month + "-" + day;

    //create the CSV object and the stream object of data to write to the file system
    csv
        .writeToStream(fs.createWriteStream("data/" + fileName + ".csv"), data, {headers: ["Title", "Price", "ImageURL", "URL", "Time"]});
}


