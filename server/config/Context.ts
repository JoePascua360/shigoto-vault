import type { Session } from "@/config/auth-client";
/**
 * Custom express request objects.
 * Add new ones here to access the data
 */
export class Context {
  constructor(public session: Session) {
    this.session = session;
  }
}
