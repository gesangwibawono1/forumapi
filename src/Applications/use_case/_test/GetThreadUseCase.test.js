const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the GetThread action with like correctly', async () => {
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
          likeCount: 1,
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

    const mockLikeCount = [
      {
        comment: 'comment-id_test-1',
        count: 1,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

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
    mockLikeRepository.getLikeCountByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockLikeCount));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const actualDetailThread = await getThreadUseCase.execute('thread-id_test');

    expect(actualDetailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-id_test');
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalled();
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalled();
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalled();
    expect(mockLikeRepository.getLikeCountByCommentIds).toBeCalled();
  });

  it('should orchestrating the GetThread action with no like correctly', async () => {
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
          likeCount: 0,
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

    const mockLikeCount = [];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

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
    mockLikeRepository.getLikeCountByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockLikeCount));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const actualDetailThread = await getThreadUseCase.execute('thread-id_test');

    expect(actualDetailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-id_test');
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalled();
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalled();
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalled();
    expect(mockLikeRepository.getLikeCountByCommentIds).toBeCalled();
  });
});
