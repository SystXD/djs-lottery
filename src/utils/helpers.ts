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
} from "discord.js";

export type ManagerProps = {
  Client: Client;
  EmbedJSON: EmbedBuilder | APIEmbed;
  EntryButton?: ActionRowBuilder<ButtonBuilder>;
};

export type Response = Message | CommandInteraction;

export const EntryButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(`${Math.floor(Math.random() * 6)}`)
    .setLabel("Enter Giveaway")
    .setStyle(ButtonStyle.Premium)
);
