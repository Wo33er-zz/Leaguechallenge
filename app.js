var express = require('express');
var exphbs  = require('express-handlebars');
var stylus = require('stylus');

var request = require('request');
var async = require("async");

var util = require('util');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'master'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views/');
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

function summonerByNames(names, callback) {
  var apiKey = require('./data/apiKey.js');
  var region = "na";
  var summonerData = [];

  request({
    url: "https://"+ region +".api.pvp.net/api/lol/"+ region +"/v2.2/summoner/by-name/"+ names +"?api_key="+ apiKey,
    json: true
  }, function (error, response, body) {
    if (error || response.statusCode != 200) {
      return callback(error);
    }
    else {
      for (var key in body) {
        if (!body.hasOwnProperty(key)) continue;
        summonerData.push({
          summonerId: body[key]['summonerId'],
          name: body[key]['summonerName'],
          icon: body[key]['profileIcon']
        });
      }

      callback(null, summonerData);
    }
  });
}

function rankedStatsBySummonerId(summonerId, callback) {
  var apiKey = require('./data/apiKey.js');
  var region = "na";
  var seasons = "SEASON2016";
  var rankedData = {};

  request({
    url: "https://"+ region +".api.pvp.net/api/lol/"+ region +"/v2.2/ranked-stats/by-summoner/"+ summonerId +"/aggregated?seasons="+ seasons +"&api_key="+ apiKey,
    json: true
  }, function (error, response, body) {
    if (error || response.statusCode != 200) {
      return callback(error);
    }
    else {
      rankedData = {
        games: body.statistics.totalGames,
        wins: body.statistics.totalWins.toLocaleString(),
        gold: body.statistics.goldEarned,
        damageDealt: body.statistics.totalDamageDealt,
        damageTaken: body.statistics.totalDamageTaken,
        maxKills: body.statistics.maxKills,
        maxDeaths: body.statistics.maxDeaths,
        maxAssists: body.statistics.maxAssists,
        killSpree: body.statistics.largestKillingSpree,
        killDouble: body.statistics.doubleKills,
        killTriple: body.statistics.tripleKills,
        killQuadra: body.statistics.quadraKills,
        killPenta: body.statistics.pentaKills,
        kills: body.statistics.kills,
        deaths: body.statistics.deaths,
        assists: body.statistics.assists,
        minions: body.statistics.minionsKilled,
        minionsJungle: body.statistics.neutralMinionsKilled,
        avKills: Math.round(body.statistics.kills/body.statistics.totalGames, 1),
        avDeaths: Math.round(body.statistics.deaths/body.statistics.totalGames, 1),
        avAssists: Math.round(body.statistics.assists/body.statistics.totalGames, 1),
        avMinions: Math.round(body.statistics.minionsKilled/body.statistics.totalGames, 1),
        avGold: Math.round(body.statistics.goldEarned/body.statistics.totalGames, 1).toLocaleString(),
        avDamage: Math.round(body.statistics.totalDamageDealt/body.statistics.totalGames, 1).toLocaleString(),
      }
      callback(null, rankedData);
    }
  });
}

app.get('/', (req, res) => {
  var summonersData = [];
  var statsData = [];
  var names = require('./data/summoners.js').toString().replace(" ","%20");

  async.waterfall([
    function(callback){
      summonerByNames(names, function(err, summoners) {
        if (err) return callback(err);
        //console.log("Summoners: " + summoners);
        summonersData.push(summoners);
        callback(null, summonersData[0]);
      });
    },
    function(summoners, callback){
      console.log("Summoners Received: " + summoners);

      async.forEach(summoners, function(summoner, callback) {
        //console.log("Looping For Sum: " + summoner.name);
        rankedStatsBySummonerId(summoner.summonerId, function(err, summonerStats) {
          if (err) return callback(err);
          //console.log("SumStats: " + summonerStats);
          summoner = Object.assign(summoner, summonerStats)
          statsData.push(summoner);
          callback();
        });
      }, function(err) {
        if (err) return next(err);
        callback(null, statsData);
      });
    }
  ], function (err, data) {
    console.log(util.inspect(data, false, null))
    res.render('home', {
      data
    });
  });
});

app.use(require('connect-livereload')({
  port: 35729
}));

app.listen(1337, () => {
  console.log('Visit website at http://localhost:1337!');
});
