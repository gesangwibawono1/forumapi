const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the GetThread action correctly', async () => {
    const now = new Date();

    const expectedDetailThread = new DetailThread({
      id: 'thread-id_test',
      title: 'thread title test',
      body: 'thread body test',
      date: now,
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-id_test-1',
          content: 'comment content test',
          date: now,
          username: 'Gesang',
          is_delete: false,
          replies: [
            new DetailReply({
              id: 'reply-id_test-1',
              content: 'reply content test',
              date: now,
              username: 'Wibawono',
              is_delete: true,
            }),
          ],
        }),
      ],
    });

    const mockThread = {
      id: 'thread-id_test',
      title: 'thread title test',
      body: 'thread body test',
      date: now,
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-id_test-1',
        content: 'comment content test',
        date: now,
        username: 'Gesang',
        is_delete: false,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-id_test-1',
        comment: 'comment-id_test-1',
        content: 'reply content test',
        date: now,
        username: 'Wibawono',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const actualDetailThread = await getThreadUseCase.execute('thread-id_test');

    expect(actualDetailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-id_test');
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalled();
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalled();
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalled();

  });
});
