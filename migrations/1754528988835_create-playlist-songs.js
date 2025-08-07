/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
	pgm.createTable("playlist_songs", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		playlist_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "playlists(id)",
			onDelete: "cascade",
		},
		song_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "songs(id)",
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
	pgm.dropTable("playlist_songs");
};

module.exports = { up, down };
