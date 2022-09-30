'use strict';
const Employee = require('../models/employee.model_uuid');
exports.findAll = function (req, res) {
  Employee.findAll(function (err, employee) {
    console.log('controller')
    if (err)
      res.send(err);
    console.log('res', employee);
    res.send(employee);
  });
};

exports.create = function (req, res) {
  const new_employee = new Employee(req.body);

  console.log(new_employee);
  //------Validator
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  var uuid_Schema = {
    "type": "object",
    "properties": {
      "id": { "type": "number" },
      "first_name": { "type": "string" },
      "last_name": { "type": "string" },
      "email": { "type": "string" },
      "phone": { "type": "string" },
      "organization": { "type": "string" },
      "designation": { "type": "string" },
      "salary": { "type": "number" },
      "uuid": { "type": "string" },
    },
    "required": ["first_name", "last_name", "email", "phone",
      "organization", "designation", "salary"]
  };

  var valid_res = v.validate(new_employee, uuid_Schema);
  if (valid_res.valid === false) {
    res.status(400).json({
      error: true, message: "Return 400 when any request body field type is not match"
    });
  } else {
    const { v4: uuidv4 } = require('uuid');
    new_employee.uuid = uuidv4();;
    //handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
      Employee.create(new_employee, function (err, employee) {
        if (err)
          res.send(err);
        res.json(
          {
            error: false,
            message: "Employee added successfully!",
            data: employee,
            uuid: new_employee.uuid
          });
      });
    }

  }
  // ------

};

exports.findByUuid = function (req, res) {

  if (req.body.uuid.constructor !== String) {
    res.status(400).json({ message: "Return 400 when id is not string." });
  }

  Employee.findByUuid(req.body.uuid, function (err, employee) {

    if (err)
      res.send(err);
    else if (employee.length === 0) {
      res.status(404).json({ message: "Cannot find this user!" });
    } else {
      res.json(employee);
    }
  });

};

exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field' });
  } else {

    var emp = new Employee(req.body);

    Employee.findByUuid(emp.uuid, function (err, employee) {

      if (err)
        res.send(err);
      else if (employee.length === 0) {
        res.status(404).json({ message: "Cannot find this user!" });
      } else {
        for (const o of Object.keys(emp)) {
          if (emp[o] === undefined) {
            emp[o] = employee[0][o];
          }
        }

        var Validator = require('jsonschema').Validator;
        var v = new Validator();
        var uuid_Schema = {
          "type": "object",
          "properties": {
            "id": { "type": "number" },
            "first_name": { "type": "string" },
            "last_name": { "type": "string" },
            "email": { "type": "string" },
            "phone": { "type": "string" },
            "organization": { "type": "string" },
            "designation": { "type": "string" },
            "salary": { "type": "number" },
            "uuid": { "type": "string" },
          },
          "required": ["first_name", "last_name", "email", "phone",
            "organization", "designation", "salary"]
        };

        console.log(emp);

        var valid_res = v.validate(emp, uuid_Schema);
        // console.log(valid_res.valid)
        if (valid_res.valid === false) {
          res.status(400).json({
            error: true, message: "Return 400 when any request body field type is not match"
          });
        } else {
          Employee.update(emp.uuid, emp, function (err, employee) {
            if (err)
              res.send(err);
            res.json({ error: false, message: 'Employee successfully updated' });
          });
        }


      }
    });
  }
};

exports.delete = function (req, res) {
  if (req.body.uuid.constructor !== String) {
    res.status(400).json({ message: "Return 400 when id is not string." });
  } else {
    Employee.findByUuid(req.body.uuid, function (err, employee) {

      if (err)
        res.send(err);
      else if (employee.length === 0) {
        res.status(404).json({ message: "Cannot find this user!" });
      } else {
        Employee.delete(req.body.uuid, function (err, employee) {
          if (err)
            res.send(err);
          res.json({ error: false, message: 'Employee successfully deleted' });
        });
      }
    });
  }




}
