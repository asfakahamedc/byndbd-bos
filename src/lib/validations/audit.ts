import { z } from 'zod';

export const auditLogSchema = z.object({
  user_id: z.string().uuid().optional(),
  action: z.string().min(1),
  module: z.string().min(1),
  entity_type: z.string().optional(),
  entity_id: z.string().optional(),
  old_value: z.any().optional(),
  new_value: z.any().optional(),
});

export type AuditLogInput = z.infer<typeof auditLogSchema>;
