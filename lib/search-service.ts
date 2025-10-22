import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface SearchResult {
  id: number | string;
  type: 'user' | 'time_entry' | 'approval' | 'vacation' | 'reminder' | 'audit';
  title: string;
  description: string;
  metadata?: Record<string, string | number | boolean | null>;
  url: string;
  icon?: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: { name: string };
}

interface TimeEntryResponse {
  id: number;
  hours: number;
  date: string;
  description?: string;
  status: string;
  user?: { name: string };
}

interface AuditLogResponse {
  id: number;
  description: string;
  action: string;
  entity_type: string;
  created_at: string;
  user?: { name: string };
}

export interface SearchResponse {
  users: SearchResult[];
  time_entries: SearchResult[];
  approvals: SearchResult[];
  vacations: SearchResult[];
  reminders: SearchResult[];
  audit_logs: SearchResult[];
  total: number;
}

class SearchService {
  async globalSearch(query: string): Promise<SearchResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<SearchResult[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        params: { search: query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data.map((user: UserResponse) => ({
        id: user.id,
        type: 'user' as const,
        title: user.name,
        description: `${user.email} - ${user.role}`,
        metadata: { role: user.role, company: user.company?.name },
        url: `/employees`,
        icon: 'user',
      }));
    } catch (error) {
      console.error('User search error:', error);
      return [];
    }
  }

  async searchTimeEntries(query: string): Promise<SearchResult[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/time-entries`, {
        params: { search: query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data.data?.slice(0, 5).map((entry: TimeEntryResponse) => ({
        id: entry.id,
        type: 'time_entry' as const,
        title: `${entry.hours} horas - ${entry.user?.name || 'Usuario'}`,
        description: `${entry.date} - ${entry.description || 'Sin descripción'}`,
        metadata: { status: entry.status, hours: entry.hours },
        url: `/dashboard`,
        icon: 'clock',
      })) || [];
    } catch (error) {
      console.error('Time entries search error:', error);
      return [];
    }
  }

  async searchAuditLogs(query: string): Promise<SearchResult[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/audit`, {
        params: { search: query, per_page: 5 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data.data?.map((log: AuditLogResponse) => ({
        id: log.id,
        type: 'audit' as const,
        title: log.description,
        description: `${log.user?.name || 'Sistema'} - ${new Date(log.created_at).toLocaleString('es-ES')}`,
        metadata: { action: log.action, entity_type: log.entity_type },
        url: `/audit`,
        icon: 'shield',
      })) || [];
    } catch (error) {
      console.error('Audit search error:', error);
      return [];
    }
  }

  // Búsqueda local combinada (fallback si no hay endpoint global)
  async performLocalSearch(query: string): Promise<SearchResponse> {
    if (!query || query.length < 2) {
      return {
        users: [],
        time_entries: [],
        approvals: [],
        vacations: [],
        reminders: [],
        audit_logs: [],
        total: 0,
      };
    }

    try {
      const [users, timeEntries, auditLogs] = await Promise.all([
        this.searchUsers(query),
        this.searchTimeEntries(query),
        this.searchAuditLogs(query),
      ]);

      return {
        users,
        time_entries: timeEntries,
        approvals: [],
        vacations: [],
        reminders: [],
        audit_logs: auditLogs,
        total: users.length + timeEntries.length + auditLogs.length,
      };
    } catch (error) {
      console.error('Local search error:', error);
      return {
        users: [],
        time_entries: [],
        approvals: [],
        vacations: [],
        reminders: [],
        audit_logs: [],
        total: 0,
      };
    }
  }
}

export const searchService = new SearchService();
