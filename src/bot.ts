import { Bot, Keyboard } from '@maxhub/max-bot-api';
import * as dotenv from 'dotenv';
import { handleRecycling } from './handlers/recycling';
import { handleEcoPlaces } from './handlers/ecoplaces';
import { handleCharity } from './handlers/charity';
import { handleInfoTopic } from './handlers/info';
import { getMainMenuKeyboard, getInfoMenuKeyboard, getBackButton } from './menus';

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);

const userCityContext = new Map<number, 'RC' | 'ZW'>();

bot.on('bot_started', async (ctx) => {
  console.log('Бот запущен пользователем:', ctx.update.user?.name);

  try {
    const image = await ctx.api.uploadImage({
      url: 'https://i.yapx.ru/cI5o0.png'
    });

    const welcomeText = `🌍 **Добро пожаловать в ЭкоБот!** 

Я помогу вам позаботиться о нашей планете и находить ближайшие пункты приёма вторсырья, эко-заведения и экологические фонды.  
Вы узнаете, как уменьшить отходы, перерабатывать материалы и выбирать экологичные альтернативы в быту.

Выберите нужный раздел ниже, чтобы узнать больше:`;

    await ctx.reply(welcomeText, {
      attachments: [image.toJson(), getMainMenuKeyboard()],
      format: 'markdown',
    });
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    await ctx.reply('Произошла ошибка при загрузке приветственного изображения.', {
      attachments: [getMainMenuKeyboard()],
      format: 'markdown',
    });
  }
});

bot.action('menu:recycling', async (ctx) => {
  const userId = ctx.update.callback.user.user_id;
  userCityContext.set(userId, 'RC');

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.requestGeoLocation('📍 Определить местоположение')],
    [Keyboard.button.callback('⬅️ Назад', 'back:main')]
  ]);

  await ctx.reply('📍 Введите название города или определите ваше текущее местоположение:', {
    attachments: [keyboard],
    format: 'markdown'
  });
});

bot.action('menu:eco_places', async (ctx) => {
  const userId = ctx.update.callback.user.user_id;
  userCityContext.set(userId, 'ZW');

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.requestGeoLocation('📍 Определить местоположение')],
    [Keyboard.button.callback('⬅️ Назад', 'back:main')]
  ]);

  await ctx.reply('🌿 Введите название города или определите ваше текущее местоположение:', {
    attachments: [keyboard],
    format: 'markdown'
  });
});
bot.action('menu:charity', handleCharity);
bot.action('back:main', async (ctx) => {
  await ctx.reply('🌍 Главное меню:', { attachments: [getMainMenuKeyboard()], format: 'markdown' });
});

bot.action('info:recyclable', async (ctx) => handleInfoTopic(ctx, 'recyclable'));
bot.action('info:plastic_danger', async (ctx) => handleInfoTopic(ctx, 'plastic_danger'));
bot.action('info:alternatives', async (ctx) => handleInfoTopic(ctx, 'alternatives'));
bot.action('info:why_recycle', async (ctx) => handleInfoTopic(ctx, 'why_recycle'));
bot.action('info:reduce_waste', async (ctx) => handleInfoTopic(ctx, 'reduce_waste'));
bot.action('info:hazard_classes', async (ctx) => handleInfoTopic(ctx, 'hazard_classes'));
bot.action('info:eco_lifestyle', async (ctx) => handleInfoTopic(ctx, 'eco_lifestyle'));

bot.action('menu:info', async (ctx) => {
  await ctx.reply(
    '📚 **Информационный блок**\n\nВыберите интересующую вас тему:',
    { format: 'markdown', attachments: [getInfoMenuKeyboard()] }
  );
});

bot.action(/recycling:(.+):(\d+)/, async (ctx) => {
  const [, city, offset] = ctx.match!;
  await handleRecycling(ctx, city, parseInt(offset, 10));
});

bot.action(/eco:(.+):(\d+)/, async (ctx) => {
  const [, city, offset] = ctx.match!;
  await handleEcoPlaces(ctx, city, parseInt(offset, 10));
});

bot.on('message_created', async (ctx) => {
  const userId = ctx.message?.sender?.user_id;
  if (!userId) return;

  const type = userCityContext.get(userId);

  if (ctx.location) {
    const { latitude, longitude } = ctx.location;

    try {
      // бесплатное открытое API OpenStreetMap Nominatim для определения города
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;

      if (!city) throw new Error('Не удалось определить город');

      if (type === 'RC') {
        await handleRecycling(ctx, city);
      } else if (type === 'ZW') {
        await handleEcoPlaces(ctx, city);
      }
    } catch (err) {
      console.error(err);
      await ctx.reply('❌ Не удалось определить ваш город. Попробуйте ввести название вручную.', {
        attachments: [getBackButton('back:main')],
        format: 'markdown'
      });
    }

    return;
  }

  const text = ctx.message?.body?.text;
  if (!text || text.startsWith('/')) return;

  if (type === 'RC') {
    await handleRecycling(ctx, text);
  } else if (type === 'ZW') {
    await handleEcoPlaces(ctx, text);
  } else {
    await ctx.reply('Выберите раздел из главного меню.', {
      attachments: [getMainMenuKeyboard()],
      format: 'markdown'
    });
  }
});

bot.start();
console.log('🌍 ЭкоБот запущен!');
