import FLOW_NODE_TYPE from './FLOW_NODE_TYPE_ENUM'
import FLOW_NODE_MODEL from './FLOW_NODE_TYPE_MODEL'

/**
 * @readonly
 * @enum
 */
export default [
  {
    type: FLOW_NODE_TYPE.APPROVER_NODE,
    name: FLOW_NODE_MODEL[FLOW_NODE_TYPE.APPROVER_NODE].title,
    icon: FLOW_NODE_MODEL[FLOW_NODE_TYPE.APPROVER_NODE].titleIcon,
    styles: {
      color:
        FLOW_NODE_MODEL[FLOW_NODE_TYPE.APPROVER_NODE].customTitleStyle
          .backgroundColor,
    },
  },
  {
    type: FLOW_NODE_TYPE.CONDITION_BRANCH,
    name: FLOW_NODE_MODEL[FLOW_NODE_TYPE.CONDITION_BRANCH].title,
    icon: FLOW_NODE_MODEL[FLOW_NODE_TYPE.CONDITION_BRANCH].titleIcon,
    styles: {
      color:
        FLOW_NODE_MODEL[FLOW_NODE_TYPE.CONDITION_NODE].customTitleStyle.color,
    },
  },
  {
    type: FLOW_NODE_TYPE.PARALLEL_BRANCH,
    name: FLOW_NODE_MODEL[FLOW_NODE_TYPE.PARALLEL_BRANCH].title,
    icon: FLOW_NODE_MODEL[FLOW_NODE_TYPE.PARALLEL_BRANCH].titleIcon,
    styles: {
      color:
        FLOW_NODE_MODEL[FLOW_NODE_TYPE.PARALLEL_NODE].customTitleStyle.color,
    },
  },
  {
    type: FLOW_NODE_TYPE.NOTIFIER_NODE,
    name: FLOW_NODE_MODEL[FLOW_NODE_TYPE.NOTIFIER_NODE].title,
    icon: FLOW_NODE_MODEL[FLOW_NODE_TYPE.NOTIFIER_NODE].titleIcon,
    styles: {
      color:
        FLOW_NODE_MODEL[FLOW_NODE_TYPE.NOTIFIER_NODE].customTitleStyle
          .backgroundColor,
    },
  },
]
