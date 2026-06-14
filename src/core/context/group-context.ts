import { BaseContext } from "./base-context.js";
import {
  Message,
  InputFile,
  BanChatMemberParams,
  UnbanChatMemberParams,
  RestrictChatMemberParams,
  ChatPermissions,
  PromoteChatMemberParams,
  PinChatMessageParams,
  UnpinChatMessageParams,
  BanChatSenderChatParams,
  CreateForumTopicParams,
  ForumTopic,
  EditForumTopicParams,
  Sticker,
  SendPollParams,
  SendDiceParams,
  ReactionType,
  ChatInviteLink,
  CreateChatInviteLinkParams,
  EditChatInviteLinkParams,
  InputPollOption,
} from "../../types/telegram.js";

export class GroupContext {
  constructor(private readonly ctx: BaseContext) { }

  private get chatId(): number {
    const id = this.ctx.chatId;
    if (!id) throw new Error("Group operations require a chat_id.");
    return id;
  }

  // ==========================================
  // 1. FORUMS & TOPICS (SUPERGROUPS)
  // ==========================================

  /**
   * Create a new forum topic in a supergroup
   * @param name - Topic name
   * @param options - Additional parameters
   * @returns `Promise<ForumTopic>`
   */
  public async createForumTopic(
    name: string,
    options?: Omit<CreateForumTopicParams, "chat_id" | "name">
  ): Promise<ForumTopic> {
    return this.ctx.api.createForumTopic({
      chat_id: this.chatId,
      name,
      ...options,
    });
  }

  /**
   * Edit a forum topic
   * @param name - Optional new topic name (0-128 characters). If omitted, the current name is kept.
   * @param messageThreadId - Thread ID. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async editForumTopic(
    name?: string,
    messageThreadId?: number,
    options?: Omit<EditForumTopicParams, "chat_id" | "message_thread_id" | "name">
  ): Promise<boolean> {
    const threadId = messageThreadId ?? (this.ctx.message as Message | undefined)?.message_thread_id;
    if (!threadId) throw new Error("message_thread_id is required.");
    return this.ctx.api.editForumTopic({
      chat_id: this.chatId,
      message_thread_id: threadId,
      name,
      ...options,
    });
  }

  /**
   * Close an open forum topic
   * @param messageThreadId - Thread ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async closeForumTopic(messageThreadId?: number): Promise<boolean> {
    const threadId = messageThreadId ?? (this.ctx.message as Message | undefined)?.message_thread_id;
    if (!threadId) throw new Error("message_thread_id is required.");
    return this.ctx.api.closeForumTopic({
      chat_id: this.chatId,
      message_thread_id: threadId,
    });
  }

  /**
   * Reopen a closed forum topic
   * @param messageThreadId - Thread ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async reopenForumTopic(messageThreadId?: number): Promise<boolean> {
    const threadId = messageThreadId ?? (this.ctx.message as Message | undefined)?.message_thread_id;
    if (!threadId) throw new Error("message_thread_id is required.");
    return this.ctx.api.reopenForumTopic({
      chat_id: this.chatId,
      message_thread_id: threadId,
    });
  }

  /**
   * Delete a forum topic and all its messages
   * @param messageThreadId - Thread ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async deleteForumTopic(messageThreadId?: number): Promise<boolean> {
    const threadId = messageThreadId ?? (this.ctx.message as Message | undefined)?.message_thread_id;
    if (!threadId) throw new Error("message_thread_id is required.");
    return this.ctx.api.deleteForumTopic({
      chat_id: this.chatId,
      message_thread_id: threadId,
    });
  }

  /**
   * Edit the general topic name in a supergroup
   * @param name - New general topic name
   * @returns `Promise<boolean>`
   */
  public async editGeneralForumTopic(name: string): Promise<boolean> {
    return this.ctx.api.editGeneralForumTopic({
      chat_id: this.chatId,
      name,
    });
  }

  /**
   * Close the general topic in a supergroup
   * @returns `Promise<boolean>`
   */
  public async closeGeneralForumTopic(): Promise<boolean> {
    return this.ctx.api.closeGeneralForumTopic({
      chat_id: this.chatId,
    });
  }

  /**
   * Reopen the general topic in a supergroup
   * @returns `Promise<boolean>`
   */
  public async reopenGeneralForumTopic(): Promise<boolean> {
    return this.ctx.api.reopenGeneralForumTopic({
      chat_id: this.chatId,
    });
  }

  /**
   * Hide the general topic in a supergroup
   * @returns `Promise<boolean>`
   */
  public async hideGeneralForumTopic(): Promise<boolean> {
    return this.ctx.api.hideGeneralForumTopic({
      chat_id: this.chatId,
    });
  }

