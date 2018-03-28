var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var gameinfo = require('./game-info');
var gamecreate = require('./game-create');
var borrowed = require('./borrowed');
var eventinfo = require('./event-info');
var eventcreate = require('./event-create');
var stats = require('./stats.js');
var search = require('./search');
var login = require('./login');


routes.use('/games', games);
routes.use('/events', events);
routes.use('/game-info', gameinfo);
routes.use('/game-create', gamecreate);
routes.use('/event-info', eventinfo);
routes.use('/event-create', eventcreate);
routes.use('/stats', stats);
routes.use('/search', search);
routes.use('/login', login);
routes.use('/borrowed', borrowed);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;
