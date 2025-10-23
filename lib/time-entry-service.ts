import {
  TimeEntry,
  ClockInRequest,
  ClockOutRequest,
  StartBreakRequest,
  EndBreakRequest,
  TimeEntryFilters,
} from '@/types/time-entry';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class TimeEntryService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async clockIn(data: ClockInRequest): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/time-entries/clock-in`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to clock in');
    }

    return result.data;
  }

  async clockOut(data: ClockOutRequest): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/time-entries/clock-out`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to clock out');
    }

    return result.data;
  }

  async startBreak(data: StartBreakRequest): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/time-entries/break/start`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to start break');
    }

    return result.data;
  }

  async endBreak(data: EndBreakRequest): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/time-entries/break/end`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to end break');
    }

    return result.data;
  }

  async getActiveEntry(): Promise<TimeEntry | null> {
    const response = await fetch(`${API_URL}/time-entries/active`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to get active entry');
    }

    return result.data || null;
  }

  async getMyEntries(filters?: TimeEntryFilters): Promise<TimeEntry[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await fetch(
      `${API_URL}/time-entries/my-entries?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );

    const result: ApiResponse<TimeEntry[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get entries');
    }

    return result.data;
  }

  async getUserEntries(userId: number, filters?: TimeEntryFilters): Promise<TimeEntry[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await fetch(
      `${API_URL}/time-entries/user/${userId}?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );

    const result: ApiResponse<TimeEntry[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get user entries');
    }

    return result.data;
  }

  async getCompanyEntries(filters?: TimeEntryFilters): Promise<TimeEntry[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await fetch(
      `${API_URL}/time-entries/company?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );

    const result: ApiResponse<TimeEntry[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get company entries');
    }

    return result.data;
  }

  async approveEntry(timeEntryId: number): Promise<TimeEntry> {
    const response = await fetch(
      `${API_URL}/time-entries/${timeEntryId}/approve`,
      {
        method: 'POST',
        headers: this.getAuthHeader(),
      }
    );

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to approve entry');
    }

    return result.data;
  }

  async rejectEntry(timeEntryId: number, notes?: string): Promise<TimeEntry> {
    const response = await fetch(
      `${API_URL}/time-entries/${timeEntryId}/reject`,
      {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ notes }),
      }
    );

    const result: ApiResponse<TimeEntry> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to reject entry');
    }

    return result.data;
  }
}

export const timeEntryService = new TimeEntryService();
