/**
 * Authentication Error for users that doesn't have session from better-auth.
 *
 * Users will only get this error if they did not visit any of the route inside `/app` to get anonymous login
 */
export class ApplicationError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ApplicationError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
