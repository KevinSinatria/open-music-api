class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { id } = request.params;
    const payload = request.payload;
    this._validator.validateAlbumPayload(payload);

    await this._service.editAlbumById(id, payload);

    return {
      status: "success",
      message: `Berhasil memperbarui data album dengan id ${id}`,
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: `Berhasil menghapus album dengan id ${id}`,
    };
  }
}

module.exports = AlbumHandler;
