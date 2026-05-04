import { incidentTypes } from "./constants";

export interface Claim {
  policyId: string;
  incidentType: string;
  incidentDate: Date;
  amountClaimed: number;
}

export interface ClaimEvaluation {
  approved: boolean;
  payout: number;
  reasonCode: 'APPROVED' | 'POLICY_INACTIVE' | 'NOT_COVERED' | 'ZERO_PAYOUT';
}

export type IncidentType = typeof incidentTypes[number];

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}
