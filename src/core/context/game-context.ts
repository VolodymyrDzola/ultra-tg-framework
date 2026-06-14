import { BaseContext } from "./base-context.js";
import {
  Message,
  SendGameParams,
  SetGameScoreParams,
  GetGameHighScoresParams,
  GameHighScore,
} from "../../types/telegram.js";

export class GameContext {
  constructor(private readonly ctx: BaseContext) {}

  private get chatId(): number {
    const id = this.ctx.chatId;
    if (!id) throw new Error("Game operations require a chat_id.");
    return id;
  }

  /**
   * Send a game to the current chat.
   * @param gameShortName - Short name of the game, serves as the unique identifier for the game on Telegram
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async replyWithGame(
    gameShortName: string,
    options?: Omit<SendGameParams, "chat_id" | "game_short_name">
  ): Promise<Message> {
    return this.ctx.api.sendGame({
      chat_id: this.chatId,
      game_short_name: gameShortName,
      ...options,
    });
  }

  /**
   * Set the score of the specified user in a game.
   * @param userId - User ID
   * @param score - New score
   * @param options - Additional parameters
   * @returns `Promise<Message | boolean>`
   */
  public async setScore(
    userId: number,
    score: number,
    options?: Omit<SetGameScoreParams, "user_id" | "score" | "chat_id" | "message_id" | "inline_message_id">
  ): Promise<Message | boolean> {
    const target = this.getTargetParams();
    return this.ctx.api.setGameScore({
      user_id: userId,
      score,
      ...target,
      ...options,
    } as SetGameScoreParams);
  }

  /**
   * Get data for high score tables in a game.
   * @param userId - User ID
   * @param options - Additional parameters
   * @returns `Promise<GameHighScore[]>`
   */
  public async getHighScores(
    userId: number,
    options?: Omit<GetGameHighScoresParams, "user_id" | "chat_id" | "message_id" | "inline_message_id">
  ): Promise<GameHighScore[]> {
    const target = this.getTargetParams();
    return this.ctx.api.getGameHighScores({
      user_id: userId,
      ...target,
      ...options,
    } as GetGameHighScoresParams);
  }

  /**
   * Helper to determine chat/message identifiers or inline message identifier for game operations.
   */
  private getTargetParams(): { inline_message_id: string } | { chat_id: number; message_id: number } {
    if (this.ctx.callbackQuery?.inline_message_id) {
      return { inline_message_id: this.ctx.callbackQuery.inline_message_id };
    }
    const chatId = this.chatId;
    const messageId = this.ctx.message?.message_id || this.ctx.callbackQuery?.message?.message_id;
    if (!chatId || !messageId) {
      throw new Error("Game operations require either an inline_message_id or chat_id and message_id.");
    }
    return { chat_id: chatId, message_id: messageId };
  }
}
