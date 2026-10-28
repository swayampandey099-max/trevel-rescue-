export type CurrencySymbol = '$' | '€' | '£' | '₹' | '¥';

export interface RouteLeg {
  mode: 'flight' | 'train' | 'bus' | 'shuttle';
  operator: string;
  codeOrNumber: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  baggageNotes?: string;
  statusNotice?: string;
}

export interface RescueOption {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'hybrid';
  title: string;
  subtitle: string;
  totalPrice: number;
  currency: string;
  totalDuration: string;
  departureTime: string;
  arrivalTime: string;
  transfersCount: number;
  reliabilityScore: number;
  stressScore: 'Low' | 'Moderate' | 'High';
  recommended: boolean;
  tagline: string;
  legs: RouteLeg[];
  stepByStepInstructions: string[];
  bookingAdvice: string;
}

export interface RescueResearchResult {
  origin: string;
  destination: string;
  targetDeadline: string;
  budgetCap: number;
  currency: string;
  emergencyType: string;
  humanRescueSummary: string;
  options: RescueOption[];
}

export interface RescueRequestParams {
  origin: string;
  destination: string;
  budget: number;
  currency: CurrencySymbol;
  targetTime: string;
  travelPriority: string;
  emergencyType: string;
  customNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickOptions?: string[];
}
