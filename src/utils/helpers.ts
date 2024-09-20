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

export const GenerateEmbed = async (prize:string, duration:number) => {
  const { default:prettyMs } = await import('pretty-ms')
  return new EmbedBuilder({ 
        color: 0xFFFFFF,
        title: prize,
        description: `The event will end in ${prettyMs(duration)}`
   })
}

export const getWinner = async (reaction: MessageReaction) => {
 if (!reaction || reaction.users.cache.size <= 0) return 'Invalid winner'
  const users = [...(await reaction.users.fetch()).values()];
  return users[Math.floor(Math.random() * users.length)];
};
