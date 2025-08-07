/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
	pgm.createTable("playlists", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		name: {
			type: "VARCHAR(255)",
			notNull: true,
		},
		owner: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "users(id)",
			onDelete: "cascade",
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
	pgm.dropTable("playlists");
};

module.exports = { up, down };
