import { processClaim } from '../../src/services/processor';
import { Policy } from '../../src/types';

describe('processor', () => {
  const baseClaim = {
    policyId: 'POL123',
    incidentType: 'fire',
    incidentDate: new Date('2023-02-01'),
    amountClaimed: 3000,
  };
  const activePolicyDate = new Date('2023-01-02');
  const inactivePolicyDate = new Date('2022-01-02');
  const policy = {
    policyId: 'POL123',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: ['accident', 'fire'],
  } as Policy;

  it.each([
    {
      name: 'should be an active policy on the incident date',
      claim: {
        ...baseClaim,
        incidentDate: activePolicyDate,
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 2500,
        reasonCode: 'APPROVED',
      }
    },
    {
      name: 'should not be an active policy on the incident date',
      claim: {
        ...baseClaim,
        incidentDate: inactivePolicyDate,
      },
      expectedClaimEvaluation: {
        approved: false,
        payout: 0,
        reasonCode: 'POLICY_INACTIVE',
      }
    },
    {
      name: 'should not allow incident types that are not in covered incidents',
      claim: {
        ...baseClaim,
        incidentType: 'tornado'
      },
      expectedClaimEvaluation: {
        approved: false,
        payout: 0,
        reasonCode: 'NOT_COVERED',
      }
    }
  ])('$name', ({ claim, expectedClaimEvaluation }) => {
    const claimEvaluation = processClaim(claim, policy);

    expect(claimEvaluation).toEqual(expectedClaimEvaluation);
  });
});
