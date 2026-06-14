import { BaseContext } from "./base-context.js";
import {
  Message,
  SendMessageParams,
  SendPhotoParams,
  SendVideoParams,
  SendMediaGroupParams,
  SendAudioParams,
  SendDocumentParams,
  SendVoiceParams,
  SendAnimationParams,
  InputFile,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaLivePhoto,
  InputMedia,
  EditMessageTextParams,
  EditMessageCaptionParams,
  EditMessageMediaParams,
  PinChatMessageParams,
  UnpinChatMessageParams,
  ChatInviteLink,
  CreateChatInviteLinkParams,
  EditChatInviteLinkParams,
  CreateChatSubscriptionInviteLinkParams,
  EditChatSubscriptionInviteLinkParams,
  ApproveSuggestedPostParams,
  DeclineSuggestedPostParams,
  PromoteChatMemberParams,
  BanChatMemberParams,
  UnbanChatMemberParams,
  BanChatSenderChatParams,
  InputRichMessage,
  SendRichMessageParams,
} from "../../types/telegram.js";

export class ChannelContext {
  constructor(private readonly ctx: BaseContext) {}

  private get chatId(): number {
    const id = this.ctx.chatId;
    if (!id) throw new Error("Channel operations require a chat_id.");
    return id;
  }

  // ==========================================
  // 1. GUARD BOTS & JOIN REQUESTS
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

  // ==========================================
  // 2. MONETIZATION & INVITATION LINKS
  // ==========================================

  /**
   * Create a subscription invite link for the channel (recurrent payment in Stars)
   * @param subscriptionPeriod - Period in seconds (currently 2592000 for 30 days)
   * @param subscriptionPrice - Amount of Stars per period
   * @param options - Additional parameters
   * @returns `Promise<ChatInviteLink>`
   */
  public async createSubscriptionInviteLink(
    subscriptionPeriod: number,
    subscriptionPrice: number,
    options?: Omit<CreateChatSubscriptionInviteLinkParams, "chat_id" | "subscription_period" | "subscription_price">
  ): Promise<ChatInviteLink> {
    return this.ctx.api.createChatSubscriptionInviteLink({
      chat_id: this.chatId,
      subscription_period: subscriptionPeriod,
      subscription_price: subscriptionPrice,
      ...options,
    });
  }

  /**
   * Edit a subscription invite link
   * @param inviteLink - Invite link to edit
   * @param options - Additional parameters
   * @returns `Promise<ChatInviteLink>`
   */
  public async editSubscriptionInviteLink(
    inviteLink: string,
    options?: Omit<EditChatSubscriptionInviteLinkParams, "chat_id" | "invite_link">
  ): Promise<ChatInviteLink> {
    return this.ctx.api.editChatSubscriptionInviteLink({
      chat_id: this.chatId,
      invite_link: inviteLink,
      ...options,
    });
  }

  /**
   * Export the chat invite link
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
  // 3. WORK WITH SUGGESTED POSTS
  // ==========================================

  /**
   * Approve a suggested post to publish it in the channel
   * @param messageId - Suggested post message ID. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async approveSuggestedPost(
    messageId?: number,
    options?: Omit<ApproveSuggestedPostParams, "chat_id" | "message_id">
  ): Promise<boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot approve suggested post: message_id is missing.");
    }
    return this.ctx.api.approveSuggestedPost({
      chat_id: this.chatId,
      message_id: finalMessageId,
      ...options,
    });
  }

  /**
   * Decline a suggested post
   * @param messageId - Suggested post message ID. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async declineSuggestedPost(
    messageId?: number,
    options?: Omit<DeclineSuggestedPostParams, "chat_id" | "message_id">
  ): Promise<boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot decline suggested post: message_id is missing.");
    }
    return this.ctx.api.declineSuggestedPost({
      chat_id: this.chatId,
      message_id: finalMessageId,
      ...options,
    });
  }

  // ==========================================
  // 4. CONTENT MANAGEMENT
  // ==========================================

  /**
   * Send a rich message using HTML or Markdown
   * @param richMessage - The rich message options
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendRichMessage(
    richMessage: ({ html: string; markdown?: never } | { markdown: string; html?: never }) & Pick<InputRichMessage, "is_rtl" | "skip_entity_detection">,
    options?: Omit<SendRichMessageParams, "chat_id" | "rich_message">
  ): Promise<Message> {
    return this.ctx.api.sendRichMessage({
      chat_id: this.chatId,
      rich_message: richMessage,
      ...options,
    });
  }

  /**
   * Send a text message to the channel
   * @param text - Message text
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendMessage(
    text: string,
    options?: Omit<SendMessageParams, "chat_id" | "text">
  ): Promise<Message> {
    return this.ctx.api.sendMessage({
      chat_id: this.chatId,
      text,
      ...options,
    });
  }

  /**
   * Send a photo to the channel
   * @param photo - Photo URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendPhoto(
    photo: string | InputFile,
    options?: Omit<SendPhotoParams, "chat_id" | "photo">
  ): Promise<Message> {
    return this.ctx.api.sendPhoto({
      chat_id: this.chatId,
      photo,
      ...options,
    });
  }

  /**
   * Send a video to the channel
   * @param video - Video URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendVideo(
    video: string | InputFile,
    options?: Omit<SendVideoParams, "chat_id" | "video">
  ): Promise<Message> {
    return this.ctx.api.sendVideo({
      chat_id: this.chatId,
      video,
      ...options,
    });
  }

  /**
   * Send a group of photos or videos as an album
   * @param media - Array of media items
   * @param options - Additional parameters
   * @returns `Promise<Message[]>`
   */
  public async sendMediaGroup(
    media: (InputMediaPhoto | InputMediaVideo | InputMediaAudio | InputMediaDocument | InputMediaLivePhoto)[],
    options?: Omit<SendMediaGroupParams, "chat_id" | "media">
  ): Promise<Message[]> {
    return this.ctx.api.sendMediaGroup({
      chat_id: this.chatId,
      media,
      ...options,
    });
  }

