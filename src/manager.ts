import { EventEmitter } from "node:events";
import {
  EmbedBuilder,
  Client,
  GuildChannel,
  APIEmbed,
  Message,
  Channel,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import { EntryButton as DefaultButton, ManagerProps } from "./utils/helpers";
export class GiveawayConfig extends EventEmitter {
  private Client: Client;
  public EmbedJSON: EmbedBuilder | APIEmbed;
  private Map: Map<string, any>;
  private EndedMap: Map<string, Message>;
  private RunningMap: Map<string, Message>;
  private PausedMap: Map<string, Message>;
  public EntryButton: ActionRowBuilder<ButtonBuilder>;
  constructor({ Client, EmbedJSON, EntryButton }: ManagerProps) {
    super();
    this.Client = Client;
    this.EmbedJSON = EmbedJSON;
    this.Map = new Map();
    this.EndedMap = new Map();
    this.RunningMap = new Map();
    this.PausedMap = new Map();
    this.EntryButton = EntryButton ?? DefaultButton;
   
  }

  public start(prize: string, channel: Channel, duration?: number) {
    return new Promise(async (res, rej) => {
      if (channel.isSendable())
        if (channel.isTextBased()) {
          const message = await channel.send({
            embeds: [this.EmbedJSON],
            components: [this.EntryButton],
          });
          this.RunningMap.set(message.id, message);
          this.emit('giveawayOn', message, duration ?? 86_400_000)
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
        if (!message.embeds[0])
          return rej(
            "[Error: djs/lottery] Unable to locate embed attached to the giveaway"
          );
        EmbedBuilder.from(message.embeds[0]).setDescription(
          `The winner was [Defaut User]`
        );
        await message
          .edit({ embeds: [message.embeds[0]] })
          .catch((err) => rej(err));
       
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
        this.PausedMap.set(messageId, msg);
        this.RunningMap.delete(messageId);
        res('[djs/lottery] The givewawy has been stopped temprorat')
      });
    });
  }
}
