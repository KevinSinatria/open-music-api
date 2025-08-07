require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");
const AlbumValidator = require("./validator/albums");
const SongValidator = require("./validator/songs");
const UserValidator = require("./validator/users");
const ClientError = require("./exceptions/ClientError");
const UsersService = require("./services/postgres/UsersService");

const init = async () => {
	const albumsService = new AlbumsService();
	const songsService = new SongsService();
	const usersService = new UsersService();

	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

	await server.register([
		{
			plugin: albums,
			options: {
				service: albumsService,
				validator: AlbumValidator,
			},
		},
		{
			plugin: songs,
			options: {
				service: songsService,
				validator: SongValidator,
			},
		},
		{
			plugin: users,
			options: {
				service: usersService,
				validator: UserValidator,
			},
		},
	]);

	server.ext("onPreResponse", (request, h) => {
		const { response } = request;

		if (response instanceof ClientError) {
			const newResponse = h.response({
				status: "fail",
				message: response.message,
			});
			newResponse.code(response.statusCode);

			return newResponse;
		}

		return h.continue;
	});

	await server.start().then(() => {
		console.log("Server running on %s", server.info.uri);
	});
};

init();
