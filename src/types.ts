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

type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

