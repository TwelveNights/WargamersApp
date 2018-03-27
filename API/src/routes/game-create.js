var gamecreate = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

gamecreate.get('/genre', (req, res) => {
	var sql = 'SELECT genres.name ' +
  'FROM genres ' +
  'ORDER BY genres.name';
  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved genres'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving genres " + err);
		});
});

gamecreate.get('/publishers', (req, res) => {
	var sql = 'SELECT publishers.name ' +
  'FROM publishers ' +
  'ORDER BY publishers.name';
  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved publishers'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving publishers " + err);
		});
});

gamecreate.post('/:title/:publishers/:rating/:minPlayers/:maxPlayers/:minPlaytime/:maxPlaytime/:difficulty/:genres', (req, res) => {
	var sql = new PQ('INSERT INTO Game VALUES($1, $2, $3, $4, $5, $6, $7)');
	sql.values = [req.params.title, req.params.rating, req.params.minPlayers, req.params.maxPlayers, req.params.minPlaytime, req.params.maxPlaytime, req.params.difficulty];
	var sql2 = new PQ('INSERT INTO PublishedBy VALUES($1, $2, $3)');
	sql2.values = [];
	var sql3 = new PQ('INSERT INTO HasGenre VALUES($1, $2)');
	sql3.values = [];

	var result = {};

	db.task(t => {
		return t.none(sql)
			.then(() => {
					req.params.publishers.forEach((publisher) => {
						sql2.values = [publisher.name, req.params.title, publisher.datePublished];
						return t.none(sql2)
							.then(() => {
									req.params.genres.forEach((genre) => {
										sql3.values = [req.params.title, genre.name];
									})
							});
					});
			});
	})
		.then(() => {
			res.status(200)
				.json({
					status: 'success'
				});
		})
		.catch((error) => {
			console.error("Error - retrieved some kind of result when inserting a game");
		})
});

module.exports = gamecreate;