  /**
   * Send an audio file
   * @param audio - Audio URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendAudio(
    audio: string | InputFile,
    options?: Omit<SendAudioParams, "chat_id" | "audio">
  ): Promise<Message> {
    return this.ctx.api.sendAudio({
      chat_id: this.chatId,
      audio,
      ...options,
    });
  }

  /**
   * Send a document/file
   * @param document - Document URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendDocument(
    document: string | InputFile,
    options?: Omit<SendDocumentParams, "chat_id" | "document">
  ): Promise<Message> {
    return this.ctx.api.sendDocument({
      chat_id: this.chatId,
      document,
      ...options,
    });
  }

  /**
   * Send a voice message
   * @param voice - Voice URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendVoice(
    voice: string | InputFile,
    options?: Omit<SendVoiceParams, "chat_id" | "voice">
  ): Promise<Message> {
    return this.ctx.api.sendVoice({
      chat_id: this.chatId,
      voice,
      ...options,
    });
  }

  /**
   * Send an animation/GIF
   * @param animation - Animation URL or file_id
   * @param options - Additional parameters
   * @returns `Promise<Message>`
   */
  public async sendAnimation(
    animation: string | InputFile,
    options?: Omit<SendAnimationParams, "chat_id" | "animation">
  ): Promise<Message> {
    return this.ctx.api.sendAnimation({
      chat_id: this.chatId,
      animation,
      ...options,
    });
  }

  /**
   * Edit the text of a message
   * @param text - New message text
   * @param messageId - Message ID to edit. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<Message | boolean>`
   */
  public async editMessageText(
    text: string,
    messageId?: number,
    options?: Omit<EditMessageTextParams, "chat_id" | "message_id" | "text">
  ): Promise<Message | boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot edit message text: message_id is missing.");
    }
    return this.ctx.api.editMessageText({
      chat_id: this.chatId,
      message_id: finalMessageId,
      text,
      ...options,
    });
  }

  /**
   * Edit the caption of a message
   * @param caption - New message caption
   * @param messageId - Message ID to edit. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<Message | boolean>`
   */
  public async editMessageCaption(
    caption: string,
    messageId?: number,
    options?: Omit<EditMessageCaptionParams, "chat_id" | "message_id" | "caption">
  ): Promise<Message | boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot edit message caption: message_id is missing.");
    }
    return this.ctx.api.editMessageCaption({
      chat_id: this.chatId,
      message_id: finalMessageId,
      caption,
      ...options,
    });
  }

  /**
   * Edit the media elements of a message
   * @param media - New media content
   * @param messageId - Message ID to edit. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<Message | boolean>`
   */
  public async editMessageMedia(
    media: InputMedia,
    messageId?: number,
    options?: Omit<EditMessageMediaParams, "chat_id" | "message_id" | "media">
  ): Promise<Message | boolean> {
    const finalMessageId = messageId ?? this.ctx.message?.message_id;
    if (!finalMessageId) {
      throw new Error("Cannot edit message media: message_id is missing.");
    }
    return this.ctx.api.editMessageMedia({
      chat_id: this.chatId,
      message_id: finalMessageId,
      media,
      ...options,
    });
  }

  /**
   * Delete a post from the channel
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
   * Delete multiple messages from the channel
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
   * Pin a message in the channel header
   * @param messageId - Message ID to pin. If omitted, resolved from the update.
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async pinChatMessage(
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
   * Unpin a message from the channel header
   * @param messageId - Optional message ID to unpin. If omitted, the latest pinned message is unpinned.
   * @returns `Promise<boolean>`
   */
  public async unpinChatMessage(messageId?: number): Promise<boolean> {
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
   * Unpin all pinned messages in the channel
   * @returns `Promise<boolean>`
   */
  public async unpinAllChatMessages(): Promise<boolean> {
    return this.ctx.api.unpinAllChatMessages({
      chat_id: this.chatId,
    });
  }

  // ==========================================
  // 5. MODERATION & MEMBERS MANAGEMENT
  // ==========================================

  /**
   * Promote or demote a user in the channel (manage administrators)
   * @param userId - User ID
   * @param options - Administrator permissions
   * @returns `Promise<boolean>`
   */
  public async promoteChatMember(
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
   * Ban a user from the channel (kick and block)
   * @param userId - User ID
   * @param options - Additional ban settings (e.g. until_date)
   * @returns `Promise<boolean>`
   */
  public async banChatMember(
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
   * Unban a user from the channel
   * @param userId - User ID
   * @param options - Additional parameters
   * @returns `Promise<boolean>`
   */
  public async unbanChatMember(
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
   * Ban a channel from posting comments/interacting (spammers)
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
   * Get the number of members in the channel.
   * @returns `Promise<number>`
   */
  public async getMemberCount(): Promise<number> {
    return this.ctx.api.getChatMemberCount({
      chat_id: this.chatId,
    });
  }
}
