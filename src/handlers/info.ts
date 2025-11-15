import { Context, Keyboard } from '@maxhub/max-bot-api';
import fs from 'fs';
import path from 'path';
import { getBackButton } from '../menus';

export async function handleInfoTopic(ctx: Context, topic: string) {
  const infoPath = path.join(process.cwd(), 'info', topic, 'content.md');

  if (!fs.existsSync(infoPath)) {
    return ctx.reply('📄 Контент временно недоступен.', {
      format: 'markdown',
      attachments: [getBackButton('menu:info')]
    });
  }

  const content = fs.readFileSync(infoPath, 'utf-8');
  await ctx.reply(content, {
    format: 'markdown',
    attachments: [getBackButton('menu:info')]
  });
}

export async function handleCharity(ctx: Context) {
  const infoPath = path.join(process.cwd(), 'info', 'charity', 'content.md');

  if (!fs.existsSync(infoPath)) {
    return ctx.reply('📄 Контент временно недоступен.', {
      format: 'markdown',
      attachments: [getBackButton('back:main')]
    });
  }

  const content = fs.readFileSync(infoPath, 'utf-8');
  await ctx.reply(content, {
    format: 'markdown',
    attachments: [getBackButton('back:main')]
  });
}
