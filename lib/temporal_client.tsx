import { Connection, Client } from "@temporalio/client";

class TemporalClientSingleton {
  private static instance: TemporalClientSingleton;
  private client?: Client;

  private constructor() {
    if (!TemporalClientSingleton.instance) {
      TemporalClientSingleton.instance = this;
    }
    return TemporalClientSingleton.instance;
  }

  public static getInstance(): TemporalClientSingleton {
    if (!TemporalClientSingleton.instance) {
      TemporalClientSingleton.instance = new TemporalClientSingleton();
    }
    return TemporalClientSingleton.instance;
  }

  public async initialize(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    try {
      const connection = await Connection.connect({
        address: process.env.TEMPORAL_ADDRESS,
      });

      this.client = new Client({ connection });
      return this.client;
    } catch (error) {
      console.error("Error initializing Temporal client:", error);
      throw new Error("Failed to connect to Temporal server.");
    }
  }
}

export const initialize = (): Promise<Client> => 
  TemporalClientSingleton.getInstance().initialize();