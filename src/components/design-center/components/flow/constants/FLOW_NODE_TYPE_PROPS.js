import FLOW_NODE_TYPE from './FLOW_NODE_TYPE_ENUM'
import {AUDIT_TYPES, NO_AUDIT_TYPES, PARTICIPANT_TYPES, TRANSFER_TYPE,} from '../../../constants/ENUM_DEFINITIONS'

/**
 * @readonly
 * @enum
 */
export default {
  [FLOW_NODE_TYPE.SPONSOR_NODE]: {
    formFieldList: [],
  },
  [FLOW_NODE_TYPE.APPROVER_NODE]: {
    opinionSetting: {
      textOpinionName: '文本意见',
      textOpinionEnabled: false,
      textOpinionRequired: false,
      textOpinionTip: '',
      writeSignatureName: '手写签名',
      writeSignatureEnabled: false,
      writeSignatureRequired: false,
      writeSignatureCanUseLast: false,
    },
    taskRule: AUDIT_TYPES.COUNTERSIGN,
    canTransfer: false,
    transfer: {
      type: TRANSFER_TYPE,
      list: [],
    },
    canRollback: false,
    participantEmptyRule: NO_AUDIT_TYPES.AUTO_COMPLETE,
    initiatorAutoComplete: true,
    participant: {
      type: PARTICIPANT_TYPES.POSITION_LABEL,
      list: [],
      formFieldKey: '', // for form field
    },
    formFieldList: [],
  },
  [FLOW_NODE_TYPE.NOTIFIER_NODE]: {
    participant: {
      type: PARTICIPANT_TYPES.POSITION_LABEL,
      list: [],
      formFieldKey: '', // for form field
    },
    formFieldList: [],
  },
}
