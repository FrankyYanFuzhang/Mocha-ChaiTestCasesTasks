const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3356;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {

	res.send("Hello World");
});

const employeeRoutes = require('./src/routes/employee.routes')

app.use('/profile', employeeRoutes)

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});


module.exports = app;
