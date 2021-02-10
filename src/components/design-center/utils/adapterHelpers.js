import Node from '../components/flow/helpers/Node'
import NodeManager from '../components/flow/helpers/NodeManager'
import FlowGraph from '../components/flow/helpers/FlowGraph'
import {
  FLOW_NODE_TYPES as SERVER_NODE_TYPE,
  FORM_FIELDS_TYPES,
  PARTICIPANT_PICKER_KEYS,
  PARTICIPANT_TYPES,
  PARTICIPANT_TYPES_NAME,
  TRANSFER_TYPE
} from '../constants/ENUM_DEFINITIONS'
import {
  OPTIONAL_SCOPE_KEYS,
  OPTIONAL_SCOPE_ENUM
} from './../constants/OPTIONAL_PERSONAL'

export const createFlowGraph = () => new FlowGraph()

/**
 * 通过 node.prevId 获取正确的 sourceNode，并跳过条件节点
 * @param {Node} node
 * @param {FlowGraph} graph
 * @returns {Node|null}
 */
export const getSourceNode = (node, graph) => {
  if (node.prevId) {
    let prevNode =
      graph.getVertexByKey(node.prevId) || NodeManager.getNode(node.prevId)

    if (prevNode) {
      // 如果是条件分支子节点，其 source Node 是其最近的条件分支父节点
      if (prevNode.type === Node.TYPE.CONDITION_NODE) {
        return getSourceNode(prevNode, graph)
      } else {
        return prevNode
      }
    }
  }

  return null
}

/**
 * 判断 node.type 获取正确的 targetNode，并跳过条件节点
 * @param {Node} node
 * @param {FlowGraph} graph
 * @returns {Node|null}
 */
export const getTargetNode = (node, graph) => {
  // 如果是条件分支子节点，其 target Node 是其最近的条件分支父节点
  if (node.type === Node.TYPE.CONDITION_NODE) {
    return getSourceNode(node, graph)
  } else {
    return node
  }
}

/**
 * getServerType
 * @param {string} type
 * @returns {string}
 */
export const getServerType = (type) => {
  return (
    type &&
    {
      [Node.TYPE.SPONSOR_NODE]: SERVER_NODE_TYPE.START,
      [Node.TYPE.APPROVER_NODE]: SERVER_NODE_TYPE.AUDIT,
      [Node.TYPE.CONDITION_BRANCH]: SERVER_NODE_TYPE.START_EXCLUSIVE_GATEWAY,
      [Node.TYPE.CONDITION_BRANCH_END]: SERVER_NODE_TYPE.END_EXCLUSIVE_GATEWAY,
      [Node.TYPE.NOTIFIER_NODE]: SERVER_NODE_TYPE.CC,
      [Node.TYPE.END_NODE]: SERVER_NODE_TYPE.END,
      [Node.TYPE.PARALLEL_BRANCH]: SERVER_NODE_TYPE.START_PARALLEL_GATEWAY, // 开始并行网关
      [Node.TYPE.PARALLEL_BRANCH_END]: SERVER_NODE_TYPE.END_PARALLEL_GATEWAY // 结束并行网关
    }[type]
  )
}

/**
 * getNodeType
 * @param {string} type
 * @returns {string}
 */
export const getNodeType = (type) => {
  return (
    type &&
    {
      [SERVER_NODE_TYPE.START]: Node.TYPE.SPONSOR_NODE,
      [SERVER_NODE_TYPE.AUDIT]: Node.TYPE.APPROVER_NODE,
      [SERVER_NODE_TYPE.START_EXCLUSIVE_GATEWAY]: Node.TYPE.CONDITION_BRANCH,
      [SERVER_NODE_TYPE.END_EXCLUSIVE_GATEWAY]: Node.TYPE.CONDITION_BRANCH_END,
      [SERVER_NODE_TYPE.CC]: Node.TYPE.NOTIFIER_NODE,
      [SERVER_NODE_TYPE.END]: Node.TYPE.END_NODE,
      [SERVER_NODE_TYPE.START_PARALLEL_GATEWAY]: Node.TYPE.PARALLEL_BRANCH, // 开始并行网关
      [SERVER_NODE_TYPE.END_PARALLEL_GATEWAY]: Node.TYPE.PARALLEL_BRANCH_END // 结束并行网关
    }[type]
  )
}

