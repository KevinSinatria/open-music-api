const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsService {
	constructor() {
		this._pool = new Pool();
	}

	async addPlaylist({ name, ownerId }) {
		const id = `playlist-${nanoid(16)}`;
		const query = {
			text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
			values: [id, name, ownerId],
		};

		const result = await this._pool.query(query);
		const resultId = result.rows[0].id;

		if (!resultId) {
			throw new InvariantError("Playlist gagal ditambahkan");
		}

		return resultId;
	}

	async getPlaylists(ownerId) {
		const query = {
			text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1",
			values: [ownerId],
		};

		const result = await this._pool.query(query);

		return result.rows;
	}

	async deletePlaylistById(id) {
		const query = {
			text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(
				`Gagal menghapus playlist. Playlist dengan id ${id} tidak ditemukan`
			);
		}
	}

	async addSongToPlaylist(playlistId, songId) {
		const id = `playlist_song-${nanoid(16)}`;
		const query = {
			text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
			values: [id, playlistId, songId],
		};

		const {
			rows: { id: playlistSongId },
		} = await this._pool.query(query);

		if (!playlistSongId) {
			throw new InvariantError("Lagu gagal ditambahkan ke playlist");
		}

		return playlistSongId;
	}

	async getSongsByPlaylistId(playlistId, ownerId) {
		const playlistQuery = {
			text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1 AND playlists.id = $2",
			values: [ownerId, playlistId],
		};

		const songsQuery = {
			text: "SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1",
			values: [playlistId],
		};

		const { rows: playlist } = await this._pool.query(playlistQuery);
		const { rows: songs } = await this._pool.query(songsQuery);

		if (!playlist.length) {
			throw new NotFoundError(
				`Playlist dengan id ${playlistId} tidak ditemukan`
			);
		}

		const { id, name, username } = playlist[0];

		return {
			id,
			name,
			username,
			songs,
		};
	}

	async deleteSongFromPlaylist(playlistId, songId) {
		const query = {
			text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
			values: [playlistId, songId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(
				`Gagal menghapus lagu. Lagu dengan id ${songId} tidak ditemukan`
			);
		}
	}
}

module.exports = PlaylistsService;
