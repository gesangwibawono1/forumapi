const AddLike = require('../AddLike');

describe('a AddLike entity', () => {
  it('should throw error if payload does not meeet criteria', () => {
    // arrange
    const userId = 'user-id_test';

    // action & assert
    expect(() => new AddLike(userId)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    // arrange
    const userId = 'user-id_test';
    const commentId = 1;

    // action & assert
    expect(() => new AddLike(userId, commentId)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object properly', () => {
    // arrange
    const userId = 'user-id_test';
    const commentId = 'comment-id_test';

    const addLike = new AddLike(userId, commentId);
    expect(addLike.owner).toEqual(userId);
    expect(addLike.commentId).toEqual(commentId);
  });
});
