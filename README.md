> [!CAUTION]
> The package is currently under development.

# djs/lottery 🌙

- ⌚Ease to use
- ⚡Typescript support
- 🎉Customizable

## Installation
```bash
npm i djs/lottery
```

## Examples
```typescript
import { GiveawayConfig } from 'djs/lottery';
import { Client } from 'discord.js'
class Bot extends Client { giveaway = new GiveawayConfig({ Client: this }) };
```

### Start a Giveaway
```typescript
client.on('messageCreate', (message) => {
   if (message.content.startsWith('.giveaway') {
      client.giveaway.start('Nitro', message.channel, 60_000).catch((_err) => /**logic**/)
       // (1 = Prize, 2 = channel, 3 = duration in ms, 4 = EmbedObject [Optional])
   }
})
```

### Fetching Giveaway

```typescript
 client.on('messageCreate', async (message) => {
   const object = await client.giveaway.fetchGiveaway('messageId').catch((_err) => /**logic**/)
   // Will return an object including details of giveaway
 })
```
### Pausing Giveaway

```typescript
  client.on('messageCreate', async (message) => {
    await client.giveaway.pause('messageId', 'message(optional)').catch((_err) => /**logic**/)
  })
```

## Rerolling Giveaway
```ts
client.on('messageCreate', async (message) => {
  await client.giveaway.reroll('messageId').catch((_err) => /**logic**/)
  // [NOTE: The giveaways are currently saved in map only for 24 hours]
})
```
**There are alot of more features, Just give a try and It won't make you regret**
