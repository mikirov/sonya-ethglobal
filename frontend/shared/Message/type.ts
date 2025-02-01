export enum MessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export type MessageType = {
  role: MessageRole;
  content: string;
};

export interface MessageProps extends MessageType {
  isLast: boolean;
}