import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  /**
   * Adds a new message.
   * @param message new message to add to messages.
   */
  add(message: string) {
    this.messages.push(message);
  }

  /**
   * Clears the messages.
   */
  clear() {
    this.messages = [];
  }
}