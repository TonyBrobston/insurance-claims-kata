import { processClaim, determineReasonCode } from '../../src/services/processor';
import { Policy } from '../../src/types';

describe('processor', () => {
  const baseClaim = {
    policyId: 'POL123',
    incidentType: 'fire',
    incidentDate: new Date('2023-02-01'),
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

  it.each([
    {
      name: 'should be an active policy when incident date is equal to start date',
      claim: {
        ...baseClaim,
        incidentDate: new Date('2023-01-01'),
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 2500,
        reasonCode: 'APPROVED',
      }
    },
    {
      name: 'should be an active policy when incident date is equal to end date',
      claim: {
        ...baseClaim,
        incidentDate: new Date('2024-01-01'),
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 2500,
        reasonCode: 'APPROVED',
      }
    },
    {
      name: 'should be an active policy when incident date is between start and end date',
      claim: {
        ...baseClaim,
        incidentDate: new Date('2023-01-02'),
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 2500,
        reasonCode: 'APPROVED',
      }
    },
    {
      name: 'should not be an active policy when incident date is before start date',
      claim: {
        ...baseClaim,
        incidentDate: new Date('2022-12-31'),
      },
      expectedClaimEvaluation: {
        approved: false,
        payout: 0,
        reasonCode: 'POLICY_INACTIVE',
      }
    },
    {
      name: 'should not be an active policy when incident date is after end date',
      claim: {
        ...baseClaim,
        incidentDate: new Date('2024-01-02'),
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
    },
    {
      name: 'should return ZERO_PAYOUT when payout is zero',
      claim: {
        ...baseClaim,
        amountClaimed: 500,
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 0,
        reasonCode: 'ZERO_PAYOUT',
      }
    },
    {
      name: 'should return ZERO_PAYOUT when payout is negative',
      claim: {
        ...baseClaim,
        amountClaimed: 400,
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 0,
        reasonCode: 'ZERO_PAYOUT',
      }
    },
    {
      name: 'should not exceed coverage limit',
      claim: {
        ...baseClaim,
        amountClaimed: 10501,
      },
      expectedClaimEvaluation: {
        approved: true,
        payout: 10000,
        reasonCode: 'APPROVED',
      }
    },
  ])('$name', ({ claim, expectedClaimEvaluation }) => {
    const claimEvaluation = processClaim(claim, policy);

    expect(claimEvaluation).toEqual(expectedClaimEvaluation);
  });

  it('should throw an error if an impossible state is reached', () => {
    const callWithImpossibleState = () => {
      determineReasonCode(0, true, true, false);
    };

    expect(callWithImpossibleState).toThrow('Unhandled claim evaluation state');
  });
});
