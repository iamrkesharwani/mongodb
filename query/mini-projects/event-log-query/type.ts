export interface EventLog {
  type: 'info' | 'warn' | 'error';
  userId: string;
  metadata: Record<string, any>;
  severity: 'info' | 'warn' | 'error';
  createdAt: Date;
}