  /**
   * Unhide the general topic in a supergroup
   * @returns `Promise<boolean>`
   */
  public async unhideGeneralForumTopic(): Promise<boolean> {
    return this.ctx.api.unhideGeneralForumTopic({
      chat_id: this.chatId,
    });
  }

  /**
   * Unpin all messages in a forum topic
   * @param messageThreadId - Thread ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async unpinAllForumTopicMessages(messageThreadId?: number): Promise<boolean> {
    const threadId = messageThreadId ?? (this.ctx.message as Message | undefined)?.message_thread_id;
    if (!threadId) throw new Error("message_thread_id is required.");
    return this.ctx.api.unpinAllForumTopicMessages({
      chat_id: this.chatId,
      message_thread_id: threadId,
    });
  }

  /**
   * Unpin all messages in the general topic
   * @returns `Promise<boolean>`
   */
  public async unpinAllGeneralForumTopicMessages(): Promise<boolean> {
    return this.ctx.api.unpinAllGeneralForumTopicMessages({
      chat_id: this.chatId,
    });
  }

  /**
   * Get custom emoji stickers for forum topic icons
   * @returns `Promise<Sticker[]>`
   */
  public async getForumTopicIconStickers(): Promise<Sticker[]> {
    return this.ctx.api.getForumTopicIconStickers();
  }

  // ==========================================
  // 2. MODERATION & ADMINISTRATION
  // ==========================================

  /**
   * Ban a user from the group.
   * @param userId - User ID
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async ban(
    userId: number,
    options?: Omit<BanChatMemberParams, "chat_id" | "user_id">
  ): Promise<boolean> {
    return this.ctx.api.banChatMember({
      chat_id: this.chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * Unban a user from the group.
   * @param userId - User ID
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async unban(
    userId: number,
    options?: Omit<UnbanChatMemberParams, "chat_id" | "user_id">
  ): Promise<boolean> {
    return this.ctx.api.unbanChatMember({
      chat_id: this.chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * Restrict a user in the group.
   * @param userId - User ID
   * @param permissions - New permissions
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async restrict(
    userId: number,
    permissions: ChatPermissions,
    options?: Omit<RestrictChatMemberParams, "chat_id" | "user_id" | "permissions">
  ): Promise<boolean> {
    return this.ctx.api.restrictChatMember({
      chat_id: this.chatId,
      user_id: userId,
      permissions,
      ...options,
    });
  }

  /**
   * Promote or demote a user in the group.
   * @param userId - User ID
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async promote(
    userId: number,
    options?: Omit<PromoteChatMemberParams, "chat_id" | "user_id">
  ): Promise<boolean> {
    return this.ctx.api.promoteChatMember({
      chat_id: this.chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * Ban a channel from posting comments/interacting
   * @param senderChatId - Sender channel ID to ban
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async banChatSenderChat(
    senderChatId: number,
    options?: Omit<BanChatSenderChatParams, "chat_id" | "sender_chat_id">
  ): Promise<boolean> {
    return this.ctx.api.banChatSenderChat({
      chat_id: this.chatId,
      sender_chat_id: senderChatId,
      ...options,
    });
  }

  /**
   * Unban a previously banned channel
   * @param senderChatId - Sender channel ID to unban
   * @returns `Promise<boolean>`
   */
  public async unbanChatSenderChat(senderChatId: number): Promise<boolean> {
    return this.ctx.api.unbanChatSenderChat({
      chat_id: this.chatId,
      sender_chat_id: senderChatId,
    });
  }

  /**
   * Set a custom title for an administrator promoted by the bot
   * @param userId - Admin user ID
   * @param customTitle - Custom title (max 16 characters)
   * @returns `Promise<boolean>`
   */
  public async setAdministratorCustomTitle(userId: number, customTitle: string): Promise<boolean> {
    return this.ctx.api.setChatAdministratorCustomTitle({
      chat_id: this.chatId,
      user_id: userId,
      custom_title: customTitle,
    });
  }

  /**
   * Set default chat permissions for all users
   * @param permissions - Default permissions
   * @param options - Additional parameters (e.g. use_independent_chat_permissions)
   * @returns `Promise<boolean>`
   */
  public async setPermissions(
    permissions: ChatPermissions,
    options?: { use_independent_chat_permissions?: boolean }
  ): Promise<boolean> {
    return this.ctx.api.setChatPermissions({
      chat_id: this.chatId,
      permissions,
      ...options,
    });
  }

  // ==========================================
  // 3. GROUP PROFILE SETTINGS
  // ==========================================

  /**
   * Change the title of the group
   * @param title - New group title
   * @returns `Promise<boolean>`
   */
  public async setTitle(title: string): Promise<boolean> {
    return this.ctx.api.setChatTitle({
      chat_id: this.chatId,
      title,
    });
  }

