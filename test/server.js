var assert = require('assert'),
	should = require('should'),
	request = require('request'),
	common = require('./common'),
	server = common.server;

describe('Server', function() {

	var auth = {
		user: server.config.apikey,
		password: ''
	};

	it('API-237: should return 201 when POST/Creating a record', function(next) {
		request({
			method: 'POST',
			uri: 'http://localhost:' + server.port + '/appc.mongo/super_post',
			auth: auth,
			data: {
				Hello: 'you! ' + Date.now(),
				Foo: 'Bar we drink in moderation, yes?'
			},
			json: true
		}, function(err, response, body) {
			assert.ifError(err);
			should(response.statusCode).equal(201);
			should(response.headers.location).be.ok;
			should(body).be.not.ok;
			next();
		});
	});

	it('API-237: should return 404 when GET/Querying without results', function(next) {
		request({
			method: 'GET',
			uri: 'http://localhost:' + server.port + '/appc.mongo/super_post/query',
			auth: auth,
			qs: {
				where: {
					Hello: 'some invalid value for the field that exists no where'
				},
				skip: 10000,
				limit: 1
			}
		}, function(err, response, body) {
			assert.ifError(err);
			should(response.statusCode).equal(404);
			should(body).be.ok;
			body = JSON.parse(body);
			should(body).have.property('success',false);
			should(body).have.property('code',404);
			should(body).have.property('message',"Not Found");
			next();
		});
	});

});