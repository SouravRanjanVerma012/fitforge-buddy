import { Platform } from './platform';
import { getBaseURL, findWorkingConnection } from './networkConfig';

// Universal storage interface
interface UniversalStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

// Web storage implementation
class WebStorage implements UniversalStorage {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async getAllKeys(): Promise<string[]> {
    return Object.keys(localStorage);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

// Enhanced mobile storage with offline support
class MobileStorage implements UniversalStorage {
  private storage: Map<string, string> = new Map();
  private offlineQueue: Array<{id: string, action: string, data: any, timestamp: number}> = [];

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  // Offline queue management
  addToOfflineQueue(action: string, data: any): void {
    const queueItem = {
      id: `${action}_${Date.now()}`,
      action,
      data,
      timestamp: Date.now()
    };
    this.offlineQueue.push(queueItem);
    this.persistOfflineQueue();
  }

  async getOfflineQueue(): Promise<Array<{id: string, action: string, data: any, timestamp: number}>> {
    return this.offlineQueue;
  }

  async clearOfflineQueue(): Promise<void> {
    this.offlineQueue = [];
    this.persistOfflineQueue();
  }

  private persistOfflineQueue(): void {
    this.storage.set('offlineQueue', JSON.stringify(this.offlineQueue));
  }

  private loadOfflineQueue(): void {
    const queueData = this.storage.get('offlineQueue');
    if (queueData) {
      try {
        this.offlineQueue = JSON.parse(queueData);
      } catch (error) {
        console.error('Error loading offline queue:', error);
        this.offlineQueue = [];
      }
    }
  }
}

// Real-time sync manager
class RealTimeSyncManager {
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: number = 0;
  private isOnline: boolean = true;

  constructor(private apiService: ApiServiceUniversal) {
    this.setupNetworkListener();
  }

  private setupNetworkListener(): void {
    if (Platform.OS === 'web') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    } else {
      // For React Native, we'll use a simple polling mechanism
      this.startSyncPolling();
    }
  }

  private handleOnline(): void {
    this.isOnline = true;
    this.syncOfflineData();
  }

  private handleOffline(): void {
    this.isOnline = false;
  }

  private startSyncPolling(): void {
    // Poll every 30 seconds for mobile
    this.syncInterval = setInterval(() => {
      this.checkAndSync();
    }, 30000);
  }

  private async checkAndSync(): Promise<void> {
    try {
      // Simple network check
      const response = await fetch('https://www.google.com', { method: 'HEAD' });
      this.isOnline = response.ok;
      
      if (this.isOnline) {
        await this.syncOfflineData();
      }
    } catch (error) {
      this.isOnline = false;
    }
  }

  private async syncOfflineData(): Promise<void> {
    if (Platform.OS !== 'web') {
      const mobileStorage = this.apiService.storage as MobileStorage;
      const offlineQueue = await mobileStorage.getOfflineQueue();
      
      for (const item of offlineQueue) {
        try {
          await this.processOfflineAction(item);
        } catch (error) {
          console.error(`Failed to sync offline action ${item.id}:`, error);
        }
      }
      
      await mobileStorage.clearOfflineQueue();
    }
  }

