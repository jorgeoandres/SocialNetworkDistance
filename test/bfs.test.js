// Import the dependencies for testing

const chai = require('chai');
const chaiHttp = require('chai-http');
let socialNetwork = require('../server');
const expect = chai.expect;

const assert = require('assert');
const User = require('../app/models/user.model.js');
const Follower = require('../app/models/followers.model');
const UserController = require('../app/controllers/user.controller.js');


// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Users", () => {
    describe("GET /users", () => {
        // Test to get all users record
        it("should get all users record", (done) => {
            chai.request(socialNetwork)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(26);
                    done();
                });
        });
        // Test to get single user record
        it("should get a single user record", (done) => {
            chai.request(socialNetwork)
                .get('/users/userA')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id')
                    done();
                });
        });

        // Test to get single user record
        it("should get 3 of distance", (done) => {
            chai.request(socialNetwork)
                .get('/users/distance/userA/userM')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.distance.should.be.eql(3);
                    done();
                });
        });
    });
});