// var casperLib = require('casper');
var	fs = require('fs'), casper;

// var people = readPeopleFromFile();
// fs.writeFile('newclients.json', JSON.stringify(people));
var people = [/*Some people object with fname, lname, email and zip*/];
var agents = [
	'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.60 Safari/537.17',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17',
	'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.15 (KHTML, like Gecko) Chrome/24.0.1295.0 Safari/537.15',
	'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:16.0.1) Gecko/20121011 Firefox/16.0.1',
	'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:15.0) Gecko/20120910144328 Firefox/15.0.2',
	'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
	'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
	'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
	'Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)',
	'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; Zune 4.7'
];

console.log("HERE THEY ARE", people.length);
submitFormForPeople(people);

function submitFormForPeople(inpeople){
	//pull a person from inpeople
	var p = inpeople.pop();
	
	//start casper
	casper = require('casper').create();
	casper.start();

	//get a random useragent
	var randNum = Math.ceil(Math.random() * 10);
	casper.userAgent(agents[randNum]);

	casper.thenOpen('SOME URL TO POST TO', function(r){
		var me = this;
		me.fill('#voterform',{
			'accountant': 'NAME OF SOME COMPANY',
			'taxservice': 'NAME OF SOME COMPANY',
			'votername': p.fname,
			'voterlname' : p.lname,
			'voteremail': p.email,
			'voterzip': p.zip
		});
		//me.captureSelector('data'+new Date().getTime()+'.png', '#wrapper');
		me.click('#submit');
		setTimeout(function(){
			me.captureSelector('done'+new Date().getTime()+'.png', 'body');
			//casper.exit();

			if(inpeople.length%10 == 0) console.log(inpeople.length);

			console.log(p.lname, p.fname, p.email);

			if(inpeople.length){
				submitFormForPeople(inpeople);
			}

		}, 1000);
	});


	casper.run(function(){
		
	});
}


function readPeopleFromFile(){
	var mypeople = [];
	var data = fs.readFileSync('clients.csv', 'utf8');
		// console.log(.length);
	data.split('\n')
	.forEach(function(row){
		var result = {};
		//how it was when it came out
		var rawName = /".+",/g.exec(row)[0];
		//then take the quotes out
		var names = rawName.replace(/"/g, '');
		//If it has a comma, it is <lastname>,<firstname/firstnames>
		if(names.split(",").length > 2){
			var splitNames = names.split(',');
			result.lname = splitNames[0];
			result.fname = splitNames[1];

		}else{
			result.fname = names;
			result.lname = names;
		}

		//load the email and the zip
		var leftOver = row.replace(rawName, "").split(',');
		result.email = leftOver[0];
		result.zip = leftOver[1];
		
		//trim spaces off the ends
		result.fname = result.fname.trim();
		result.lname = result.lname.trim();
		result.email = result.email.trim();
		result.zip = result.zip.trim();

		//check for any null values
		if(!isDef(result.fname) || !isDef(result.lname) || !isDef(result.email) || !isDef(result.zip)){
			console.log("SOME NULL VALUES",result);
		}
		
		mypeople.push(result);	
	});
	
	function isDef(obj){
		return obj && obj.length > 0
	}
	// console.log(data.split('\n').length);
	return mypeople;
}


