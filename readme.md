# LeagueChallenge

The code repository for the League of Legends 3k Challenge statistic tool. A quick and dirty leaderboard for tracking a handful of basic statistics for a set of Summoners.

## Stack

* Express (Back-end framework)
* Node (JS platform)
* Gulp (task runner)
* Npm (back-end package manager)
* Bower (front-end package manager)
* Stylus (CSS pre-processor)

## Dependencies

* Install [Node](http://nodejs.org/)
* Install [Gulp](http://gulpjs.com/) globally
    * `npm install -g gulp`
* Install [Bower](http://bower.io/) globally
    * `npm install -g bower`

## Installation

1. `git clone git@bitbucket.org:porostar/leaguechallenge.git`
3. `npm install`
4. `bower install`
5. Document your api key in './data/apiKey.js'
5. Document your summoners in './data/summoners.js'

## Running / Development

1. `gulp`
2. Navigate to localhost:1337
