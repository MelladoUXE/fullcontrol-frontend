import type {
  Vacation,
  VacationBalance,
  VacationStatistics,
  VacationCalendar,
  VacationFilters,
  CreateVacationRequest,
  ApproveVacationRequest,
  RejectVacationRequest,
} from '@/types/vacation';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = '/vacations';

const getHeaders = (includeAuth = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const vacationService = {
  /**
   * Get all vacation requests with filters
   */
  async getVacations(filters?: VacationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}${BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get pending approvals (managers/admins only)
   */
  async getPendingApprovals(perPage = 20) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/pending-approvals?per_page=${perPage}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get a specific vacation request
   */
  async getVacation(id: number) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Create a vacation request
   */
  async createVacation(data: CreateVacationRequest) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.data;
  },

  /**
   * Approve a vacation request
   */
  async approveVacation(id: number, data?: ApproveVacationRequest) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data || {}),
    });

    const result = await response.json();
    return result.data;
  },

  /**
   * Reject a vacation request
   */
  async rejectVacation(id: number, data: RejectVacationRequest) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.data;
  },

  /**
   * Cancel a vacation request
   */
  async cancelVacation(id: number) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
    });

    const result = await response.json();
    return result.data;
  },

  /**
   * Get vacation balance
   */
  async getBalance(userId?: number) {
    const url = userId 
      ? `${API_BASE_URL}${BASE_URL}/balance?user_id=${userId}`
      : `${API_BASE_URL}${BASE_URL}/balance`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get company statistics
   */
  async getStatistics(year?: number) {
    const url = year
      ? `${API_BASE_URL}${BASE_URL}/statistics?year=${year}`
      : `${API_BASE_URL}${BASE_URL}/statistics`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get vacation calendar
   */
  async getCalendar(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const url = `${API_BASE_URL}${BASE_URL}/calendar${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get upcoming vacations
   */
  async getUpcoming(days = 30) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/upcoming?days=${days}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },

  /**
   * Get current vacations (who's on vacation today)
   */
  async getCurrent() {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/current`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return data.data;
  },
};