  /**
   * Change the description of the group
   * @param description - New group description
   * @returns `Promise<boolean>`
   */
  public async setDescription(description: string): Promise<boolean> {
    return this.ctx.api.setChatDescription({
      chat_id: this.chatId,
      description,
    });
  }

  /**
   * Change the photo of the group
   * @param photo - New group photo
   * @returns `Promise<boolean>`
   */
  public async setPhoto(photo: InputFile): Promise<boolean> {
    return this.ctx.api.setChatPhoto({
      chat_id: this.chatId,
      photo,
    });
  }

  /**
   * Delete the group photo
   * @returns `Promise<boolean>`
   */
  public async deletePhoto(): Promise<boolean> {
    return this.ctx.api.deleteChatPhoto({
      chat_id: this.chatId,
    });
  }

  /**
   * Set a collective sticker set for the supergroup
   * @param stickerSetName - Sticker set name
   * @returns `Promise<boolean>`
   */
  public async setStickerSet(stickerSetName: string): Promise<boolean> {
    return this.ctx.api.setChatStickerSet({
      chat_id: this.chatId,
      sticker_set_name: stickerSetName,
    });
  }

  /**
   * Delete the collective sticker set for the supergroup
   * @returns `Promise<boolean>`
   */
  public async deleteStickerSet(): Promise<boolean> {
    return this.ctx.api.deleteChatStickerSet({
      chat_id: this.chatId,
    });
  }

  // ==========================================
  // 4. INTERACT & REACTIONS
  // ==========================================

  /**
   * Send a poll/survey to the group
   * @param question - Poll question
   * @param options - Poll answer options (as strings or full InputPollOption objects)
   * @param params - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendPoll(
    question: string,
    options: string[] | InputPollOption[],
    params?: Omit<SendPollParams, "chat_id" | "question" | "options">
  ): Promise<Message> {
    const formattedOptions: InputPollOption[] = options.map((opt) =>
      typeof opt === "string" ? { text: opt } : opt
    );
    return this.ctx.api.sendPoll({
      chat_id: this.chatId,
      question,
      options: formattedOptions,
      ...params,
    });
  }

  /**
   * Send an interactive animated dice or other emoji games
   * @param emoji - Emoji on which the dice throw animation is based (defaults to 🎲)
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendDice(
    emoji?: string,
    options?: Omit<SendDiceParams, "chat_id" | "emoji">
  ): Promise<Message> {
    return this.ctx.api.sendDice({
      chat_id: this.chatId,
      emoji,
      ...options,
    });
  }

  /**
   * Set a reaction or emoji on a message
   * @param reaction - List of reaction types to apply
   * @param messageId - Message ID. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async setMessageReaction(
    reaction: ReactionType[],
    messageId?: number,
    options?: { is_big?: boolean }
  ): Promise<boolean> {
    const finalMessageId = messageId ?? (this.ctx.message as Message | undefined)?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot set message reaction: message_id is missing.");
    }
    return this.ctx.api.setMessageReaction({
      chat_id: this.chatId,
      message_id: finalMessageId,
      reaction,
      ...options,
    });
  }

  /**
   * Delete reactions applied by a specific user on a message
   * @param userId - User ID who put the reaction
   * @param messageId - Message ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async deleteMessageReaction(
    userId: number,
    messageId?: number
  ): Promise<boolean> {
    const finalMessageId = messageId ?? (this.ctx.message as Message | undefined)?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot delete reaction: message_id is missing.");
    }
    return this.ctx.api.deleteMessageReaction({
      chat_id: this.chatId,
      message_id: finalMessageId,
      user_id: userId,
    });
  }

  /**
   * Delete up to 10,000 recent reactions added by a specific user in the group
   * @param userId - User ID whose reactions will be removed. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async deleteAllMessageReactions(userId?: number): Promise<boolean> {
    const targetUserId = userId ?? this.ctx.from?.id;
    return this.ctx.api.deleteAllMessageReactions({
      chat_id: this.chatId,
      user_id: targetUserId,
    });
  }

  // ==========================================
  // 5. INVITE LINKS & JOIN REQUESTS
  // ==========================================

  /**
   * Show a Mini App to the user before deciding on their join request
   * @param webAppUrl - Mini App URL to be opened
   * @param queryId - Optional query ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async sendChatJoinRequestWebApp(
    webAppUrl: string,
    queryId?: string
  ): Promise<boolean> {
    const targetQueryId = queryId ?? this.ctx.update.chat_join_request?.query_id;
    if (!targetQueryId) throw new Error("chat_join_request_query_id is required.");
    return this.ctx.api.sendChatJoinRequestWebApp({
      chat_join_request_query_id: targetQueryId,
      web_app_url: webAppUrl,
    });
  }

  /**
   * Process a received chat join request query
   * @param result - Outcome ('approve', 'decline', or 'queue')
   * @param queryId - Optional query ID. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async answerChatJoinRequestQuery(
    result: "approve" | "decline" | "queue",
    queryId?: string
  ): Promise<boolean> {
    const targetQueryId = queryId ?? this.ctx.update.chat_join_request?.query_id;
    if (!targetQueryId) throw new Error("chat_join_request_query_id is required.");
    return this.ctx.api.answerChatJoinRequestQuery({
      chat_join_request_query_id: targetQueryId,
      result,
    });
  }

  /**
   * Approve a request to join the chat
   * @param userId - User ID
   * @returns `Promise<boolean>`
   */
  public async approveChatJoinRequest(userId: number): Promise<boolean> {
    return this.ctx.api.approveChatJoinRequest({
      chat_id: this.chatId,
      user_id: userId,
    });
  }

