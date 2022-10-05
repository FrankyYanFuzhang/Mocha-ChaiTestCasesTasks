const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employee.controller');
// Retrieve all employees
router.get('/', employeeController.findAll);
// Create a new employee
router.post('/create', employeeController.create);
// Retrieve a single employee with id
router.post('/read', employeeController.findById);
// Update a employee with id
router.post('/update', employeeController.update);
// Delete a employee with id
router.delete('/delete', employeeController.delete);
module.exports = router