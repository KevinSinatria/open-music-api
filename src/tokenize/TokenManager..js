const Jwt = require("@hapi/jwt");
const {
	ACCESS_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
} = require("../config/environment");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
	generateAccessToken: (payload) =>
		Jwt.token.generate(payload, ACCESS_TOKEN_KEY),
	generateRefreshToken: (payload) =>
		Jwt.token.generate(payload, REFRESH_TOKEN_KEY),
	verifyRefreshToken: (refreshToken) => {
		try {
			const artifacts = Jwt.token.decode(refreshToken);
			Jwt.token.verifyArtifacts(artifacts, REFRESH_TOKEN_KEY);
			const {
				decoded: { payload: decodedPayload },
			} = artifacts;
			return decodedPayload;
		} catch (error) {
			throw new InvariantError(error.message);
		}
	},
};

module.exports = TokenManager;
