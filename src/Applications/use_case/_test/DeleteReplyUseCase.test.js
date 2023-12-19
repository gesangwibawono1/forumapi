const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const replyId = 'reply-id_test';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyUserReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(
      deleteReplyUseCase.execute(userId, threadId, commentId, replyId),
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      threadId,
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      commentId,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      userId,
      commentId,
      replyId,
    );
    expect(mockReplyRepository.verifyUserReply).toBeCalledWith(
      userId,
      replyId,
    );
  });
});
