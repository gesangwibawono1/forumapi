const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let accessToken;
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  beforeAll(async () => {
    accessToken = await ServerTestHelper.getAccessToken('user-123');
    await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ userId: 'user-123' });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted comment', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-id_test/comments/comment-id_test/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-12345/comments/comment-id_test/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'thread dengan id: thread-12345 tidak ada',
      );
    });

    it('should response 404 when comment not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-id_test/comments/comment-12345/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'comment dengan id: comment-12345 tidak ada',
      );
    });
  });
});
