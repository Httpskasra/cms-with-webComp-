/**
 * BroadcastChannel utility for client to receive admin updates
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

class ClientBroadcastChannel {
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
   * Listen for specific message types from admin
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
let clientChannelInstance: ClientBroadcastChannel | null = null;

export function getClientBroadcastChannel(): ClientBroadcastChannel {
  if (!clientChannelInstance) {
    clientChannelInstance = new ClientBroadcastChannel();
  }
  return clientChannelInstance;
}

/**
 * React hook for using BroadcastChannel in client
 */
export function useClientBroadcast() {
  const channel = getClientBroadcastChannel();

  const subscribe = (
    type: AdminMessageType | "*",
    callback: (data: any) => void
  ) => {
    return channel.onMessage(type, callback);
  };

  return { subscribe, channel };
}

