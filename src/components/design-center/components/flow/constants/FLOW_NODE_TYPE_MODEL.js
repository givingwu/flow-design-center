import FLOW_NODE_TYPE from './FLOW_NODE_TYPE_ENUM'

/**
 * @readonly
 * @enum
 */
export default {
  [FLOW_NODE_TYPE.SPONSOR_NODE]: {
    title: '发起人',
    content: '所有人',
    // titleIcon: 'el-icon-user-solid',
    contentIcon: 'el-icon-arrow-right',
    customTitleStyle: {
      backgroundColor: '#2172C8',
    },
  },
  [FLOW_NODE_TYPE.APPROVER_NODE]: {
    title: '审批人',
    content: '',
    placeholder: '请选择审批人',
    titleIcon: 'el-icon-s-check',
    contentIcon: 'el-icon-arrow-right',
    customTitleStyle: {
      backgroundColor: '#F49150',
    },
    errorState: false
  },

  [FLOW_NODE_TYPE.CONDITION_BRANCH]: {
    title: '条件分支',
    btnText: '添加条件',
    titleIcon: 'el-icon-s-grid',
  },
  [FLOW_NODE_TYPE.CONDITION_NODE]: {
    title: '条件节点',
    desc: '优先级',
    placeholder: '请设置条件',
    customTitleStyle: {
      color: '#67C23A',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    errorState: false
  },
  [FLOW_NODE_TYPE.CONDITION_BRANCH_END]: {
    title: '条件结束'
  },

  [FLOW_NODE_TYPE.PARALLEL_BRANCH]: {
    title: '并行分支',
    btnText: '添加并行分支',
    titleIcon: 'el-icon-plus',
  },
  [FLOW_NODE_TYPE.PARALLEL_NODE]: {
    title: '并行分支',
    content: '',
    // desc: '',
    // content: '请设置条件',
    customTitleStyle: {
      color: '#F49150',
      fontSize: '13px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  [FLOW_NODE_TYPE.PARALLEL_BRANCH_END]: {
    title: '并行结束',
  },

  [FLOW_NODE_TYPE.NOTIFIER_NODE]: {
    title: '抄送人',
    content: '',
    placeholder: '请选择抄送人',
    titleIcon: 'el-icon-message-solid',
    contentIcon: 'el-icon-arrow-right',
    customTitleStyle: {
      backgroundColor: '#5AAAFF',
    },
    errorState: false
  },

  [FLOW_NODE_TYPE.END_NODE]: {
    content: '流程结束',
  },
}
