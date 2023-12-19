const DetailThread = require('../DetailThread');
const DetailComment = require('../../../comments/entities/DetailComment');
const DetailReply = require('../../../replies/entities/DetailReply');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-id_test',
      title: 'thread title test',
      body: 'thread body test',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1234,
      title: 'thread title test',
      body: 'thread body test',
      date: '2023-02-12 04:04:04.012345',
      username: 'dicoding',
      comments: {},
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread Correctly', () => {
    const now = new Date();
    const payload = {
      id: 'thread-id_test',
      title: 'thread title test',
      body: 'thread body test',
      date: now,
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-id_test-1',
          username: 'Gesang',
          date: now,
          content: 'comment content test',
          replies: [
            new DetailReply({
              id: 'reply-id_test-1',
              content: 'reply content test',
              date: now,
              username: 'Wibawono',
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-id_test-2',
          content: 'reply comment content test',
          date: now,
          username: 'Wibawono',
          replies: [],
        }),
      ],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments.length).toEqual(payload.comments.length);
    expect(detailThread.comments.length).toEqual(2);
    expect(detailThread.comments[0]).toEqual(payload.comments[0]);
    expect(detailThread.comments[1]).toEqual(payload.comments[1]);
  });
});
