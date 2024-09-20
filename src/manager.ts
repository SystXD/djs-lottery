import { EventEmitter } from "node:events";
import {
  EmbedBuilder,
  Client,
  GuildChannel,
  APIEmbed,
  Message,
  Channel,
  Collection,
} from "discord.js";
import { GenerateEmbed, getWinner, ManagerProps } from "./utils/helpers";
export class GiveawayConfig extends EventEmitter {
  private Client: Client;
  public EmbedJSON?: EmbedBuilder | APIEmbed;
  private Map: Collection<string, any>;
  private RunningMap: Collection<string, Message>;
  private PausedMap: Collection<string, Message>;
  private EndedMap: Collection<string, Message>;
  constructor({ Client }: ManagerProps) {
    super();
    this.Client = Client;
    this.Map = new Collection();
    this.RunningMap = new Collection();
    this.PausedMap = new Collection();
    this.EndedMap = new Collection();
  }

  public start(prize: string, channel: Channel, duration: number) {
    return new Promise(async (res, rej) => {
      if (channel.isSendable())
        if (channel.isTextBased()) {
          const message = await channel.send({
            embeds: [this.EmbedJSON ?? (await GenerateEmbed(prize, duration))],
          });
          await message.react("🎉");
          this.RunningMap.set(message.id, message);
          res("[djs/lottery] The Giveaway has been started");
          setTimeout(() => this.end(message.id), duration);
        } else
          rej(
            "[Error: djs/lottery] Unable to start giveaway on channel. Make sure I have appropriate permission."
          );
    });
  }

  public end(messageId: string) {
    return new Promise((res, rej) => {
      const giveaway = this.RunningMap.get(messageId);
      if (!giveaway)
        return rej(
          `[Error: djs/lottery] Unable to locate any giveaway with Id ${messageId}`
        );
      this.Client.channels.fetch(giveaway?.channel.id).then(async (channel) => {
        if (!channel?.isTextBased())
          return rej(
            "[Error: djs/lottery] The specified channel have been deleted"
          );
        const message = await channel.messages.fetch(messageId);
        const reactions = message.reactions.cache.get("🎉");
        if (!reactions)
          return rej("[Error: djs/lottery] No valid winners found");
        if (!message.embeds[0])
          return rej(
            "[Error: djs/lottery] Unable to locate embed attached to the giveaway"
          );
        EmbedBuilder.from(message.embeds[0]).setDescription(
          `${await getWinner(reactions)}`
        );
        await message
          .edit({ embeds: [message.embeds[0]], components: [] })
          .catch((err) => rej(err));
        this.EndedMap.set(messageId, message);
        res("[djs/lottery] The giveaway has been ended");
        setTimeout(() => this.EndedMap.delete(messageId), 86_400_000);
      });
    });
  }

  public stop(messageId: string, message?: string) {
    return new Promise((res, rej) => {
      if (!messageId)
        rej(
          "[Error: djs/lottery] MessageId is required to execute the process."
        );
      if (!this.RunningMap.get(messageId))
        rej(
          `[Error: djs/lottery] No giveaways found for messageId: ${messageId}.`
        );
      const channel = this.Client.channels.cache.get(
        this.Map.get(messageId).channelId
      ) as GuildChannel;
      if (!channel)
        rej("[Error: djs/lottery] Unable to locate the expected channel");
      if (!channel.isTextBased()) return;
      channel.messages.fetch(messageId).then(async (msg) => {
        if (!msg.embeds[0])
          console.warn(
            `[Warn: djs/lottery] The embed attached to message have been deleted, Couldn't update It.`
          );
        EmbedBuilder.from(msg.embeds[0]).setDescription(
          message ?? "The giveaway has been stopped"
        );
        await msg.edit({ embeds: [msg.embeds[0]] }).catch((err) => rej(err));
        this.RunningMap.delete(messageId);
        this.PausedMap.set(messageId, msg);
        res("[djs/lottery] The givewawy has been paused");
      });
    });
  }
}
