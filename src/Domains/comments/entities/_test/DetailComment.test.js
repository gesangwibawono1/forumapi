const DetailComment = require('../DetailComment');
const DetailReply = require('../../../replies/entities/DetailReply');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-id_test',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-id_test',
      content: 123,
      date: '2023-02-12 04:04:04.012345',
      username: 'dicoding',
      is_delete: false,
      replies: {},
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentDetail object correctly', () => {
    const now = new Date();
    const payload = {
      id: 'comment-id_test',
      content: 'comment content test',
      date: now,
      username: 'dicoding',
      is_delete: false,
      replies: [
        new DetailReply({
          id: 'reply-id_test-1',
          content: 'reply content test',
          date: now,
          is_delete: false,
          username: 'Wibawono',
        }),
      ],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.replies).toEqual(payload.replies);
  });

  it('should create commentDetail object with deleted correctly', () => {
    const now = new Date();
    const payload = {
      id: 'comment-id_test',
      content: 'comment content test',
      date: now,
      username: 'dicoding',
      is_delete: true,
      replies: [
        new DetailReply({
          id: 'reply-id_test-1',
          content: 'reply content test',
          date: now,
          username: 'Wibawono',
          is_delete: false,
        }),
      ],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.replies).toEqual(payload.replies);
  });
});
