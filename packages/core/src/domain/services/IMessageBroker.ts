export interface IMessageBroker {
  /**
   * Connects to the broker
   */
  connect(): Promise<void>;

  /**
   * Published a message to a specific queue.
   * */
  publish(queue: string, message: unknown): Promise<void>;

  /**
   *  Subscribes to a queue and handles the incoming messages.
   *  Useful for the Worker service later.
   */
  subscribe<T>(
    queue: string,
    handler: (message: T) => Promise<void>,
  ): Promise<void>;

  /**
   *  Gracefully closes the connection.
   */
  disconnect(): Promise<void>;
}
