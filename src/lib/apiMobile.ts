import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiServiceMobile {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = null;
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();
    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('HTTP error response:', response.status, text);
        
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${text}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error(`Server returned HTML instead of JSON. This usually means the server is not running or there's a connection issue. Status: ${response.status}`);
        }
        
        throw new Error(`Server error: ${response.status} - Expected JSON but received ${contentType || 'unknown content type'}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        const text = await response.text();
        console.error('Response text that failed to parse:', text);
        throw new Error('Invalid JSON response from server - check if server is running');
      }

      return data;
    } catch (error) {
      console.error('API request error for endpoint:', endpoint, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request<{ message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    await AsyncStorage.setItem('token', response.token);

    return {
      success: true,
      data: response.user,
    };
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{ message: string; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    this.token = response.token;
    await AsyncStorage.setItem('token', response.token);

    return {
      success: true,
      data: response.user,
    };
  }

  async getCurrentUser() {
    return await this.request<any>('/auth/me');
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Workout methods
  async getWorkouts() {
    return await this.request<any[]>('/workouts');
  }

  async saveWorkout(session: any[]) {
    return await this.request<any>('/workouts', {
      method: 'POST',
      body: JSON.stringify({ session }),
    });
  }

  async saveFormCheck(formData: FormData) {
    return await this.request<any>('/form-check', {
      method: 'POST',
      body: formData,
    });
  }

  async getFormChecks() {
    return await this.request<any[]>('/form-check');
  }

  async deleteFormCheck(id: string) {
    return await this.request<any>(`/form-check/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAllFormChecks() {
    return await this.request<any>('/form-check', {
      method: 'DELETE',
    });
  }

  async getWorkoutPlan() {
    return await this.request<any>('/workout-plan');
  }

  async saveWorkoutPlan(plan: any) {
    return await this.request<any>('/workout-plan', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async deleteWorkoutPlan() {
    return await this.request<any>('/workout-plan', {
      method: 'DELETE',
    });
  }

  async getRecommendation() {
    return await this.request<any>('/recommendation');
  }

  async getCurrentWorkout() {
    return await this.request<any>('/current-workout');
  }

  async saveCurrentWorkout(session: any[]) {
    return await this.request<any>('/current-workout', {
      method: 'POST',
      body: JSON.stringify({ session }),
    });
  }

  async clearCurrentWorkout() {
    return await this.request<any>('/current-workout', {
      method: 'DELETE',
    });
  }

  // User preferences
  async getUserPreferences() {
    return await this.request<any>('/user/preferences');
  }

  async saveUserPreference(key: string, value: any) {
    return await this.request<any>('/user/preferences', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  async getUserPreference(key: string) {
    return await this.request<any>(`/user/preferences/${key}`);
  }

  // Bluetooth device methods
  async getBluetoothDevices(): Promise<any[]> {
    return await this.request<any[]>('/bluetooth/devices');
  }

  async pairBluetoothDevice(deviceData: {
    deviceId: string;
    deviceName: string;
    deviceType?: string;
    brand: string;
    model: string;
    macAddress?: string;
    firmwareVersion?: string;
  }): Promise<any> {
    return await this.request<any>('/bluetooth/pair', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDeviceStatus(deviceId: string, status: {
    isConnected: boolean;
    batteryLevel?: number;
    signalStrength?: number;
  }): Promise<any> {
    return await this.request<any>(`/bluetooth/devices/${deviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  async unpairDevice(deviceId: string): Promise<any> {
    return await this.request<any>(`/bluetooth/devices/${deviceId}`, {
      method: 'DELETE',
    });
  }

  async syncDeviceData(deviceId: string, healthData: any[], syncType: 'full' | 'incremental' = 'incremental'): Promise<any> {
    return await this.request<any>('/bluetooth/sync', {
      method: 'POST',
      body: JSON.stringify({ deviceId, healthData, syncType }),
    });
  }

  async getDeviceHealthData(deviceId: string, startDate?: string, endDate?: string, limit?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (limit) params.append('limit', limit.toString());
    
    return await this.request<any[]>(`/bluetooth/devices/${deviceId}/health-data?${params}`);
  }

  async getDeviceSyncHistory(deviceId: string, limit?: number): Promise<any[]> {
    const params = limit ? `?limit=${limit}` : '';
    return await this.request<any[]>(`/bluetooth/devices/${deviceId}/sync-history${params}`);
  }

  async getAllSyncSessions(limit?: number): Promise<any[]> {
    const params = limit ? `?limit=${limit}` : '';
    return await this.request<any[]>(`/bluetooth/sync-sessions${params}`);
  }

  // User settings
  async getUserSettings(): Promise<any> {
    return await this.request<any>('/user/settings');
  }

  async saveUserSettings(settings: any): Promise<any> {
    return await this.request<any>('/user/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async exportUserData(format: string): Promise<any> {
    return await this.request<any>(`/user/export?format=${format}`);
  }
}

export const apiService = new ApiServiceMobile(); 