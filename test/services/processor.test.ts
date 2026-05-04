import { processClaim } from '../../src/services/processor';
import { Policy } from '../../src/types';

describe('processor', () => {
  const baseClaim = {
    policyId: 'POL123',
    incidentType: 'fire',
    amountClaimed: 3000,
  };
  const policy = {
    policyId: 'POL123',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: ['accident', 'fire'],
  } as Policy;

  it('should be an active policy on the incident date', () => {
    const activePolicyDate = new Date('2023-01-02');
    const claim = {
      incidentDate: activePolicyDate,
      ...baseClaim,
    };

    const claimEvaluation = processClaim(claim, policy);

    expect(claimEvaluation).toEqual({
      approved: true,
      payout: 2500,
      reasonCode: 'APPROVED',
    });
  });

  it('should not be an active policy on the incident date', () => {
    const inactivePolicyDate = new Date('2022-01-02');
    const claim = {
      incidentDate: inactivePolicyDate,
      ...baseClaim,
    }

    const claimEvaluation = processClaim(claim, policy);

    expect(claimEvaluation).toEqual({
      approved: false,
      payout: 0,
      reasonCode: 'POLICY_INACTIVE',
    });
  });
});
