const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');
const { Todo } = require('./../model/todo');

var todoArr = [{ text: 'test1' }, { text: 'test2' }];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoArr);
    }).then(() => done());
});//runs before each test case

describe('Todo/Post', () => {
    it('should create new Todo', (done) => {
        var text = 'Test text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((doc) => {
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            });
    });

    it('should not create todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((doc) => {
                    expect(doc.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('Get/Todos', () => {
    it('should get todos list', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.docs.length).toBe(2);
            })
            .end(done);
    })
});