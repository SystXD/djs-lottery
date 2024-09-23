import {
  EmbedBuilder,
  Client,
  APIEmbed,
  Interaction,
  Message,
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageReaction,
} from "discord.js";

export type ManagerProps = {
  Client: Client;
  EmbedJSON?: EmbedBuilder | APIEmbed;
};

export type Response = Message | CommandInteraction;

export const EntryButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(`${Math.floor(Math.random() * 6)}`)
    .setLabel("Enter Giveaway")
    .setStyle(ButtonStyle.Premium)
);

export const GenerateEmbed = async (prize: string, duration: number): Promise<EmbedBuilder> => {
  return new EmbedBuilder({
    color: 0xffffff,
    title: prize,
    description: `**Prize: ${prize}**`,
    fields: [
      {
        name: "End At",
        value: `<t:${
          Math.floor(Date.now() / 1000) + Math.floor(duration / 1000)
        }:R>`,
      },
    ],
  });
};

export const getWinner = async (reaction: MessageReaction) => {
  if (!reaction || reaction.users.cache.size <= 0) return "Invalid winner";
  const users = [...(await reaction.users.fetch()).values()];
  return users[Math.floor(Math.random() * users.length)];
};
