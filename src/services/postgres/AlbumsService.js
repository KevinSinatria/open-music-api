const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBtoAlbumDetailModel } = require("../../utils/mapAlbums");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw InvariantError("Album gagal ditambahkan.");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const querySongsOfAlbum = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);
    const resultSongsOfAlbum = await this._pool.query(querySongsOfAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan.`);
    }

    const albumDataRaw = resultAlbum.rows[0];
    const songsOfAlbumDataRaw = resultSongsOfAlbum.rows;

    const albumDataMapped = mapDBtoAlbumDetailModel(
      albumDataRaw,
      songsOfAlbumDataRaw
    );

    return albumDataMapped;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        `Gagal memperbarui album. Album dengan id ${id} tidak ditemukan.`
      );
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        `Gagal menghapus album. Album dengan id ${id} tidak ditemukan.`
      );
    }
  }
}

module.exports = AlbumsService;
