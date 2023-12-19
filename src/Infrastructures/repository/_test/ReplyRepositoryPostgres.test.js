const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist addReply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.addReply(addReply);

      const reply = await RepliesTableTestHelper.findReplyById('reply-id_test');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual({
        id: 'reply-id_test',
        content: 'reply content test',
        owner: 'user-id_test',
      });
    });
  });

  describe('verifyUserReply', () => {
    it('should throw NotFoundError when reply with given id not found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);
      await expect(replyRepositoryPostgres.verifyUserReply('user-id_test', 'reply-id-test')).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when reply deleted by non owner', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test-1',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-id_test-2',
        password: 'secret',
        fullname: 'Gesang Wibawono',
        username: 'Gesang',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test-1',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test-1',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test-1', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);
      await expect(replyRepositoryPostgres.verifyUserReply('user-id_test-2', 'reply-id_test')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment deleted by the owner', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);
      await expect(replyRepositoryPostgres.verifyUserReply('user-id_test', 'reply-id_test')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should set is_delete to true', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      const fakeIdGenerator = () => 'id_test';
      const addReply = new AddReply('user-id_test', 'thread-id_test', 'comment-id_test', {
        content: 'reply content test',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);
      await replyRepositoryPostgres.deleteReply('user-id_test', 'comment-id_test', 'reply-id_test');
      const replies = await RepliesTableTestHelper.findReplyById('reply-id_test');

      expect(replies[0].is_delete).toBeTruthy();
    });
  });

  describe('getReplies function', () => {
    it('should return Replies correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_test',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_test',
        title: 'thread title test',
        body: 'thread body test',
        owner: 'user-id_test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-id_test',
        content: 'comment content test',
      });

      await RepliesTableTestHelper.addReply({
        userId: 'user-id_test',
        commentId: 'comment-id_test',
        replyId: 'reply-id_test',
        content: 'reply content test',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-id_test']);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-id_test');
      expect(replies[0].comment).toEqual('comment-id_test');
      expect(replies[0].content).toEqual('reply content test');
      expect(replies[0].date).toBeTruthy();
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].is_delete).toEqual(false);
    });
  });
});
