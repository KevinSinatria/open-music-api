require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// plugins
const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const authentications = require("./api/authentications");
const playlists = require("./api/playlists");

// services
const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");
const UsersService = require("./services/postgres/UsersService");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const PlaylistsService = require("./services/postgres/PlaylistsService");

// validators
const AlbumValidator = require("./validator/albums");
const SongValidator = require("./validator/songs");
const UserValidator = require("./validator/users");
const AuthenticationsValidator = require("./validator/authentications");
const PlaylistsValidator = require("./validator/playlists");

// exceptions
const ClientError = require("./exceptions/ClientError");

// tokenize
const tokenManager = require("./tokenize/TokenManager");

const init = async () => {
	const albumsService = new AlbumsService();
	const songsService = new SongsService();
	const usersService = new UsersService();
	const authenticationsService = new AuthenticationsService();
	const playlistsService = new PlaylistsService();

	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

	// external plugins
	await server.register([
		{
			plugin: Jwt,
		},
	]);

	// auth strategy
	server.auth.strategy("openmusic_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		validate: (artifacts) => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.id,
			},
		}),
	});

	// internal plugins
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
		{
			plugin: authentications,
			options: {
				authenticationsService,
				usersService,
				tokenManager,
				validator: AuthenticationsValidator,
			},
		},
		{
			plugin: playlists,
			options: {
				service: playlistsService,
				validator: PlaylistsValidator,
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
