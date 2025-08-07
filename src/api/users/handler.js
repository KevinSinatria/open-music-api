class UserHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postUserHandler = this.postUserHandler.bind(this);
	}

	async postUserHandler(request, h) {
		const userPayload = request.payload;
		this._validator.validateUserPayload(userPayload);
		const { username, password, fullname } = userPayload;

		const userId = await this._service.addUser({
			username,
			password,
			fullname,
		});

		const response = h.response({
			status: "success",
			data: {
				userId,
			},
		});
		response.code(201);

		return response;
	}
}

module.exports = UserHandler;
