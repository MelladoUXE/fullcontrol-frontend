import { TimeEntry } from './time-entry';

export type ApprovalStatus = 'approved' | 'rejected';

export interface ApproveRequest {
  status: ApprovalStatus;
  notes?: string;
}

export interface ApproveMultipleRequest {
  time_entry_ids: number[];
  status: ApprovalStatus;
  notes?: string;
}

export interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApprovalResults {
  success: TimeEntry[];
  failed: Array<{
    id: number;
    error: string;
  }>;
}
