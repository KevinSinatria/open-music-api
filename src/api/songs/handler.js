class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    const songPayload = request.payload;
    this._validator.validateSongPayload(songPayload);
    const { title, year, performer, genre, duration, albumId } = songPayload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      data: {
        songId,
      },
    });

    response.code(201);

    return response;
  }

  async getSongsHandler(request) {
    const reqQuery = request.query;
    const { title = "", performer = "" } = reqQuery;
    await this._validator.validateSongQueryParams({ title, performer });

    const songs = await this._service.getAllSongs(reqQuery);

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    const songPayload = request.payload;
    const { id } = request.params;
    await this._validator.validateSongPayload(songPayload);

    await this._service.editSongById(id, songPayload);

    return {
      status: "success",
      message: `Berhasil memperbarui data song dengan id ${id}`,
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: `Berhasil menghapus song dengan id ${id}`,
    };
  }
}

module.exports = SongHandler;
