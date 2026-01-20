import type { IMessageBroker } from "../../domain/services/IMessageBroker";
import client, {
  type ChannelModel,
  type Channel,
  type ConsumeMessage,
} from "amqplib";

export class RabbitMQBroker implements IMessageBroker {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnected: Boolean = false;

  constructor(
    private readonly uri: string = "amqp://guest:guest@localhost:5672",
  ) {}

  connect = async () => {
    if (this.isConnected && this.channel) return;

    try {
      console.log("🐰 connecting to rabbitmq...");

      this.connection = await client.connect(this.uri);

      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      console.log("🐰 rabbitmq connected...");
    } catch (error) {
      console.error("rabbitmq connection failed... :", error);
      throw error;
    }
  };

  publish = async (queue: string, message: unknown): Promise<void> => {
    if (!this.channel) {
      await this.connect();
    }

    await this.channel?.assertQueue(queue, {
      durable: true,
    });

    const buffer = Buffer.from(JSON.stringify(message));

    const sent = this.channel?.sendToQueue(queue, buffer, {
      persistent: true,
    });

    if (!sent) {
      throw new Error("failed to send message to queue");
    }
  };

  subscribe = async <T>(
    queue: string,
    handler: (message: T) => Promise<void>,
  ): Promise<void> => {
    if (!this.channel) {
      await this.connect();
    }

    await this.channel?.assertQueue(queue, { durable: true });
    await this.channel?.prefetch(1);

    this.channel?.consume(queue, async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        this.channel?.ack(msg);
      } catch (error) {
        console.error("error processing message:", error);
        this.channel?.nack(msg, false, true);
      }
    });
  };

  disconnect = async (): Promise<void> => {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.isConnected = false;
  };
}
