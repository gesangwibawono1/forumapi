/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
	async addReply({
		userId = "user-123",
		commentId = "comment-id_test",
		replyId = "reply-id_test",
		content = "reply content test",
	}) {
		const query = {
			text: "INSERT INTO replies(owner, comment, id, content) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
			values: [userId, commentId, replyId, content],
		};

		await pool.query(query);
	},

	async findReplyById(id) {
		const query = {
			text: "SELECT * FROM replies WHERE id = $1",
			values: [id],
		};

		const result = await pool.query(query);
		return result.rows;
	},

	async cleanTable() {
		await pool.query("DELETE FROM replies WHERE 1=1");
	},
};

module.exports = RepliesTableTestHelper;
