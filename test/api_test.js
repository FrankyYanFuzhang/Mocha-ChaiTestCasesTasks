process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const { get } = require('../server');
let app = require('../server');
app.port = 3306;

chai.use(chaiHttp);
let should = chai.should();

// var expect = chai.expect;

var id_global = "";

describe('/POST: Create function!', () => {

    let user = {
        "name": "johnDoe",
        "tel": "1234-1234",
        "age": 18,
        "isMarried": false,
        "sex": "Male",
        "address": "Tai Po, hk"
    };

    let user_Wrong = {
        "name": "johnDoe",
        "tel": "1234-1234",
        "age": "18",    //wrong data type
        "isMarried": false,
        "sex": "Male",
        "address": "Tai Po, hk"
    };

    it('Expect to Return 200 and add successfully', (done) => {
        chai.request(app)
            .post('/profile/create')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Employee added successfully!');
                res.body.should.have.property('id');
                res.body.id.length.should.be.eql(36);
                id_global = res.body.id;
                done();
            })
    });
    it('Expect to Return 400 since body field type is not match', (done) => {
        chai.request(app)
            .post('/profile/create')
            .send(user_Wrong)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

})
describe('/Get: Read function!', () => {

    it('Expect 200 and get a user', (done) => {

        let id = {
            "id": id_global
        }
        console.log("test-id:!",id);
        chai.request(app)
            .post("/profile/read")
            .send(id)
            .end((err, res) => {
                console.log(id);
                res.should.have.status(200);
                employee_example = res.body[0];
                employee_example.should.have.property('name');
                employee_example.should.have.property('tel');
                employee_example.should.have.property('age');
                done();
            })
    })

    it('Expect 400 since id is not string', (done) => {

        let id = {
            "id": 00000000000000000000000000000000
        };

        chai.request(app)
            .post("/profile/read")
            .send(id)
            .end((err, res) => {
                res.should.have.status(400);

                done();
            })
    })

    it('Expect 404 since id is not find', (done) => {

        let id = {
            "id": "00000000-0000-0000-0000-000000000000"
        };

        chai.request(app)
            .post("/profile/read")
            .send(id)
            .end((err, res) => {
                res.should.have.status(404);

                done();
            })
    })

})
describe('/PUT: update function!', () => {
    it('1: Expect 200 status return!', (done) => {
        let employee = {
            "id": id_global,
            "name": "tom lee",
        }
        chai.request(app)
            .post("/profile/update")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('2: Expect 400 when any field type is not match.', (done) => {
        let employee = {
            "id": id_global,
            "tel": 12341234, // not right field type.
            "name": "tom lee"
        }
        chai.request(app)
            .post("/profile/update")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    })

    it('3: Expect 404 status since no such id cound be find!', (done) => {
        let employee = {
            "id": "00000000-0000-0000-0000-00000000",
            "name": "tom lee"
        }
        chai.request(app)
            .post("/profile/update")
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
            "id": id_global,
        }
        chai.request(app)
            .del("/profile/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('2: Expect 400 when any field type is not match.', (done) => {
        let employee = {
            "id": 12345678901234567890123456789012,
        }
        chai.request(app)
            .del("/profile/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    })

    it('3: Expect 404 status since no such id cound be find!', (done) => {
        let employee = {
            "id": id_global,
        }
        chai.request(app)
            .del("/profile/delete")
            .send(employee)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })
})

