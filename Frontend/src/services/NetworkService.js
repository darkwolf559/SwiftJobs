import NetInfo from '@react-native-community/netinfo';

class NetworkService {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
    
    this.unsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      
      if (wasConnected !== this.isConnected) {
        this.notifyListeners(this.isConnected);
      }
    });
  }
  
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  notifyListeners(isConnected) {
    this.listeners.forEach(listener => listener(isConnected));
  }
  
  async checkConnection() {
    const networkState = await NetInfo.fetch();
    this.isConnected = networkState.isConnected;
    return this.isConnected;
  }
  
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default new NetworkService();