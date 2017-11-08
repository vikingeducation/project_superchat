"use strict";
const redis = require("redis");
const client = redis.createClient();

const createMessage = (subkey, field1, value1, field2, value2) => {
	return new Promise((resolve, reject) => {
		client.hmset(subkey, field1, value1, field2, value2, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getMessage = subkey => {
	return new Promise((resolve, reject) => {
		client.hgetall(subkey, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const setCounter = (subkey, field, value) => {
	return new Promise((resolve, reject) => {
		client.hset(subkey, field, value, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getCounter = (subkey, field) => {
	return new Promise((resolve, reject) => {
		client.hvals(subkey, field, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const incrementCounter = (subkey, field, amount) => {
	return new Promise((resolve, reject) => {
		client.hincrby(subkey, field, amount, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const addItem = (key, item) => {
	return new Promise((resolve, reject) => {
		client.sadd(key, item, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const checkItemExists = (key, item) => {
	return new Promise((resolve, reject) => {
		client.sismember(key, item, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getItems = key => {
	return new Promise((resolve, reject) => {
		client.sadd(key, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

module.exports = {
	createMessage,
	getMessage,
	setCounter,
	getCounter,
	incrementCounter,
	addItem,
	checkItemExists,
	getItems
};
