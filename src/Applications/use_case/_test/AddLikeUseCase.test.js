const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrating the AddLike Action with like correctly', async () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.existsByCommentAndOwner = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await addLikeUseCase.execute(userId, threadId, commentId);

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(commentId);
    expect(mockLikeRepository.existsByCommentAndOwner).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.addLike).toBeCalledWith(
      new AddLike(userId, commentId),
    );
  });

  it('should orchestrating the AddLike Action with unlike correctly', async () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.existsByCommentAndOwner = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await addLikeUseCase.execute(userId, threadId, commentId);

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(commentId);
    expect(mockLikeRepository.existsByCommentAndOwner).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.deleteLikeByCommentIdAndOwner).toBeCalledWith(commentId, userId);
  });
});
