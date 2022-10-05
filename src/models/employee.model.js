'use strict';
var dbConn = require('../../config/db.config');
//Employee object create
var Employee = function (employee) {
	this.id = employee.id;
	this.name = employee.name;
	this.tel = employee.tel;
	this.age = employee.age;
	this.isMarried = employee.isMarried;
	this.sex = employee.sex;
	this.address = employee.address;
	this.created_at = new Date();
	this.updated_at = new Date();
};
Employee.create = function (newEmp, result) {
	console.log(newEmp);
	dbConn.query("INSERT INTO employees set ?", newEmp, function (err, res) {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		else {
			result(null, res);
		}
	});
};
Employee.findById = function (id, result) {
	dbConn.query("Select * from employees where id = ? ", id, function (err, res) {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		else {
			// console.log(res);
			result(null, res);
		}
	});
};
Employee.findAll = function (result) {
	dbConn.query("Select * from employees", function (err, res) {
		if (err) {
			console.log("error: ", err);
			result(null, err);
		}
		else {
			console.log('employees : ', res);
			result(null, res);
		}
	});
};

Employee.update = function (id, employee, result) {
	dbConn.query("UPDATE employees SET name=?,tel=?,age=?,isMarried=?,sex=?,address=? WHERE id = ?", [employee.name, employee.tel, employee.age, employee.isMarried, employee.sex, employee.address, id], function (err, res) {
		if (err) {
			console.log("error: ", err);
			result(null, err);
		} else {
			result(null, res);
		}
	});
};



Employee.delete = function (id, result) {
	dbConn.query("DELETE FROM employees WHERE id = ? ", [id], function (err, res) {
		if (err) {
			console.log("error: ", err);
			result(null, err);
		}
		else {
			result(null, res);
		}
	});
};
module.exports = Employee;