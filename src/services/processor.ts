import { Claim, Policy, ClaimEvaluation, IncidentType } from '../../src/types';
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
    } else if (payout > coverageLimit) {
      return coverageLimit;
    }
    return payout
  }
  return 0;
}

const determineReasonCode = (
  payout: number,
  isValidIncidentDate: boolean,
  isValidIncidentType: boolean,
  approved: boolean
) => {
  if (approved) {
    if (payout === 0 || payout < 0) {
      return 'ZERO_PAYOUT';
    }
    return 'APPROVED';
  }
  if (!isValidIncidentDate) {
    return 'POLICY_INACTIVE'
  }
  if (!isValidIncidentType) {
    return 'NOT_COVERED';
  }
  return 'NOT_COVERED';
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
