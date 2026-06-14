import { TelegramBotApi, Update } from "../../types/telegram.js";
import { ReplyContext } from "./reply-context.js";
import { ChannelContext } from "./channel-context.js";
import { GroupContext } from "./group-context.js";
import { GameContext } from "./game-context.js";

export class Context extends ReplyContext {
  private _channel?: ChannelContext;
  private _group?: GroupContext;
  private _game?: GameContext;

  constructor(update: Update, api: TelegramBotApi) {
    super(update, api);
  }

  /**
   * Channel-specific operations context.
   */
  public get channel(): ChannelContext {
    if (!this._channel) {
      this._channel = new ChannelContext(this);
    }
    return this._channel;
  }

  /**
   * Group-specific operations context.
   */
  public get group(): GroupContext {
    if (!this._group) {
      this._group = new GroupContext(this);
    }
    return this._group;
  }

  /**
   * Game-specific operations context.
   */
  public get game(): GameContext {
    if (!this._game) {
      this._game = new GameContext(this);
    }
    return this._game;
  }
}