  private async processOfflineAction(item: {id: string, action: string, data: any}): Promise<void> {
    switch (item.action) {
      case 'saveWorkout':
        await this.apiService.saveWorkout(item.data);
        break;
      case 'saveUserSettings':
        await this.apiService.saveUserSettings(item.data);
        break;
      // Add more offline actions as needed
    }
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Universal API Service
class ApiServiceUniversal {
  public baseURL: string;
  private token: string | null;
  public storage: UniversalStorage;
  private syncManager: RealTimeSyncManager;
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 3;

  constructor() {
    // Use the network configuration to get the appropriate base URL
    this.baseURL = getBaseURL();
    
    // Try to find a working connection if the default fails
    this.initializeConnection();
    this.token = null;
    
    // Choose storage based on platform
    if (Platform.OS === 'web') {
      this.storage = new WebStorage();
    } else {
      this.storage = new MobileStorage();
    }
    
    this.syncManager = new RealTimeSyncManager(this);
    this.loadToken();
  }

  private async initializeConnection() {
    // Test the current connection and try to find a working one if needed
    try {
      const testResponse = await fetch(`${this.baseURL}/health`);
      if (!testResponse.ok) {
        console.log('⚠️ Default connection failed, trying to find working connection...');
        const workingURL = await findWorkingConnection();
        if (workingURL) {
          this.baseURL = workingURL;
          console.log(`✅ Updated base URL to: ${this.baseURL}`);
        }
      } else {
        console.log(`✅ Default connection working: ${this.baseURL}`);
      }
    } catch (error) {
      console.log('⚠️ Default connection failed, trying to find working connection...');
      const workingURL = await findWorkingConnection();
      if (workingURL) {
        this.baseURL = workingURL;
        console.log(`✅ Updated base URL to: ${this.baseURL}`);
      }
    }
  }

  private async loadToken() {
    try {
      this.token = await this.storage.getItem('token');
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

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    console.log(`📋 Headers:`, headers);
    if (options.body) {
      console.log(`📦 Body:`, options.body);
    }

    const retryKey = `${options.method || 'GET'}_${endpoint}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP error response: ${response.status} ${text}`);
        
        // Handle specific error cases
        if (response.status === 401) {
          // Token expired, clear it
          await this.storage.removeItem('token');
          this.token = null;
        }
        
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      // Reset retry attempts on success
      this.retryAttempts.delete(retryKey);
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ API request error for endpoint: ${endpoint}`, error);
      console.error(`🔗 URL attempted: ${url}`);
      console.error(`📱 Platform: ${Platform.OS}`);
      console.error(`🌐 Base URL: ${this.baseURL}`);
      
      // Implement retry logic for network errors
      if (currentRetries < this.maxRetries && this.isRetryableError(error)) {
        this.retryAttempts.set(retryKey, currentRetries + 1);
        
        // Exponential backoff
        const delay = Math.pow(2, currentRetries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.request<T>(endpoint, options);
      }
      
      // If offline, queue the request for later sync
      if (Platform.OS !== 'web' && this.isOfflineError(error)) {
        this.queueOfflineRequest(endpoint, options);
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Network errors that can be retried
    return error.message?.includes('Network request failed') ||
           error.message?.includes('fetch') ||
           error.message?.includes('timeout');
  }

  private isOfflineError(error: any): boolean {
    return error.message?.includes('Network request failed') ||
           error.message?.includes('fetch');
  }

  private queueOfflineRequest(endpoint: string, options: RequestInit): void {
    if (Platform.OS !== 'web') {
      const mobileStorage = this.storage as MobileStorage;
      const action = this.getActionFromEndpoint(endpoint, options.method);
      mobileStorage.addToOfflineQueue(action, { endpoint, options });
    }
  }

  private getActionFromEndpoint(endpoint: string, method?: string): string {
    if (endpoint.includes('/workouts') && method === 'POST') return 'saveWorkout';
    if (endpoint.includes('/settings') && method === 'PUT') return 'saveUserSettings';
    return 'generic';
  }

  // Enhanced authentication methods
  async login(email: string, password: string) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        this.token = response.token;
        await this.storage.setItem('token', response.token);
        await this.storage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.token) {
        this.token = response.token;
        await this.storage.setItem('token', response.token);
        await this.storage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      await this.storage.removeItem('token');
      await this.storage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Enhanced workout methods with offline support
  async getWorkouts() {
    try {
      return await this.request('/workouts');
    } catch (error) {
      console.error('Get workouts error:', error);
      // Return cached data if available
      const cached = await this.storage.getItem('cached_workouts');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async saveWorkout(session: any[]) {
    try {
      const response = await this.request('/workouts', {
        method: 'POST',
        body: JSON.stringify(session),
      });
      
      // Cache the updated workouts
      const workouts = await this.getWorkouts();
      await this.storage.setItem('cached_workouts', JSON.stringify(workouts));
      
      return response;
    } catch (error) {
      console.error('Save workout error:', error);
      throw error;
    }
  }

  // Enhanced user settings with offline support
  async getUserSettings(): Promise<any> {
    try {
      return await this.request('/user/settings');
    } catch (error) {
      console.error('Get user settings error:', error);
      // Return cached settings if available
      const cached = await this.storage.getItem('cached_settings');
      return cached ? JSON.parse(cached) : {};
    }
  }

  async saveUserSettings(settings: any): Promise<any> {
    try {
      const response = await this.request('/user/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      
      // Cache the updated settings
      await this.storage.setItem('cached_settings', JSON.stringify(settings));
      
      return response;
    } catch (error) {
      console.error('Save user settings error:', error);
      throw error;
    }
  }

  // New methods for enhanced functionality
  async getWorkoutAnalytics(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      return await this.request(`/workouts/analytics?${params.toString()}`);
    } catch (error) {
      console.error('Get workout analytics error:', error);
      throw error;
    }
  }

  async getMacroData(date?: string) {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      return await this.request(`/macros?${params.toString()}`);
    } catch (error) {
      console.error('Get macro data error:', error);
      throw error;
    }
  }

  async saveMacroData(macroData: any) {
    try {
      return await this.request('/macros', {
        method: 'POST',
        body: JSON.stringify(macroData),
      });
    } catch (error) {
      console.error('Save macro data error:', error);
      throw error;
    }
  }

  async getFriends() {
    try {
      return await this.request('/friends');
    } catch (error) {
      console.error('Get friends error:', error);
      throw error;
    }
  }

  async getFriendRequests() {
    try {
      return await this.request('/friends/requests');
    } catch (error) {
      console.error('Get friend requests error:', error);
      throw error;
    }
  }

  async sendFriendRequest(friendId: string) {
    try {
      return await this.request('/friends/request', {
        method: 'POST',
        body: JSON.stringify({ friendId }),
      });
    } catch (error) {
      console.error('Send friend request error:', error);
      throw error;
    }
  }

  async acceptFriendRequest(requestId: string) {
    try {
      return await this.request(`/friends/request/${requestId}/accept`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Accept friend request error:', error);
      throw error;
    }
  }

  async getChallenges() {
    try {
      return await this.request('/challenges');
    } catch (error) {
      console.error('Get challenges error:', error);
      throw error;
    }
  }

  async createChallenge(challengeData: any) {
    try {
      return await this.request('/challenges', {
        method: 'POST',
        body: JSON.stringify(challengeData),
      });
    } catch (error) {
      console.error('Create challenge error:', error);
      throw error;
    }
  }

  async joinChallenge(challengeId: string) {
    try {
      return await this.request(`/challenges/${challengeId}/join`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Join challenge error:', error);
      throw error;
    }
  }

  // Coach-specific methods
  async getCoachClients() {
    try {
      return await this.request('/coach/clients');
    } catch (error) {
      console.error('Get coach clients error:', error);
      throw error;
    }
  }

  async assignWorkoutToClient(clientId: string, workoutData: any) {
    try {
      return await this.request(`/coach/clients/${clientId}/workouts`, {
        method: 'POST',
        body: JSON.stringify(workoutData),
      });
    } catch (error) {
      console.error('Assign workout to client error:', error);
      throw error;
    }
  }

  // Admin-specific methods
  async getAdminUsers() {
    try {
      return await this.request('/admin/users');
    } catch (error) {
      console.error('Get admin users error:', error);
      throw error;
    }
  }

  async getAdminAnalytics() {
    try {
      return await this.request('/admin/analytics');
    } catch (error) {
      console.error('Get admin analytics error:', error);
      throw error;
    }
  }

  // Cleanup method
  destroy() {
    this.syncManager.stopSync();
  }
}

// Export singleton instance
export const apiService = new ApiServiceUniversal(); 