  /**
   * Decline a request to join the chat
   * @param userId - User ID
   * @returns `Promise<boolean>`
   */
  public async declineChatJoinRequest(userId: number): Promise<boolean> {
    return this.ctx.api.declineChatJoinRequest({
      chat_id: this.chatId,
      user_id: userId,
    });
  }

  /**
   * Export the group invite link
   * @returns `Promise<string>`
   */
  public async exportInviteLink(): Promise<string> {
    return this.ctx.api.exportChatInviteLink({
      chat_id: this.chatId,
    });
  }

  /**
   * Create an additional invite link
   * @param options - Additional parameters
   * @returns `Promise<ChatInviteLink>`
   */
  public async createInviteLink(
    options?: Omit<CreateChatInviteLinkParams, "chat_id">
  ): Promise<ChatInviteLink> {
    return this.ctx.api.createChatInviteLink({
      chat_id: this.chatId,
      ...options,
    });
  }

  /**
   * Edit an invite link created by the bot
   * @param inviteLink - Invite link to edit
   * @param options - Additional parameters
   * @returns `Promise<ChatInviteLink>`
   */
  public async editInviteLink(
    inviteLink: string,
    options?: Omit<EditChatInviteLinkParams, "chat_id" | "invite_link">
  ): Promise<ChatInviteLink> {
    return this.ctx.api.editChatInviteLink({
      chat_id: this.chatId,
      invite_link: inviteLink,
      ...options,
    });
  }

  /**
   * Revoke an invite link created by the bot
   * @param inviteLink - Invite link to revoke
   * @returns `Promise<ChatInviteLink>`
   */
  public async revokeInviteLink(inviteLink: string): Promise<ChatInviteLink> {
    return this.ctx.api.revokeChatInviteLink({
      chat_id: this.chatId,
      invite_link: inviteLink,
    });
  }

  // ==========================================
  // 6. BASIC MESSAGES & PINNING
  // ==========================================

  /**
   * Pin a message in the group header.
   * @param messageId - Message ID to pin (defaults to the current message if not specified)
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async pin(
    messageId?: number,
    options?: Omit<PinChatMessageParams, "chat_id" | "message_id">
  ): Promise<boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot pin message: message_id is missing.");
    }
    return this.ctx.api.pinChatMessage({
      chat_id: this.chatId,
      message_id: finalMessageId,
      ...options,
    });
  }

  /**
   * Unpin a message in the group.
   * @param messageId - Optional Message ID to unpin. If not specified, the latest pinned message is unpinned.
   * @returns `Promise<boolean>`
   */
  public async unpin(messageId?: number): Promise<boolean> {
    const options: Omit<UnpinChatMessageParams, "chat_id"> = {};
    if (messageId !== undefined) {
      options.message_id = messageId;
    }
    return this.ctx.api.unpinChatMessage({
      chat_id: this.chatId,
      ...options,
    });
  }

  /**
   * Unpin all pinned messages in the group
   * @returns `Promise<boolean>`
   */
  public async unpinAll(): Promise<boolean> {
    return this.ctx.api.unpinAllChatMessages({
      chat_id: this.chatId,
    });
  }

  /**
   * Delete a message in the group
   * @param messageId - Message ID to delete. If omitted, resolved from the update.
   * @returns `Promise<boolean>`
   */
  public async deleteMessage(messageId?: number): Promise<boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot delete message: message_id is missing.");
    }
    return this.ctx.api.deleteMessage({
      chat_id: this.chatId,
      message_id: finalMessageId,
    });
  }

  /**
   * Delete multiple messages in the group
   * @param messageIds - Array of message IDs
   * @returns `Promise<boolean>`
   */
  public async deleteMessages(messageIds: number[]): Promise<boolean> {
    return this.ctx.api.deleteMessages({
      chat_id: this.chatId,
      message_ids: messageIds,
    });
  }

  /**
   * Leave the group.
   * @returns `Promise<boolean>`
   */
  public async leave(): Promise<boolean> {
    return this.ctx.api.leaveChat({
      chat_id: this.chatId,
    });
  }
}
