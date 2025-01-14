export interface Watch {
    id: string;
    brand: string;
    model: string;
    price: number;
    image?: string;
    year?: string;
    condition?: string;
  }
  
  export interface TradeRequest {
    id: string;
    watchOffered: Watch;
    watchWanted: Watch;
    status: 'pending' | 'accepted' | 'rejected';
    date: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    models: number;
    image?: string;
  }