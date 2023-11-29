import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

const { TELE_BOT_ID } = <{ TELE_BOT_ID: string }>process.env;

export const bot = new TelegramBot(TELE_BOT_ID, { polling: true });
