//1: get linkBuilderData
//2: check for finalstepConditions
//3: return action Type based on conditions

import { DeciderResult, EmailActions, FinalStepDeciderResult } from '../types/Form/ContractCancellationForm';
import { TerminationEntity, terminationStates } from '../types/TerminationEntity/TerminationEntity';

export const documentsNeededReasons = ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'];

export const autoFinalizationInsurers = ['slavia', 'allianz', 'kooperativa', 'gcp', 'cp'];

export const autoBackOfficeInsurers = ['uniqa'];

const finalPageDecider: Array<{
  id?: string;
  target: Array<'client' | 'agent'>;
  regime: 'client' | 'agent' | null;
  contractTerminationReason: {
    array: Array<string>;
    compare: 'includes' | 'excludes';
  } | null;
  insuranceCompany: {
    array: Array<string>;
    compare: 'includes' | 'excludes';
  } | null;
  result: DeciderResult;
  terminationState: terminationStates;
  emailActions: EmailActions;
}> = [
  {
    id: 'agent_filling',
    target: ['agent'],
    regime: 'agent',
    contractTerminationReason: null,
    insuranceCompany: null,
    result: 'autoFinalization',
    terminationState: 'sentForSignature',
    emailActions: [
      {
        emailAction: 'linkToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: 'no_documents_backoffice_termination',
    target: ['agent'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'excludes',
    },
    insuranceCompany: {
      array: autoBackOfficeInsurers,
      compare: 'includes',
    },
    result: 'autoFinalization',
    terminationState: 'clientSigned',
    emailActions: [
      {
        emailAction: 'terminateToBackoffice',
        emailTo: 'clientService',
      },
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.a',
    target: ['agent'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'excludes',
    },
    insuranceCompany: {
      array: autoFinalizationInsurers,
      compare: 'includes',
    },
    result: 'autoFinalization',
    terminationState: 'sentToInsurer',
    emailActions: [
      {
        emailAction: 'terminateToInsurer',
        emailTo: 'insurer',
      },
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.b.i',
    target: ['client'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'excludes',
    },
    insuranceCompany: null,
    result: 'userFinalization',
    terminationState: 'clientSelf',
    emailActions: [
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.b.ii',
    target: ['agent'],
    regime: null,
    contractTerminationReason: {
      //matched with 3.c.ii
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'excludes',
    },
    insuranceCompany: {
      array: [...autoFinalizationInsurers, ...autoBackOfficeInsurers],
      compare: 'excludes',
    },
    result: 'userFinalization',
    terminationState: 'clientSelf',
    emailActions: [
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.c.i',
    target: ['client'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'includes',
    },
    insuranceCompany: null,
    terminationState: 'clientSelf',
    result: 'documentsNeeded',
    emailActions: [
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.c.ii',
    target: ['agent'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'includes',
    },
    insuranceCompany: {
      array: [...autoFinalizationInsurers, ...autoBackOfficeInsurers],
      compare: 'excludes',
    },
    result: 'documentsNeeded',
    terminationState: 'clientSelf',
    emailActions: [
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
    ],
  },
  {
    id: '3.d.i',
    target: ['agent'],
    regime: null,
    contractTerminationReason: {
      array: ['disabledVehicle', 'changeOfOwnerCar', 'vehicleStolen'],
      compare: 'includes',
    },
    insuranceCompany: {
      array: [...autoFinalizationInsurers, ...autoBackOfficeInsurers],
      compare: 'includes',
    },
    result: 'documentsForAuto',
    terminationState: 'waitingDocuments',

    emailActions: [
      {
        emailAction: 'instructionsToClient',
        emailTo: 'client',
      },
      {
        emailAction: 'terminateToBackoffice',
        emailTo: 'clientService',
      },
    ],
  },
];

/**
 * Determines the final step in the contract cancellation process based on a set of predefined rules.
 *
 * This function iterates through the `finalPageDecider` rules array and evaluates each rule
 * against the provided `linkBuilderData`, `target`, and `regime`. It checks conditions such
 * as the target audience, contract termination reason, insurance company, and regime. The first
 * rule that matches all its conditions is used to return the result.
 * If no rules match, an error object is returned.
 *
 * @param linkBuilderData - The termination entity containing data used for rule evaluation,
 * including contract details and provider information.
 * @param target - Specifies whether the agent has been present on the creation of the form ('agent')
 * or if the client is filling it out alone ('client').
 * @param regime - Specifies the intended audience for the final step,
 * either 'client' or 'agent' - eg.: "agent" means an agent is currently filling the form.
 * @returns An object containing the result, termination state, and email actions if a rule matches,
 * or an error message if no rules apply.
 */
export const finalStepDecider = (
  linkBuilderData: TerminationEntity,
  target: 'client' | 'agent',
  regime: 'client' | 'agent',
): FinalStepDeciderResult => {
  for (const rule of finalPageDecider) {
    if (rule.target && !rule.target.includes(target)) {
      continue;
    }
    if (rule.contractTerminationReason) {
      const reason = linkBuilderData.data?.contractTerminationReason || null;
      if (rule.contractTerminationReason.compare === 'includes') {
        if (!reason || !rule.contractTerminationReason.array.includes(reason)) {
          continue;
        }
      } else if (rule.contractTerminationReason.compare === 'excludes') {
        if (reason && rule.contractTerminationReason.array.includes(reason)) {
          continue;
        }
      }
    }

    if (rule.insuranceCompany) {
      const companyKey = linkBuilderData.data?.provider?.contentKey || null;

      if (rule.insuranceCompany.compare === 'includes') {
        if (!companyKey || !rule.insuranceCompany.array.includes(companyKey)) {
          continue;
        }
      } else if (rule.insuranceCompany.compare === 'excludes') {
        if (companyKey && rule.insuranceCompany.array.includes(companyKey)) {
          continue;
        }
      }
    }

    if (rule.regime) {
      if (rule.regime !== regime) {
        continue;
      }
    }
    //all matched - return result
    return { result: rule.result, terminationState: rule.terminationState, emailActions: rule.emailActions };
  }
  return { error: 'Nothing matched in rules' };
};
