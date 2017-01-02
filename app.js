/* Content Scraper for Mike's T-shirts, a project by Bevin Hernandez for the Treehouse Full Stack Javascript TechDegree */

var mkdirp = require('mkdirp');
const fs = require('fs');
var csv = require("fast-csv");
const url = require('url');

var request = require('request');
var cheerio = require('cheerio');


//setup the collection arrays
var arrayOfHrefs = [];
var path = "data";
var hrefMike;
var shirtTitle;
var shirtImage;
var shirtPrice;
var shirtUrl;
var shirtTime;
var dataKept = [];

//the mkdirp module makes the folder, but if it already exists, it does nothing
mkdirp(path, function (err) {
    if (err) console.error(err);
    else console.log('Made data folder');
});

//make a request to the main page
request('http://www.shirts4mike.com/shirts.php', function (error, response, body) {
    //Check for any errors
    if(error){
        return console.log(new Date().getTime() + 'Oops, something went wrong, looks like an error:', error);
    }

    //Check for the status code
    if(response.statusCode !== 200){
        return console.log(new Date().getTime() + 'Oops, something went wrong, looks like an error:', response.statusCode);
    }
    var $ = cheerio.load(body);
    $('.products li a').each(function(i, element){
        hrefMike = "http://www.shirts4mike.com/" + $(this).attr("href")
        arrayOfHrefs.push(hrefMike);
    });
    for(i=0;i<arrayOfHrefs.length;i++){
        getShirtData(arrayOfHrefs[i]);
    }
});

function getShirtData(shirtLink) {
    request(shirtLink, function (error, response, body) {
        //Check for any errors
        if (error) {
            return console.log(new Date().getTime() + 'Oops, something went wrong, looks like an error:', error);
        }

        //Check for the status code
        if (response.statusCode !== 200) {
            return console.log(new Date().getTime() + 'Oops, something went wrong, looks like an error:', response.statusCode);
        }
        var $ = cheerio.load(body);
        shirtTitle = $('.shirt-details h1').first().contents().filter(function () {
            return this.nodeType == 3;
        }).text();
        shirtPrice = $(".price").first().text();
        shirtImage = $(".shirt-picture span img").first().attr("src");
        shirtUrl = shirtLink;
        shirtTime = new Date().toLocaleString();
        dataKept.push(shirtTitle, shirtPrice, shirtImage, shirtUrl, shirtTime);
        csvPopulate(dataKept);
    })
}

function csvPopulate(data){
    //Get the date for the file to be written
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var fileName = year + "-" + month + "-" + day;
    //create the CSV object and the stream object of data to write to the file system
    var csvStream = csv.createWriteStream({headers: false}),
        writableStream = fs.createWriteStream("data/" + fileName + ".csv");

    writableStream.on("finish", function(){
        console.log("DONE!");
    });

    csvStream.pipe(writableStream);
   //Pipe in each data object after iterating through them
    csvStream.write(data);
    csvStream.end();
}

//TODO: Don't forget error handling
//TODO: Take a look at Winston
