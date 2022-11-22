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
        it('!InValid! SQL Injection: Expect 400 status return!', (done) => {
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

testID = "90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f"

var Invalid = {
    "case-1.1": { "id": testID, "name": "' OR 1 -- -" },
    "case-2.1": { "id": testID, "name": "\" OR 1 = 1 -- -" },
    "case-3.1": { "id": testID, "name": "' OR 1 -- -" },
    "case-4.1": { "id": testID, "name": "' or ''-'" },
    "case-5.1": { "id": testID, "name": "\" or \"\"-\"" },
    "case-6.1": { "id": testID, "name": "admin\" or \"1\"=\"1\"--" },
    "case-7.1": { "id": testID, "name": "admin\" or 1=1 or \"\"=\"" },
    "case-8.1": { "id": testID, "name": "admin\") or (\"1\"=\"1\"#" },
    "case-9.1": { "id": testID, "name": "')) or (('x'))=(('x" },
    "case-10.1": { "id": testID, "name": "' or 'x'='x" },
    "case-11.1": { "id": testID, "name": "\" or \"x\"=\"x" },
    "case-12.1": { "id": testID, "name": "admin') or '1'='1'--" },
    "case-13.1": { "id": testID, "name": "admin\") or \"1\"=\"1\"--" },
    "case-14.1": { "id": testID, "name": "' or true--" },
    "case-15.1": { "id": testID, "name": "\") or true--" },
    "case-16.1": { "id": testID, "name": "or 1=1--" },
    "case-17.1": { "id": testID, "name": "' and 1 in (select min(name) from sysobjects where xtype = 'U' and name > '.') --" },
    "case-18.1": { "id": testID, "name": ",(select * from (select(sleep(10)))a)" },
    "case-19.1": { "id": testID, "name": "RLIKE (SELECT (CASE WHEN (4346=4346) THEN 0x61646d696e ELSE 0x28 END)) AND 'Txws'='" },
    "case-20.1": { "id": testID, "name": "and (select substring(@@version,1,1))='X' a" },
    "case-21.1": { "id": testID, "name": "AND (SELECT * FROM (SELECT(SLEEP(5)))bAKL) AND 'vRxe'='vRxe" },
    "case-22.1": { "id": testID, "name": "(SELECT * FROM (SELECT(SLEEP(5)))ecMj)--" },
    "case-23.1": { "id": testID, "name": "AND (SELECT 4523 FROM(SELECT COUNT(*),CONCAT(0x716a7a6a71,(SELECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2)) FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY )a)" },
    "case-24.1": { "id": testID, "name": "UNION ALL SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15" },
    "case-25.1": { "id": testID, "name": "UNION ALL SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15--" },
    "case-26.1": { "id": testID, "name": "-1' UNION SELECT 1,2,3--+" },
    "case-27.1": { "id": testID, "name": "-1 UNION SELECT 1 INTO @,@,@" },
    "case-28.1": { "id": testID, "name": "'''''''''''''UNION SELECT '2" },
    "case-29.1": { "id": testID, "name": "UNION SELECT @@VERSION,SLEEP(5),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15" },
    "case-30.1": { "id": testID, "name": "UNION ALL SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15--" },
    "case-31.1": { "id": testID, "name": "UNION ALL SELECT USER()--" },
    "case-32.1": { "id": testID, "name": "AND 5650=CONVERT(INT,(UNION ALL SELECTCHAR(88)))--" },
    "case-33.1": { "id": testID, "name": "AND 5650=CONVERT(INT,(UNION ALL SELECTCHAR(88)+CHAR(88)+CHAR(88)))#" },
    "case-34.1": { "id": testID, "name": "UNION ALL SELECT 'INJ'||'ECT'||'XXX',2,3,4,5,6,7,8,9,10,11,12,13,14,15--" },
    "case-35.1": { "id": testID, "name": "1234 ' AND 1=0 UNION ALL SELECT 'admin', '81dc9bdb52d04dc20036dbd8313ed055" },
    "case-36.1": { "id": testID, "name": "' UNION SELECT sum(columnname ) from tablename --" },
    "case-37.1": { "id": testID, "name": "1 AND (SELECT * FROM Users) = 1" },
    "case-38.1": { "id": testID, "name": "' and 1 in (select min(name) from sysobjects where xtype = 'U' and name > '.') --" },
    "case-39.1": { "id": testID, "name": ",(select * from (select(sleep(10)))a)" },
    "case-40.1": { "id": testID, "name": "AND (SELECT * FROM (SELECT(SLEEP(5)))nQIP)--" },
    "case-41.1": { "id": testID, "name": "(SELECT * FROM (SELECT(SLEEP(5)))ecMj)--" },
    "case-42.1": { "id": testID, "name": "AND (SELECT 4523 FROM(SELECT COUNT(*),CONCAT(0x716a7a6a71,(SELECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a)" },
    "case-43.1": { "id": testID, "name": ",(select * from (select(sleep(10)))a)" },
    "case-44.1": { "id": testID, "name": "1 or pg_sleep(5)--" },
    "case-45.1": { "id": testID, "name": "AND (SELECT * FROM (SELECT(SLEEP(5)))bAKL) AND 'vRxe'='vRxe" },
    "case-46.1": { "id": testID, "name": "(SELECT * FROM (SELECT(SLEEP(5)))ecMj)--" },
    "case-47.1": { "id": testID, "name": "ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15--" },
    "case-48.1": { "id": testID, "name": "UNION SELECT @@VERSION,SLEEP(5),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15#" },
    "case-49.1": { "id": testID, "name": "UNION ALL SELECT @@VERSION,USER(),SLEEP(5),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL--" },
    "case-50.1": { "id": testID, "name": "1' ORDER BY 1,2,3--+" },
    "case-51.1": { "id": testID, "name": "ORDER BY 15--" },
    "case-52.1": { "id": testID, "name": "ORDER BY 15#" },
    // "case-53.1" : { "id": testID, "name": "replace" },
    // "case-54.1" : { "id": testID, "name": "replace" },
    // "case-55.1" : { "id": testID, "name": "replace" },
    // "case-56.1" : { "id": testID, "name": "replace" },
    // "case-57.1" : { "id": testID, "name": "replace" },
    // "case-58.1" : { "id": testID, "name": "replace" },
    // "case-59.1" : { "id": testID, "name": "replace" },
    // "case-60.1" : { "id": testID, "name": "replace" },
}
// 
var Valid = {
    "case-1.2": [
        { "id": testID, "name": "' OR x1 -x- x-" },
        { "id": testID, "name": "' ORx 1 -x-x -" },
    ],
    "case-2.2": [
        { "id": testID, "name": "\" OR x1 = 1 -x- x-" },
        { "id": testID, "name": "\" OxR 1 = 1 -x- x-" },
        { "id": testID, "name": "\" ORx 1 = 1 -x- x-" },
    ],
    "case-3.2": [
        { "id": testID, "name": "' OR x1 -x- x-" },
        { "id": testID, "name": "' OxR 1 -x- x-" },
    ],
    "case-4.2": [
        { "id": testID, "name": "' or x''-'" },
        { "id": testID, "name": "' orx ''-'" },
        { "id": testID, "name": "' oxr ''-'" },
        { "id": testID, "name": "'x or ''-'" },
    ],
    "case-5.2": [
        { "id": testID, "name": "\" or x\"\"-\"" },
        { "id": testID, "name": "\" orx \"\"-\"" },
        { "id": testID, "name": "\" xor \"\"-\"" },
        { "id": testID, "name": "\" oxr \"\"-\"" },
    ],
    "case-6.2": [
        { "id": testID, "name": "axdmin\" or x\"1\"=\"1\"-x-" },
        { "id": testID, "name": "adxmin\" oxr \"1\"=\"1\"-x-" },
        { "id": testID, "name": "adminx\"x or \"1\"=\"1\"-x-" },
    ],
    "case-7.2": [
        { "id": testID, "name": "axdmin\" or x1=1 or \"\"=\"" },
        { "id": testID, "name": "adxmin\" oxr 1=1 or \"\"=\"" },
        { "id": testID, "name": "admixn\" oxr 1=1 or \"\"=\"" },
    ],
    "case-8.2": [
        { "id": testID, "name": "adminx\") or x(\"1\"=\"1\"#" },
        { "id": testID, "name": "admxin\") oxr (\"1\"=\"1\"#" },
        { "id": testID, "name": "adxmin\") xor (\"1\"=\"1\"#" },
    ],
    "case-9.2": [
        { "id": testID, "name": "')) or x(('x'))=(('x" },
        { "id": testID, "name": "')) oxr (('x'))=(('x" },
        { "id": testID, "name": "'))x or (('x'))=(('x" },
    ],
    "case-10.2": [
        { "id": testID, "name": "' oxr 'x'=x'x" },
        { "id": testID, "name": "' xor 'x'x='x" },
        { "id": testID, "name": "' or x'x'=x'x" },
    ],
    "case-11.2": [
        { "id": testID, "name": "\" or x\"x\"=\"x" },
        { "id": testID, "name": "\" oxr \"x\"=\"x" },
        { "id": testID, "name": "\"x or \"x\"=\"x" },
    ],
    "case-12.2": [
        { "id": testID, "name": "axdmin') or x'1'x='1'-x-" },
        { "id": testID, "name": "adxmin') oxr '1'=x'1'-x-" },
        { "id": testID, "name": "admixn') xor '1'x='1'-x-" },
    ],
    "case-13.2": [
        { "id": testID, "name": "admixn\") or x\"1\"=\"1\"-x-" },
        { "id": testID, "name": "axdmin\") oxr \"1\"=\"1\"-x-" },
        { "id": testID, "name": "admxin\")x or \"1\"=\"1\"-x-" },
    ],
    "case-14.2": [
        { "id": testID, "name": "' or xtrue-x-" },
        { "id": testID, "name": "' or trxue-x-" },
        { "id": testID, "name": "' oxr true-x-" },
    ],
    "case-15.2": [
        { "id": testID, "name": "\") or trxue-x-" },
        { "id": testID, "name": "\") orx true-x-" },
        { "id": testID, "name": "\") oxr true-x-" },
    ],
    "case-16.2": [
        { "id": testID, "name": "or x1=1-x-" },
        { "id": testID, "name": "orx 1=1-x-" },
        { "id": testID, "name": "oxr 1=1-x-" },
    ],
    "case-17.2": [
        { "id": testID, "name": "'x and x1 in (selecxt min(name) from sysobjects where xtype = 'U' anxd name > '.') -x-" },
        { "id": testID, "name": "' axndx 1 in (selxect min(name) from sysobjects where xtype = 'U' axnd name > '.') -x-" },
        { "id": testID, "name": "' anxd 1 in (sxelect min(name) from sysobjects where xtype = 'U'x and name > '.') -x-" },
    ],
    "case-18.2": [
        { "id": testID, "name": ",(selecxt * from (sxelect(sleepx(10)))a)" },
        { "id": testID, "name": ",(sexlect * from (selxect(slxeep(10)))a)" },
        { "id": testID, "name": ",(xselect * from (selecxt(sxleep(10)))a)" },
    ],
    "case-19.2": [
        { "id": testID, "name": "RLIKE (SELECxT (CASE WHEN (4346=4346) THEN 0x61646d696e ELSE 0x28 END)) AxND 'Txws'=x'" },
        { "id": testID, "name": "RLIKE (SELxECT (CASE WHEN (4346=4346) THEN 0x61646d696e ELSE 0x28 END)) ANxD 'Twxs'x='" },
        { "id": testID, "name": "RLIKE (SxELECT (CASE WHEN (4346=4346) THEN 0x61646d696e ELSE 0x28 END)) ANDx 'Txws'=x'" },
    ],
    "case-20.2": [
        { "id": testID, "name": "axnd (sxelect substring(@@version,1,1))='X'" },
        { "id": testID, "name": "anxd (selexct substring(@@version,1,1))='X'" },
        { "id": testID, "name": "axnd (selecxt substring(@@version,1,1))='X'" },
    ],
    "case-21.2": [
        { "id": testID, "name": "AxND (SELECxT * FROM (SxELECT(SLEEPx(5)))bAKL) AxND 'vRxe'=x'vRxe" },
        { "id": testID, "name": "ANxD (SELxECT * FROM (SELxECT(SLExEP(5)))bAKL) ANDx 'vRxe'x='vRxe" },
        { "id": testID, "name": "ANDx (xSELECT * FROM (SELECxT(SxLEEP(5)))bAKL) ANxD 'vRxe'=x'vRxe" },
    ],
    "case-22.2": [
        { "id": testID, "name": "(SELECxT * FROM (SxELECT(SLEEPx(5)))ecMj)-x-" },
        { "id": testID, "name": "(SELxECT * FROM (SELxECT(SLExEP(5)))ecMj)-x-" },
        { "id": testID, "name": "(SxELECT * FROM (SELECxT(SxLEEP(5)))ecMj)-x-" },
    ],
    "case-23.2": [
        { "id": testID, "name": "ANDx (SELECxT 4523 FROM(SELExCT COUNT(*),CONCAT(0x716a7a6a71,(SELExCT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BxY x)a)" },
        { "id": testID, "name": "AxND (SELECxT 4523 FROM(SELECxT COUNT(*),CONCAT(0x716a7a6a71,(SxELECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUPx BY x)a)" },
        { "id": testID, "name": "xANDx (SELxECT 4523 FROM(xSELECT COUNT(*),CONCAT(0x716a7a6a71,(SELxECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GRxOUP BY x)a)" },
    ],
    "case-24.2": [
        { "id": testID, "name": "UNION ALxL SELECT x1,2,3,4,5,6,7,8,9,10,11,12,13,14,15" },
        { "id": testID, "name": "UNIONx ALL SELECTx 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15" },
    ],
    "case-25.2": [
        { "id": testID, "name": "UNION ALL SELECxT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SELxECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SxELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
    ],
    "case-26.2": [
        { "id": testID, "name": "-1' UNION SELECxT 1,2,3-x-+" },
        { "id": testID, "name": "-1' UNION SELxECT 1,2,3-x-+" },
        { "id": testID, "name": "-1' UNION SxELECT 1,2,3-x-+" },
    ],
    "case-27.2": [
        { "id": testID, "name": "-1 UNION SELECTx 1 INTO @,@,@" },
        { "id": testID, "name": "-1 UNION SELxECT 1 INTO @,@,@" },
        { "id": testID, "name": "-1 UNION SxELECT 1 INTO @,@,@" },
    ],
    "case-28.2": [
        { "id": testID, "name": "'''''''''''''UNION SELECxT '2" },
        { "id": testID, "name": "'''''''''''''UNION SExLECT '2" },
        { "id": testID, "name": "'''''''''''''UNIxON SELECT '2" },
    ],
    "case-29.2": [
        { "id": testID, "name": "UNIxON SELECT @@VERSION,SxLEEP(5),USER(),BENxCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15" },
        { "id": testID, "name": "UNION SxELECT @@VERSION,SLExEP(5),USER(),BENCHMARKx(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15" },
        { "id": testID, "name": "UNION SELExCT @@VERSION,SLEEPx(5),USER(),BxENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15" },
    ],
    "case-30.2": [
        { "id": testID, "name": "UNION ALL SxELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SELxECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SELECxT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
    ],
    "case-31.2": [
        { "id": testID, "name": "UNION ALL SxELECT USER()-x- " },
        { "id": testID, "name": "UNION ALL SELxECT USER()-x- " },
        { "id": testID, "name": "UNION ALL SELECxT USER()-x- " },
    ],
    "case-32.2": [
        { "id": testID, "name": "ANxD 5650=CONVERT(INT,(UNION ALL SExLECTCHAR(88)))-x-" },
        { "id": testID, "name": "AxND 5650=CONVERT(INT,(UNION ALL SELxECTCHAR(88)))-x-" },
        { "id": testID, "name": "ANxD 5650=CONVERT(INT,(UNION ALL SELECxTCHAR(88)))-x-" },
    ],
    "case-33.2": [
        { "id": testID, "name": "ANxD 5650=CONVERT(INT,(UNION ALL SELECxTCHAR(88)+CHAR(88)+CHAR(88)))#" },
        { "id": testID, "name": "AxND 5650=CONVERT(INT,(UNION ALL SELxECTCHAR(88)+CHAR(88)+CHAR(88)))#" },
        { "id": testID, "name": "ANxD 5650=CONVERT(INT,(UNION ALL SxELECTCHAR(88)+CHAR(88)+CHAR(88)))#" },
    ],
    "case-34.2": [
        { "id": testID, "name": "UNION ALL xSELECT 'INJ'|x|'ECT'|x|'XXX',2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SELxECT 'INJ'|x|'ECT'|x|'XXX',2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "UNION ALL SELECxT 'INJ'|x|'ECT'|x|'XXX',2,3,4,5,6,7,8,9,10,11,12,13,14,15-x-" },
    ],
    "case-35.2": [
        { "id": testID, "name": "1234 ' ANxD 1=0 UNION ALL SxELECT 'adminx', '81dc9bdb52d04dc20036dbd8313ed055" },
        { "id": testID, "name": "1234 ' AxND 1=0 UNION ALL SExLECT 'admxin', '81dc9bdb52d04dc20036dbd8313ed055" },
        { "id": testID, "name": "1234 ' AxND 1=0 UNION ALL SELECxT 'axdmin', '81dc9bdb52d04dc20036dbd8313ed055" },
    ],
    "case-36.2": [
        { "id": testID, "name": "' UNION SELECxT sum(columnname ) from tablename -x-" },
        { "id": testID, "name": "' UNION SELxECT sum(columnname ) from tablename -x-" },
        { "id": testID, "name": "' UNION SxELECT sum(columnname ) from tablename -x-" },
    ],
    "case-37.2": [
        { "id": testID, "name": "1 xANDx (SELECxT * FROM Users) = 1" },
        { "id": testID, "name": "1 AxND (SELxECT * FROM Users) = 1" },
        { "id": testID, "name": "1 ANxD (SxELECT * FROM Users) = 1" },
    ],
    "case-38.2": [
        { "id": testID, "name": "' xandx 1 in (selecxt min(name) from sysobjects where xtype = 'U' xand name > '.') -x-" },
        { "id": testID, "name": "' axnd 1 in (selxect min(name) from sysobjects where xtype = 'U' axnd name > '.') -x-" },
        { "id": testID, "name": "' anxd 1 in (sxelect min(name) from sysobjects where xtype = 'U' anxd name > '.') -x-" },
    ],
    "case-39.2": [
        { "id": testID, "name": ",(selecxt * from (sexlect(sleep(x10)))a)" },
        { "id": testID, "name": ",(sxelect * from (selecxt(sleexp(10)))a)" },
        { "id": testID, "name": ",(sxelect * from (sexlect(sxleep(10)))a)" },
    ],
    "case-40.2": [
        { "id": testID, "name": "ANDx (SELECxT * FROM (xSELECT(SLEEPx(5)))nQIP)-x-" },
        { "id": testID, "name": "ANxD (SELxECT * FROM (SExLECT(SLExEP(5)))nQIP)-x-" },
        { "id": testID, "name": "AxND (xSELECT * FROM (SELECxT(SxLEEP(5)))nQIP)-x-" },
    ],
    "case-41.2": [
        { "id": testID, "name": "(SELECxT * FROM (xSELECT(SxLEEP(5)))ecMj)-x-" },
        { "id": testID, "name": "(SELxECT * FROM (SELxECT(SLExEP(5)))ecMj)-x-" },
        { "id": testID, "name": "(SxELECT * FROM (SELECxT(SLEEPx(5)))ecMj)-x-" },
    ],
    "case-42.2": [
        { "id": testID, "name": "ANxD (SELECxT 4523 FROM(SxELECT COUNT(*),CONCAT(0x716a7a6a71,(SxELECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROxUP BY x)a)" },
        { "id": testID, "name": "AxND (SELxECT 4523 FROM(SELxECT COUNT(*),CONCAT(0x716a7a6a71,(SELxECT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUPx BY x)a)" },
        { "id": testID, "name": "ANxD (SxELECT 4523 FROM(SELECxT COUNT(*),CONCAT(0x716a7a6a71,(SELECxT (ELT(4523=4523,1))),0x71706a6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BxY x)a)" },
    ],
    "case-43.2": [
        { "id": testID, "name": ",(selecxt * from (sxelect(sleepx(10)))a)" },
        { "id": testID, "name": ",(selxect * from (selxect(slexep(10)))a)" },
        { "id": testID, "name": ",(sxelect * from (selecxt(sxleep(10)))a)" },
    ],
    "case-44.2": [
        { "id": testID, "name": "1 or pg_sxleep(5)-x-" },
        { "id": testID, "name": "1 or pg_slexep(5)-x-" },
        { "id": testID, "name": "1 or pg_sleepx(5)-x-" },
    ],
    "case-45.2": [
        { "id": testID, "name": "AxND (SELExCT * FROM (SELECxT(SLEEPx(5)))bAKL) ANDx 'vRxe'=x'vRxe" },
        { "id": testID, "name": "AxND (SExLECT * FROM (SELxECT(SLExEP(5)))bAKL) ANxD 'vRxe'x='vRxe" },
        { "id": testID, "name": "ANxD (SxELECT * FROM (SxELECT(SxLEEP(5)))bAKL) AxND 'vRxe'=x'vRxe" },
    ],
    "case-46.2": [
        { "id": testID, "name": "(SELECxT * FROM (SELECxT(SLEEPx(5)))ecMj)-x-" },
        { "id": testID, "name": "(SELxECT * FROM (SELxECT(SLExEP(5)))ecMj)-x-" },
        { "id": testID, "name": "(SxELECT * FROM (SxELECT(SxLEEP(5)))ecMj)-x-" },
    ],
    "case-47.2": [
        { "id": testID, "name": "ORDER BxY 1,SLEEPx(5),BENCHMARKx(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15-x-" },
        { "id": testID, "name": "ORDERx BY 1,SLExEP(5),BENCHMAxRK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15-x- a" },
        { "id": testID, "name": "ORDxER BY 1,SxLEEP(5),BENCxHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15-x-" },
    ],
    "case-48.2": [
        { "id": testID, "name": "UNION SELECxT @@VERSION,SxLEEP(5),USER(),BENCHMARKx(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15#" },
        { "id": testID, "name": "UNION SELxECT @@VERSION,SLExEP(5),USER(),BENCHMxARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15#" },
        { "id": testID, "name": "UNION SxELECT @@VERSION,SLEEPx(5),USER(),BxENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15#" },
    ],
    "case-49.2": [
        { "id": testID, "name": "UNION ALL xSELECT @@VERSION,USER(),SLEEPx(5),BExNCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL-x-" },
        { "id": testID, "name": "UNION ALL SELxECT @@VERSION,USER(),SLExEP(5),BENCHMxARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL-x-" },
        { "id": testID, "name": "UNION ALL SELExCT @@VERSION,USER(),SxLEEP(5),BENCHMARKx(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL-x-" },
    ],
    "case-50.2": [
        { "id": testID, "name": "1' ORDER BYx 1,2,3-x-+" },
        { "id": testID, "name": "1' ORDER xBY 1,2,3-x-+" },
        { "id": testID, "name": "1' ORDxER BY 1,2,3-x-+" },
    ],
    "case-51.2": [
        { "id": testID, "name": "ORDER BYx 15-x-" },
        { "id": testID, "name": "ORDER xBY 15-x-" },
        { "id": testID, "name": "ORxDER BY 15-x-" },
    ],
    "case-52.2": [
        { "id": testID, "name": "ORDERx BY 15#" },
        { "id": testID, "name": "ORDER BxY 15#" },
        { "id": testID, "name": "ORDxER BY 15#" },
    ],
    // "case-53.2" : replacee,
}

describe('Keywords-<TestAutomation>: SqlInjection Significant cases', () => {

    for (i = 1; i <= 52; i++) {
        var caseTitle = 'Case-' + i
        var invalidIndex = 'case-' + i + '.1'
        var validIndex = 'case-' + i + '.2'
        describe(caseTitle, () => {

            var invalid = Invalid[invalidIndex]

            it('!InValid! SQL Injection: Expect 400 status return!', (done) => {
                chai.request(app)
                    .post("/profile/update")
                    .send(invalid)
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    })
            })

            var valid = Valid[validIndex]

            valid.forEach(v => {
                it('#Valid# SQL Injection: Expect 200 status return!', (done) => {
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

    }

})

