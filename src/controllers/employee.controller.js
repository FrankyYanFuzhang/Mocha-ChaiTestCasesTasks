'use strict';
const Employee = require('../models/employee.model');
const Validator = require('jsonschema').Validator;
const v = new Validator();

function obVali(ob) {

    var uuid_Schema = {
        "type": "object",
        "properties": {
            "name": { "type": "string" },
            "tel": { "type": "string" },
            "age": { "type": "number" },
            "isMarried": { "type": "boolean" },
            "sex": { "type": "string" },
            "address": { "type": "string" },
        },
        "required": ["name", "tel", "age",
            "isMarried", "sex", "address"]
    };

    var valid_res = v.validate(ob, uuid_Schema);

    return valid_res.valid;
}

function idVali(ob) {

    var uuid_Schema = {
        "type": "object",
        "properties": {
            "id": { "type": "string" },
        },
        "required": ["id"]
    };

    var valid_res = v.validate(ob, uuid_Schema);
    return valid_res.valid;
}

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
    if (obVali(new_employee) === false) {
        res.status(400).json({
            error: true, message: "Return 400 when any request body field type is not match"
        });
    } else {
        const { v4: uuidv4 } = require('uuid');
        new_employee.id = uuidv4();;
        //handles null error
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.status(400).send({ error: true, message: 'Please provide all required field' });
        } else {
            Employee.create(new_employee, function (err, employee) {
                if (err)
                    res.send(err);
                console.log("test",employee);
                res.json(
                    {
                        error: false,
                        message: "Employee added successfully!",
                        data: employee,
                        id: new_employee.id
                    });
            });
        }

    }
    // ------

};

exports.findById = function (req, res) {

    if (idVali(req.body) === false) {
        res.status(400).json({ message: "Return 400 when id is not string." });
    } else {
        Employee.findById(req.body.id, function (err, employee) {
            console.log("controller test",req.body);
            if (err)
                res.send(err);
            else if (employee.length === 0) {
                res.status(404).json({ message: "Cannot find this user!" });
            } else {
                
                if(employee[0].isMarried==1){
                    employee[0].isMarried=true;
                }else if(employee[0].isMarried==0){
                    employee[0].isMarried=false;
                }
                
                delete employee[0].created_at;
                delete employee[0].updated_at;

                res.json(employee);
            }
        });
    }
};

exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {

        var emp = new Employee(req.body);

        Employee.findById(emp.id, function (err, employee) {

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

                if(emp.isMarried===0){
                    emp.isMarried=false;
                }else if(emp.isMarried===1){
                    emp.isMarried=true;
                }

                if (obVali(emp) === false) {
                    res.status(400).json({
                        error: true, message: "Return 400 when any request body field type is not match"
                    });
                } else {
                    Employee.update(emp.id, emp, function (err, employee) {
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
    if (idVali(req.body) === false) {
        res.status(400).json({ message: "Return 400 when id is not string." });
    } else {
        Employee.findById(req.body.id, function (err, employee) {
            if (err)
                res.send(err);
            else if (employee.length === 0) {
                res.status(404).json({ message: "Cannot find this user!" });
            } else {
                Employee.delete(req.body.id, function (err, employee) {
                    if (err)
                        res.send(err);
                    res.json({ error: false, message: 'Employee successfully deleted' });
                });
            }
        });
    }




}
