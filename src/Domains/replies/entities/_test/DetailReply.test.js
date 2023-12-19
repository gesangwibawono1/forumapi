const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-id_test',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-id_test',
      content: 123,
      date: '2023-02-12 04:04:04.012345',
      username: 'dicoding',
      is_delete: false,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replyDetail object correctly', () => {
    const now = new Date();
    const payload = {
      id: 'reply-id_test',
      content: 'reply content test',
      date: now,
      is_delete: false,
      username: 'dicoding',
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });

  it('should create replyDetail object with deleted correctly', () => {
    const now = new Date();
    const payload = {
      id: 'reply-id_test',
      content: 'reply content test',
      date: now,
      is_delete: true,
      username: 'dicoding',
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
