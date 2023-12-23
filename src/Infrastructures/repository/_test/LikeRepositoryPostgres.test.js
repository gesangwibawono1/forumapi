const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('existsByCommentAndOwner function', () => {
    it('existsByCommentAndOwner should return true if like exists', async () => {
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

      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-id_test', owner: 'user-id_test' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeRepositoryPostgres.existsByCommentAndOwner('comment-id_test', 'user-id_test');
      expect(statusCheck).toEqual(true);
    });

    it('existsByCommentAndOwner should return false if like does not exists', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeRepositoryPostgres.existsByCommentAndOwner('comment-456', 'user-456');
      expect(statusCheck).toEqual(false);
    });
  });

  describe('addLike function', () => {
    it('should persist addLike', async () => {
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
      const addLike = new AddLike('user-id_test', 'comment-id_test');
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike(addLike);

      const like = await LikesTableTestHelper.findLikeById('like-id_test');
      expect(like.id).toEqual('like-id_test');
      expect(like.comment).toEqual('comment-id_test');
      expect(like.owner).toEqual('user-id_test');
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
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
      const addLike = new AddLike('user-id_test', 'comment-id_test');
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLike(addLike);
      await likeRepositoryPostgres.deleteLikeByCommentIdAndOwner('comment-id_test', 'user-id_test');
      const like = await LikesTableTestHelper.getLikeByCommentIdAndOwner('comment-id_test', 'user-id_test');

      expect(like).toHaveLength(0);
    });
  });

  describe('getLikeCountByCommentIds function', () => {
    it('should return likeCount correctly', async () => {
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
        commentId: 'comment-1_test',
        content: 'comment content test',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_test',
        threadId: 'thread-id_test',
        commentId: 'comment-2_test',
        content: 'comment content test',
      });

      await LikesTableTestHelper.addLike({
        id: 'like-1',
        owner: 'user-id_test',
        commentId: 'comment-1_test',
      });

      await LikesTableTestHelper.addLike({
        id: 'like-2',
        owner: 'user-id_test',
        commentId: 'comment-2_test',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const likes = await likeRepositoryPostgres.getLikeCountByCommentIds(['comment-1_test', 'comment-2_test']);

      expect(likes).toHaveLength(2);
      expect(likes[0].count).toEqual(1);
      expect(likes[1].count).toEqual(1);
    });
  });
});
