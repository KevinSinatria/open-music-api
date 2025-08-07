const InvariantError = require("../../exceptions/InvariantError");
const { userPayloadSchema } = require("./schema");

const UserValidator = {
	validateUserPayload: (payload) => {
		const validationResult = userPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
		return validationResult;
	},
};

module.exports = UserValidator;
