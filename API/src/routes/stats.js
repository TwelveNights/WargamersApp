var stats = require('express').Router();
var db = require('../db');


stats.get('/game/:rating', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT title, rating ' +
            'FROM games WHERE rating = ' +
            '( SELECT ' + aggregation + '(g.rating) FROM games g)';

  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved info'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving game info " + err);
    });
});

/**
 * it should do a query where it finds all the events with the same name,
 * takes an average of the members attending each of these events,
 * and then return the event with the max/min average attendees
 */
stats.get('/event/:attendance', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.attendance === 'lowest') {
    aggregation = 'MIN';
  }
  var sql1 = 'SELECT name, COUNT(a) as attendees ' +
    'FROM events e, attends a ' +
    'WHERE a.eventName = e.name ' + ' AND a.eventDate = e.date ' +
    'GROUP BY e.name, e.date ';
  var sql2 = 'SELECT c.name, AVG(c.attendees) as avg' +
    ' FROM (' +sql1 + ') c ' +
    'GROUP BY c.name';
  var sql3 = '(SELECT ' + aggregation + '(x.avg) as max' +
  ' FROM (' + sql2 + ') x)';
  var sql = 'SELECT y.name, y.avg' +
            ' FROM (' + sql2 + ') y,  ' + sql3 + ' z' +
            ' WHERE y.avg = z.max';

  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved info'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving game info " + err);
    });
});
/**
 * Return the memberNumber and Name of members who have attended all events that were hosted this year.
 */
stats.get('/members', (req, res) => {
  var sql = 'SELECT I.name FROM members I WHERE I.memberNumber = (SELECT M.membernumber FROM members M EXCEPT' +
    '(SELECT DISTINCT memberNumber FROM ((SELECT M.memberNumber, E.name, E.date FROM members M, events E WHERE E.date '+
    'between \'2017-09-01\' AND \'2018-05-01\') EXCEPT (SELECT * FROM Attends WHERE Attends.eventdate between' +
    ' \'2017-09-01\' AND \'2018-05-01\')) AS foo));'
  db.any(sql)
    .then (function (data){
      res.status(200)
        .json({
          status: 'success',
          data:data,
          message: 'Retrieved Info'
        })
    })
    .catch(function (err) {
      console.error("Error getting MVP: " + err);
    })
});

module.exports = stats;
