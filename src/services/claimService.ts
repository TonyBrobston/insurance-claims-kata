import { Claim, Policy, ClaimEvaluation, IncidentType } from '../types';
import { incidentTypes } from '../constants';

const determinePayout = (
  approved: boolean,
  amountClaimed: number,
  deductible: number,
  coverageLimit: number,
) => {
  if (approved) {
    const payout = amountClaimed - deductible;
    if (payout < 0) {
      return 0;
    }
    if (payout > coverageLimit) {
      return coverageLimit;
    }
    return payout
  }
  return 0;
}

export const determineReasonCode = (
  payout: number,
  isValidIncidentDate: boolean,
  isValidIncidentType: boolean,
  approved: boolean
) => {
  if (approved && payout <= 0) {
    return 'ZERO_PAYOUT';
  }
  if (!isValidIncidentDate) {
    return 'POLICY_INACTIVE'
  }
  if (!isValidIncidentType) {
    return 'NOT_COVERED';
  }

  return 'APPROVED';
}

export const processClaim = (claim: Claim, policy: Policy): ClaimEvaluation => {
  const { incidentDate, amountClaimed, incidentType } = claim;
  const { startDate, endDate, deductible, coverageLimit } = policy;
  const isValidIncidentDate = startDate <= incidentDate && incidentDate <= endDate;
  const isValidIncidentType = incidentTypes.includes(incidentType as IncidentType);
  const approved = isValidIncidentDate && isValidIncidentType;
  const payout = determinePayout(approved, amountClaimed, deductible, coverageLimit);
  const reasonCode = determineReasonCode(payout, isValidIncidentDate, isValidIncidentType, approved);
  return {
    approved,
    payout,
    reasonCode,
  };
};
