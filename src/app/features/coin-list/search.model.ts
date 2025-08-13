export interface SearchCoin {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

export interface SearchResponse {
  coins: SearchCoin[];
  exchanges: any[];
  icos: any[];
  categories: any[];
  nfts: any[];
}