/* 初始化 participant.list 成 Client Model 格式，并赋值 node.model.content 内容 */
export const convertParticipant = (participant, fields) => {
  let content = ''
  const { type = '', formFieldKey = '' } = participant
  const PICKER_KEY = PARTICIPANT_PICKER_KEYS[type]
  const FORM_KEY = FORM_FIELDS_TYPES[type]

  /* 初始化 participant.list 成 Client Model 格式，并赋值 node.model.content 内容 */
  if (PICKER_KEY) {
    content = generateParticipantModal(participant, PICKER_KEY, content)
  } else if (type === PARTICIPANT_TYPES.INITIATOR) {
    content = PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.INITIATOR]
  } else if (type === PARTICIPANT_TYPES.OPTIONAL_PERSONNEL) {
    if (isAssignType(participant.optionalScope)) {
      let optionalType = null
      switch (participant.optionalScope) {
        case OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION:
          optionalType = PARTICIPANT_TYPES.POSITION
          break
        case OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL:
          optionalType = PARTICIPANT_TYPES.POSITION_LABEL
          break
        case OPTIONAL_SCOPE_KEYS.ASSIGN_USER:
          optionalType = TRANSFER_TYPE
          break
      }
      const pickerKey = PARTICIPANT_PICKER_KEYS[optionalType]
      content = generateParticipantModal(participant, pickerKey, content)
    } else {
      const scope =
        OPTIONAL_SCOPE_ENUM.find(
          (i) => i.value === participant.optionalScope
        ) || {}
      content = `${PARTICIPANT_TYPES_NAME[type]}(${scope.label})`
    }
  } else if (FORM_KEY) {
    if (formFieldKey) {
      content =
        PARTICIPANT_TYPES_NAME[type] +
          '：' +
          (fields.find((field) => field.fieldKey === formFieldKey) || {})
            .fieldName || ''
    }
  }
  return content
}

export const isAssignType = (optionalScope) => {
  return [
    OPTIONAL_SCOPE_KEYS.ASSIGN_USER,
    OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION,
    OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL
  ].includes(optionalScope)
}

export const generateParticipantModal = (participant, pickerKey) => {
  if (participant.list && participant.list.length) {
    participant.list = participant.list.map((item) => {
      return {
        name: item[pickerKey.name],
        value: item[pickerKey.value],
        parentFullName: pickerKey.parentName
          ? item[pickerKey.parentName]
          : null,
        organizationType: pickerKey.organizationType
          ? item[pickerKey.organizationType]
          : null,
        hasUser: item.hasUser,
        model: {
          ...item,
          unitType: pickerKey.type
        }
      }
    })

    return (participant.list || [])
      .map(
        (item) =>
          `${item.name}${
            item.parentFullName ? '(' + item.parentFullName + ')' : ''
          }`
      )
      .join('，')
  }
}

/* export const convertTransfer = (transfer, nodeType) => {
  if (
    transfer &&
    typeof transfer === 'object' &&
    Node.TYPE.APPROVER_NODE === nodeType
  ) {
    const transferList = transfer.list
    const transferKEY = PARTICIPANT_PICKER_KEYS[TRANSFER_TYPE]

    if (transferList && transferList.length) {
      transfer.list = transferList.map((item) => {
        return {
          name: item[transferKEY.name],
          value: item[transferKEY.value],
          model: {
            ...item,
            unitType: transferKEY.type,
          },
        }
      })
    }
  }
} */
