const mapDBtoAlbumDetailModel = (albumData, songData) => ({
  id: albumData.id,
  name: albumData.name,
  year: albumData.year,
  songs: songData.map((song) => ({
    id: song.id,
    title: song.title,
    performer: song.performer,
  })),
});

module.exports = { mapDBtoAlbumDetailModel };
