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
        console.log("test-id:!", id);
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

describe('SqlInjection Test: Valid', () => {

    var valid_obj = [
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "this is a valid name" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "12345!@^&*()_" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "account@gmial.com" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "password12345!.~" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "below are invalid string" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f" }
    ]

    valid_obj.forEach(v => {
        it('Valid SQL Injection: Expect 200 status return!', (done) => {
            chai.request(app)
                .post("/profile/update")
                .send(v)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })
})

describe('SqlInjection Test: InValid', () => {

    var valid_obj = [
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "' GROUP BY columnnames having 1=1 --" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "' UNION SELECT sum(columnname ) from tablename --" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "' AND id IS NULL; --" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "-- or #" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "dfdfdf' OR 1 -- -" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "OR 3409=3409 AND ('pytW' LIKE 'pytY" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "HAVING 1=0--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "AND 1083=1083 AND (1427=1427" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "AS INJECTX WHERE 1=1 AND 1=0" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "WHERE 1=1 AND 1=1--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "ORDER BY 6--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "IF(7423=7424) SELECT 7423 ELSE DROP FUNCTION xcjl--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "and (select substring(@@version,1,1))='M'" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "RLIKE (SELECT (CASE WHEN (4346=4347) THEN 0x61646d696e ELSE 0x28 END)) AND 'Txws'='" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "1)) or sleep(5)#" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "';waitfor delay '0:0:5'--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "\") or benchmark(10000000,MD5(1))#" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "AND (SELECT * FROM (SELECT(SLEEP(5)))nQIP)" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "OR 2947=LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(500000000/2))))" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "UNION ALL SELECT 1,2,3,4,5,6,7,8,9,10" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "UNION SELECT @@VERSION,SLEEP(5),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "AND 5650=CONVERT(INT,(UNION ALL SELECTCHAR(88)+CHAR(88)+CHAR(88)+CHAR(88)))--" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "' or '' '" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "') or ('x')=('x" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "admin' or '1'='1'/*" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "admin\" or \"1\"=\"1\"/*" },
        { "id": "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f", "name": "admin\") or (\"1\"=\"1\"#" },

    ]

    valid_obj.forEach(v => {
        it('!InValid! SQL Injection: Expect 200 status return!', (done) => {
            chai.request(app)
                .post("/profile/update")
                .send(v)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        })
    })
})
