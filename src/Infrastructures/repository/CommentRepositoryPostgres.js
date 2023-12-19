const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { userId, threadId, content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments(id, content, owner, thread) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const commentQuery = {
      text: `SELECT
                    comments.id AS id,
                    users.username AS username,
                    comments.date AS date,
                    comments.content AS content,
                    comments.is_delete AS is_delete
                    FROM comments INNER JOIN users on comments.owner = users.id
                    WHERE comments.thread = $1
                    ORDER BY date ASC`,
      values: [threadId],
    };
    const commentResult = await this._pool.query(commentQuery);

    return commentResult.rows;
  }

  async deleteComment(userId, threadId, commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = 'true' WHERE id = $1 AND owner = $2 AND thread = $3",
      values: [commentId, userId, threadId],
    };

    await this._pool.query(query);
  }

  async verifyUserComment(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`comment dengan id ${commentId} tidak ada`);
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Resource ini tidak boleh diakses');
    }
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`comment dengan id: ${commentId} tidak ada`);
    }
  }
}

module.exports = CommentRepositoryPostgres;
