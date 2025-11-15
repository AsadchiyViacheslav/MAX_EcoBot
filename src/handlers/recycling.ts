import { Context, Keyboard } from '@maxhub/max-bot-api';
import { getPoints, countPoints } from '../db';
import { translateMaterials } from '../materials';

export async function handleRecycling(ctx: Context, city: string, offset = 0) {
  const points = getPoints(city, 'RC', offset, 10);
  if (!points.length) {
    const backKeyboard = Keyboard.inlineKeyboard([
      [Keyboard.button.callback('⬅️ Назад', 'back:main')]
    ]);
    return ctx.reply(`❌ В городе "${city}" нет пунктов приёма вторсырья.`, { attachments: [backKeyboard] });
  }

  let message = `📍 **Пункты приёма вторсырья в городе ${city}**\n\n`;
  points.forEach((p, i) => {
    const mats = translateMaterials(p.materials).join(', ');
    message += `**${i + 1 + offset}. ${p.name}**\n📍 ${p.address}\n♻️ Принимают: ${mats}\n\n`;
  });

  const total = countPoints(city, 'RC');

  const buttons = [[Keyboard.button.callback('⬅️ Назад', 'back:main')]];
  if (offset + points.length < total) {
    buttons.push([Keyboard.button.callback('➡️ Больше', `recycling:${city}:${offset + 10}`)]);
  }

  const inlineKeyboard = Keyboard.inlineKeyboard(buttons);

  await ctx.reply(message, { format: 'markdown', attachments: [inlineKeyboard] });
}
