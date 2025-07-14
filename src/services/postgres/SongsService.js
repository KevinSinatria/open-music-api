const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw InvariantError("Song gagal ditambahkan.");
    }

    return result.rows[0].id;
  }

  async getAllSongs({ titleQuery = null, performerQuery = null }) {
    let queryText = "SELECT * FROM songs";
    let queryValues = [];
    let conditions = [];
    let paramIndex = 1;

    if (titleQuery) {
      conditions.push(`title ILIKE $${paramIndex}`);
      queryValues.push(`%${titleQuery}%`);
      paramIndex++;
    }

    if (performerQuery) {
      conditions.push(`performer ILIKE $${paramIndex}`);
      queryValues.push(`%${performerQuery}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      queryText += `WHERE ${conditions.join(" AND ")}`;
    }

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = this._pool.query(query);

    return result;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = this._pool.query(query);

    if (!result.rows.length) {
      return NotFoundError(`Song dengan id ${id} tidak ditemukan.`);
    }

    return result;
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, WHERE id = $7 RETURNING id",
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        `Gagal memperbarui song. Song dengan id ${id} tidak ditemukan.`
      );
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        `Gagal menghapus song. Song dengan id ${id} tidak ditemukan`
      );
    }
  }
}

module.exports = SongsService;
