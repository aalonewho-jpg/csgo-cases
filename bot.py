import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = '8673678093:AAFB7aAPZKinv64WUOjDPAtDJ8s6_ULiBzE'

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🎮 TEST CASES\n\n"
        "🔥 Открывай кейсы\n"
        "💰 Выполняй задания\n"
        "🎁 Собирай скины\n\n"
        "👇 Нажми кнопку в меню снизу"
    )

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("✅ Бот запущен!")
    app.run_polling()

if __name__ == '__main__':
    main()
