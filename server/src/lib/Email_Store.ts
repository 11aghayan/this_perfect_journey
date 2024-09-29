import { T_Email_Store } from "@/types";

export default class Email_Store {
  static #store: T_Email_Store = {};

  static get(email: string) {
    return this.#store[email];
  }

  static set(email: string, verification_code: string, create_time: string, timeout_id: NodeJS.Timeout) {
    this.clear_timeout(email);
    
    this.#store[email] = {
      verification_code,
      create_time,
      timeout_id
    };
  }

  static delete(email: string) {
    delete this.#store[email];
  }

  static clear_timeout(email: string) {
    if (email in this.#store) {
      const timeout_id = this.#store[email].timeout_id;
  
      if (timeout_id !== null) {
        clearTimeout(timeout_id);
        this.#store[email].timeout_id = null;
      }
    }
  }

  static cooldown_passed(email: string) {
    if (email in this.#store) {
      const time_passed = Date.now() - Date.parse(this.#store[email].create_time);
      const ONE_MINUTE = 60 * 1000;
      
      return time_passed >= ONE_MINUTE;
    }

    return true;
  }

  static check_verification_code(email: string, code: string) {
    const data = this.get(email);
    if (!data) return false;
    if (data.verification_code !== code) return false ;
    return true;
  }
}