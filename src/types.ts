export interface Placement {
  name: string;
  key: string;
  symbol: string;
  house: number;
  degree: string;
  sign: string;
  nakshatra: string;
  pada: number;
}

export interface KundliChart {
  lagnaSign: string;
  moonNakshatra: string;
  moonSign: string;
  sunSign: string;
  placements: Placement[];
}

export interface KundliResponse {
  success: boolean;
  chart: KundliChart;
  interpretation: string;
  error?: string;
}

export interface HoroscopeResponse {
  sign: string;
  category: string;
  prediction: string;
  source: string;
  error?: string;
}

export interface MatchmakingResponse {
  kootaPoints: number;
  maxPoints: number;
  percentage: number;
  guidance: string;
  elements: {
    partner1Element: string;
    partner2Element: string;
  };
  error?: string;
}
