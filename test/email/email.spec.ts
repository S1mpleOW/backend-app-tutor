import { APP_URL, MAIL_HOST, MAIL_PORT } from '../utils/constants';
import request from 'supertest';
describe('Mail Module', () => {
  const app = APP_URL;
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  it('should successfully: /api/v1/learners/emails (GET)', () => {
    return request(app).get('/api/v1/learners/emails').send().expect(200);
  });
});
