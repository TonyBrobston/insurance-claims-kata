import { Claim, Policy, ClaimEvaluation } from '../../src/types';

export const processClaim = (claim: Claim, policy: Policy): ClaimEvaluation => {
  const { incidentDate, amountClaimed } = claim;
  const { startDate, endDate, deductible } = policy;
  const approved = startDate <= incidentDate && incidentDate <= endDate;
  const payout = approved ? amountClaimed - deductible : 0;
  const reasonCode = approved ? 'APPROVED' : 'POLICY_INACTIVE';
  return {
    approved,
    payout,
    reasonCode,
  };
};
