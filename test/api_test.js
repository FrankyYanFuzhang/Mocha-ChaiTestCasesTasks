process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const { get } = require('../server');
let app = require('../server');
app.port = 3000;

chai.use(chaiHttp);
let should = chai.should();

// var expect = chai.expect;

var uuid_global = "";

describe('/POST: Create function!', () => {

    let user = {
        "first_name": "johnDoe Test Create",
        "last_name": "Doe Create",
        "email": "johndoe@gmail.com",
        "phone": "1234-1234",
        "sex": "Male",
        "organization": "BR Softech Pvt Ltd",
        "designation": "Full Stack Developer",
        "salary": 1000
    };

    let user_Wrong = {
        "first_name": "John_Wrong",
        "last_name": "Doe",
        "email": "johndoe@gmail.com",
        "phone": 12341234,  // wrong filed type
        "sex": "Male",
        "organization": "BR Softech Pvt Ltd",
        "designation": "Full Stack Developer",
        "salary": "1000" // wrong filed type 
    };

    it('Expect to Return 200 and add successfully', (done) => {
        chai.request(app)
            .post('/api/create')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Employee added successfully!');
                res.body.should.have.property('uuid');
                res.body.uuid.length.should.be.eql(36);
                uuid_global = res.body.uuid;
                done();
            })
    });
    it('Expect to Return 400 since body field type is not match', (done) => {
        chai.request(app)
            .post('/api/create')
            .send(user_Wrong)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

})
describe('/Get: Read function!', () => {

    it('Expect 200 and get a user', (done) => {

        let uuid = {
            "uuid": uuid_global
        }
        chai.request(app)
            .get("/api/read")
            .send(uuid)
            .end((err, res) => {
                res.should.have.status(200);
                employee_example = res.body[0];
                employee_example.should.have.property('first_name');
                employee_example.should.have.property('last_name');
                employee_example.should.have.property('email');
                done();
            })
    })

    it('Expect 400 since id is not string', (done) => {

        let uuid = {
            "uuid": 00000000000000000000000000000000
        };

        chai.request(app)
            .get("/api/read")
            .send(uuid)
            .end((err, res) => {
                res.should.have.status(400);

                done();
            })
    })

    it('Expect 404 since id is not find', (done) => {

        let uuid = {
            "uuid": "00000000-0000-0000-0000-000000000000"
        };

        chai.request(app)
            .get("/api/read")
            .send(uuid)
            .end((err, res) => {
                res.should.have.status(404);

                done();
            })
    })

})
describe('/PUT: update function!', () => {
    it('1: Expect 200 status return!', (done) => {
        let employee = {
            "uuid": uuid_global,
            "first_name": "john Update!",
            "last_name": "Doe Update!"
        }
        chai.request(app)
            .put("/api/update")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('2: Expect 400 when any field type is not match.', (done) => {
        let employee = {
            "uuid": uuid_global,
            "first_name": 12341234, // not right field type.
            "last_name": "Lee"
        }
        chai.request(app)
            .put("/api/update")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    })

    it('3: Expect 404 status since no such uuid cound be find!', (done) => {
        let employee = {
            "uuid": "00000000-0000-0000-0000-00000000",
            "first_name": "Tom_test gogo!",
            "last_name": "Lee"
        }
        chai.request(app)
            .put("/api/update")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })
})
describe('/Delete: update function!', () => {
    it('1: Expect 200 status return!', (done) => {
        let employee = {
            "uuid": uuid_global,
        }
        chai.request(app)
            .del("/api/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('2: Expect 400 when any field type is not match.', (done) => {
        let employee = {
            "uuid": 12345678901234567890123456789012,
        }
        chai.request(app)
            .del("/api/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    })

    it('3: Expect 404 status since no such uuid cound be find!', (done) => {
        let employee = {
            "uuid": uuid_global,
        }
        chai.request(app)
            .del("/api/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })
})

