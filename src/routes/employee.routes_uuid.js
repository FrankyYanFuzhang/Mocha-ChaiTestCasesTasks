const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employee.controller_uuid');
// Retrieve all employees
router.get('/', employeeController.findAll);
// Create a new employee
router.post('/create', employeeController.create);
// Retrieve a single employee with id
router.get('/read', employeeController.findByUuid);
// Update a employee with id
router.put('/update', employeeController.update);
// Delete a employee with id
router.delete('/delete', employeeController.delete);
module.exports = router