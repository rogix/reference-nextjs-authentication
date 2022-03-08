export class AuthTokenError extends Error {
  constructor(message: string) {
    super('Error with authentication token: ' + message)
  }
}
