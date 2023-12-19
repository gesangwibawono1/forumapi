const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when "userId" did not contain needed property', () => {
    const userId = '';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when "userId" did not meet data type specification', () => {
    const userId = 1234;
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when "threadId" did not contain needed property', () => {
    const userId = 'user-id_test';
    const threadId = '';
    const commentId = 'comment-id_test';
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when "threadId" did not meet data type specification', () => {
    const userId = 'user-id_test';
    const threadId = 1234;
    const commentId = 'comment-id_test';
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when "commendId" did not contain needed property', () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = '';
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when "commentId" did not meet data type specification', () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 1234;
    const payload = {
      content: 'comment content test',
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when "payload" did not contain needed property', () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const payload = {};

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when "payload" did not meet data type specification', () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const payload = {
      content: 1234,
    };

    expect(() => new AddReply(userId, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    const expectedUserId = 'user-id_test';
    const expectedThreadId = 'thread-id_test';
    const expectedCommentId = 'comment-id_test';
    const payload = {
      content: 'reply content test',
    };

    const {
      userId, threadId, commentId, content,
    } = new AddReply(expectedUserId, expectedThreadId, expectedCommentId, payload);

    expect(userId).toEqual(expectedUserId);
    expect(threadId).toEqual(expectedThreadId);
    expect(commentId).toEqual(expectedCommentId);
    expect(content).toEqual(payload.content);
  });
});
