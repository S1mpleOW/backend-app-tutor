import { APP_URL, MAIL_HOST, MAIL_PORT } from '../utils/constants';
import request from 'supertest';
describe('Learner Module', () => {
  const app = APP_URL;
  // const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  it('should successfully: /api/v1/learners/emails (GET)', () => {
    return request(app).get('/api/v1/learners/emails').send().expect(200);
  });

  it('should successfully: /api/v1/learners/send-email (POST)', () => {
    const sender = 'dungdqch@gmail.com';
    const recipients = ['dungdqch1@gmail.com', 'dungdqch2@gmail.com'];
    const subject = 'Test email';
    const body = 'This is a test email';
    const sendEmailOption = 'NONE';
    return request(app)
      .post('/api/v1/learners/send-email')
      .send({
        sender,
        recipients,
        subject,
        body,
        sendEmailOption,
      })
      .expect(200);
  }, 5000);

  it('should failed data validation: /api/v1/learners/send-email (POST)', () => {
    const sender = 'dungdqch@gmail.com';
    const recipients = ['dungdqch1@gmail.com'];
    const subject = 'Test email';
    const body = 'test';
    return request(app)
      .post('/api/v1/learners/send-email')
      .send({
        sender,
        recipients,
        subject,
        body,
      })
      .expect(422);
  });

  it('should fail data validation: /api/v1/learners/emails/:id (PATCH)', () => {
    const id = 'invalid_id';
    return request(app)
      .patch(`/api/v1/learners/emails/${id}`)
      .send()
      .expect(422);
  });

  it('should fail with no exists id: /api/v1/learners/emails/:id (PATCH)', () => {
    const id = '123123123';
    return request(app)
      .patch(`/api/v1/learners/emails/${id}`)
      .send()
      .expect(422);
  });
});
