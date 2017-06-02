'use strict';

var fs = require('fs');
var Promise = require('bluebird');

var db = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    database: 'promises_presentation'
  }
});

var tableSchema = function (table) {
  table.increments();
  table.integer('duration');
  table.dateTime('start_date');
  table.dateTime('end_date');
  table.integer('start_station_id');
  table.string('start_station_nm');
  table.integer('end_station_id');
  table.string('end_station_nm');
  table.string('bike_id');
  table.boolean('is_registered');
  table.timestamps();
};

function getFormattedData(data) {
  return data.filter(function (row) {
    return (
      row.Duration &&
      row['Start date'] &&
      row['End date'] &&
      row['Start station number'] &&
      row['End station number'] &&
      row['End station'] &&
      row['Bike number'] &&
      row['Member Type']
    );
  })
  .map(function (row) {
    return {
      duration: row.Duration,
      start_date: row['Start date'],
      end_date: row['End date'],
      start_station_id: row['Start station number'],
      start_station_nm: row['Start station'],
      end_station_id: row['End station number'],
      end_station_nm: row['End station'],
      bike_id: row['Bike number'],
      is_registered: row['Member Type'] === 'Registered',
      created_at: new Date(),
      updated_at: new Date()
    };
  });
}

function readDataFromFile(fileName) {
  return new Promise(function (resolve, reject) {
    return fs.readFile('../data/' + fileName + '.json', 'utf-8', function (error, data) {
      if (error) {
        reject(error);
        return;
      }
      try {
        resolve(getFormattedData(JSON.parse(data)));
      } catch (err) {
        reject(err);
      }
    });
  });
}

db.schema.createTableIfNotExists('trip_history', tableSchema)
.then(function () {
  return Promise.reduce(['trip_data_1', 'trip_data_2', 'trip_data_3'], function (accumulator, value) {
    return readDataFromFile(value)
    .then(function (val) {
      return accumulator.concat(val);
    });
  }, []);
})
  .then(function (data) {
    console.log(data);
    return db('trip_history').insert(data);
  })
.then(function () {
  console.log('Data Inserted');
  process.exit();
})
.catch(function (error) {
  console.log(error);
  process.exit(1);
});
