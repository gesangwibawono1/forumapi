const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { userId, commentId, content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies(id, content, owner, comment) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getRepliesByCommentIds(commentIds) {
    const replyQuery = {
      text: `SELECT
                    replies.id AS id,
                    replies.comment AS comment,
                    users.username AS username,
                    replies.date AS date,
                    replies.content AS content,
                    replies.is_delete AS is_delete
                    FROM replies INNER JOIN users on replies.owner = users.id
                    WHERE replies.comment = ANY($1::text[])
                    ORDER BY date ASC`,
      values: [commentIds],
    };
    const replyResult = await this._pool.query(replyQuery);

    return replyResult.rows;
  }

  async deleteReply(userId, commentId, replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = 'true' WHERE id = $1 AND owner = $2 AND comment = $3",
      values: [replyId, userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyUserReply(userId, replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`reply dengan id ${replyId} tidak ada`);
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Resource ini tidak boleh diakses');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
