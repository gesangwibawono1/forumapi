class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, date, username, is_delete, replies, likeCount,
    } = payload;
    this.id = id;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id, content, date, username, replies,
  }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'object'
      || typeof username !== 'string'
      || !Array.isArray(replies)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
