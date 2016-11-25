var express = require('express'); // require Express
var router = express.Router(); // setup usage of the Express router engine

/* PostgreSQL and PostGIS module and connection setup. */
var pg = require("pg");//require Postgres module
var conString = "postgres://postgres:postgres@localhost/semester1"; //Connects to the database using the parameters provided

/* Set up your database query to display GeoJSON */
var trafiktal_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json(( gid, t_nr, vejnavn, beskrivels, husnummer, taellested, kode_type, ktj_7_19, tung_pct, aadt_koret, hvdt_koret, cykler_7_1, aadt_cykle, hvdt_cykle, aar, link)) As properties FROM trafiktal As lg) As f) As fc";
var biblioteker_query ="SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json(( gid, navn, adresse, post_nr, postdistri, e_mail, link, kkorgnr, id, geom)) As properties FROM biblioteker As lg) As f) As fc";

/* GET home page. */
router.get('/', function(req,res) {
  res.render('index', {
      title: 'Express'
  });
});

/* GET Hello World Page. */
router.get('/helloworld', function(req,res) {
  res.render('helloworld', {
      title: 'Hello World'
  });
});

/* GET Postgres JSON data. */
router.get('/data', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(biblioteker_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});


/* GET Postgres JSON data. */
router.get('/info', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(trafiktal_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});

/* GET the map page. */

router.get('/map', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(biblioteker_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var data = result.rows[0].row_to_json
        res.render('map', {
            title: "Semester 1 Project",
            jsonData: data
        });
    });
});

router.get('/trafiktal', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(trafiktal_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var info = result.rows[0].row_to_json
        res.render('map', {
            title: "Semester 1 Project",
            jsonData: info
        });
    });
});


module.exports = router;
