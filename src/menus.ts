import { Keyboard } from '@maxhub/max-bot-api';

export function getMainMenuKeyboard() {
  return Keyboard.inlineKeyboard([
    [Keyboard.button.callback('📍 Куда сдать мусор', 'menu:recycling')],
    [Keyboard.button.callback('🌿 Эко-френдли заведения', 'menu:eco_places')],
    [Keyboard.button.callback('💚 Благотворительность', 'menu:charity')],
    [Keyboard.button.callback('📚 Информационный блок', 'menu:info')]
  ]);
}

export function getInfoMenuKeyboard() {
  return Keyboard.inlineKeyboard([
    [Keyboard.button.callback('♻️ Что можно переработать', 'info:recyclable')],
    [Keyboard.button.callback('⚠️ Опасность пластика', 'info:plastic_danger')],
    [Keyboard.button.callback('🏠 Эко-альтернативы в быту', 'info:alternatives')],
    [Keyboard.button.callback('🌍 Зачем перерабатывать', 'info:why_recycle')],
    [Keyboard.button.callback('📉 Как сократить отходы', 'info:reduce_waste')],
    [Keyboard.button.callback('☢️ Классы опасности', 'info:hazard_classes')],
    [Keyboard.button.callback('🌱 Экологичность в быту', 'info:eco_lifestyle')],
    [Keyboard.button.callback('⬅️ Назад в главное меню', 'back:main')]
  ]);
}

export function getBackButton(destination: string) {
  return Keyboard.inlineKeyboard([[Keyboard.button.callback('⬅️ Назад', destination)]]);
}
