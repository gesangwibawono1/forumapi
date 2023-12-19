class AddReply {
  constructor(userId, threadId, commentId, payload) {
    this._verifyUserId(userId);
    this._verifyThreadId(threadId);
    this._verifyCommentId(commentId);
    this._verifyPayload(payload);

    const { content } = payload;

    this.userId = userId;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyUserId(userId) {
    if (!userId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyThreadId(threadId) {
    if (!threadId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyCommentId(commentId) {
    if (!commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
