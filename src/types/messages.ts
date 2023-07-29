export enum Roles {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
}

export interface Message {
  role: Roles;
  content: string;
}
