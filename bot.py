import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Токен бота
TOKEN = '8673678093:AAFB7aAPZKinv64WUOjDPAtDJ8s6_ULiBzE'

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Простое приветственное сообщение"""
    await update.message.reply_text(
        "🎮 Добро пожаловать в CS:GO Case Opener!\n\n"
        "🔹 Открывай кейсы (250💰)\n"
        "🔹 Собирай редкие скины\n"
        "🔹 Продавай предметы за 50%\n"
        "🔹 Стартовый баланс: 1000💰\n\n"
        "👇 Нажми на кнопку в меню снизу, чтобы начать!"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда помощи"""
    await update.message.reply_text(
        "📖 Как играть:\n"
        "1. Нажми на кнопку меню снизу\n"
        "2. Открывай кейсы\n"
        "3. Собирай предметы\n"
        "4. Продавай за монеты"
    )

def main():
    """Запуск бота"""
    try:
        # Создаем приложение
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        
        # Запускаем бота
        print("🤖 Бот запущен...")
        
        # Получаем информацию о боте
        import asyncio
        bot_info = asyncio.run(application.bot.get_me())
        print(f"✅ Бот: @{bot_info.username}")
        print(f"📱 Mini App кнопка должна быть настроена в BotFather")
        
        application.run_polling()
        
    except Exception as e:
        logger.error(f"Ошибка при запуске бота: {e}")
        print(f"❌ Ошибка: {e}")

if __name__ == '__main__':
    main()