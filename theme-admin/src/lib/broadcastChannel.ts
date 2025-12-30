/**
 * BroadcastChannel utility for admin-client communication
 * Allows real-time updates without page refresh
 */

export type AdminMessageType =
  | "setProps"
  | "setCssVars"
  | "setTokens"
  | "setWcDev"
  | "componentSelected"
  | "refreshComponent";

export interface AdminMessage {
  type: AdminMessageType;
  payload?: any;
  timestamp?: number;
}

const CHANNEL_NAME = "cti-admin-client-sync";

class AdminBroadcastChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<AdminMessageType, Set<(data: any) => void>> = new Map();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<AdminMessage>) => {
        const { type, payload } = event.data;
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
          typeListeners.forEach((listener) => listener(payload));
        }
        // Also call wildcard listeners
        const wildcardListeners = this.listeners.get("*" as AdminMessageType);
        if (wildcardListeners) {
          wildcardListeners.forEach((listener) => listener({ type, payload }));
        }
      };
    }
  }

  /**
   * Send a message to all clients (including iframes)
   */
  postMessage(type: AdminMessageType, payload?: any): void {
    if (!this.channel) {
      console.warn("BroadcastChannel not supported, falling back to postMessage");
      return;
    }

    const message: AdminMessage = {
      type,
      payload,
      timestamp: Date.now(),
    };

    this.channel.postMessage(message);
  }

  /**
   * Listen for specific message types
   */
  onMessage(
    type: AdminMessageType | "*",
    callback: (data: any) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
        if (typeListeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  /**
   * Close the channel
   */
  close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
let adminChannelInstance: AdminBroadcastChannel | null = null;

export function getAdminBroadcastChannel(): AdminBroadcastChannel {
  if (!adminChannelInstance) {
    adminChannelInstance = new AdminBroadcastChannel();
  }
  return adminChannelInstance;
}

/**
 * React hook for using BroadcastChannel in admin
 */
export function useAdminBroadcast() {
  const channel = getAdminBroadcastChannel();

  const sendMessage = (type: AdminMessageType, payload?: any) => {
    channel.postMessage(type, payload);
  };

  const subscribe = (
    type: AdminMessageType | "*",
    callback: (data: any) => void
  ) => {
    return channel.onMessage(type, callback);
  };

  return { sendMessage, subscribe, channel };
}

