import { Context } from '@maxhub/max-bot-api';
import * as fs from 'fs';
import * as path from 'path';
import { getBackButton } from '../menus';

export async function handleCharity(ctx: Context) {
  const filePath = path.join(process.cwd(), 'info', 'charity', 'content.md');

  if (!fs.existsSync(filePath)) {
    return ctx.reply('📄 Контент временно недоступен.', { attachments: [getBackButton('back:main')] });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  await ctx.reply(content, { attachments: [getBackButton('back:main')], format: 'markdown' });
}
