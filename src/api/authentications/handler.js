class AuthenticationsHandler {
	constructor(authenticationService, usersService, tokenManager, validator) {
		this._authenticationService = authenticationService;
		this._usersService = usersService;
		this._tokenManager = tokenManager;
		this._validator = validator;
	}

   async postAuthenticationHandler (request, h) {
      this._validator.valida
   }
}
