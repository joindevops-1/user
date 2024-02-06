
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;
const server = require('./server'); // Assuming server.js is in the same directory
const mongoClient = require('mongodb').MongoClient;

chai.use(chaiHttp);

describe('Server', () => {
    let mongoConnectStub;

    before(() => {
        // Mocking the MongoDB connection
        mongoConnectStub = sinon.stub(db, 'collection').returns({
            find: () => ({ toArray: () => Promise.resolve([{ id: 1, name: 'Test Product' }]) })
        });
    });

    after(() => {
        // Restore the original function
        mongoConnectStub.restore();
    });

    describe('GET /health', () => {
        it('should return status 200 and the correct structure', (done) => {
            chai.request(server)
                .get('/health')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.all.keys('app', 'mongo');
                    done();
                });
        });
    });

    describe('GET /products', () => {
        it('should return status 200 and product data', (done) => {
            chai.request(server)
                .get('/products')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.all.keys('id', 'name');
                    done();
                });
        });
    });
});
