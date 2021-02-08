const chai = require('chai');
const server = require("../server/server");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('API Test', () => {

    describe("Test GET route /api/notes", () => {
        it('It should return all notes', (done) => {
            chai.request(server)
            .get("/api/notes")
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.not.be.eq(0);
            done();
            })
        })
    })
})