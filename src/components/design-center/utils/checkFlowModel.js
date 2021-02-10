/**
 * 检查 FlowModel 是否有效
 * 1. [节点]: 名称不能为空
 * 2. [审批/抄送节点]: 参与人
 *  2.1 参与人不能为空
 *  2.2 参与角色/部门不能为空
 * 3. [条件节点]: 条件不能为空，必须存在子节点
 */
import Node from '../components/flow/helpers/Node'
import Flow from '../components/flow/helpers/Flow'
import FlowNodeTypeModel from '../components/flow/constants/FLOW_NODE_TYPE_MODEL'
import {
  FORM_FIELDS_TYPES,
  PARTICIPANT_TYPES,
  PARTICIPANT_TYPES_NAME,
  PARTICIPANT_TYPES_MODEL,
} from '../constants/ENUM_DEFINITIONS'
import {
  OPTIONAL_SCOPE_KEYS,
  OPTIONAL_SCOPE_ENUM,
} from './../constants/OPTIONAL_PERSONAL'
import { createFlowGraph } from './adapterHelpers'
import { toNode, findTaskById, drawNodeLinesByGraph } from '../adapters/toModel'
import { createConditionNode } from '../components/flow/helpers/NodeUtils'
import { OTHER_CONDITION } from '../components/flow/constants/CONDITION_TYPE'

export const checkFlowModel = (flowModel) => {
  if (!flowModel) {
    throw new Error('流程数据不能为空')
  }

  const { sequenceList = [], taskList = [] } = flowModel
  const graph = createFlowGraph()
  const findTask = findTaskById(taskList)

  let startNode = null

  for (let i = 0; i < sequenceList.length; i++) {
    const node = sequenceList[i]
    const {
      type: conditionType,
      sourceTaskId,
      targetTaskId,
      conditionList,
    } = node

    const sourceNode = Flow.createNode(
      toNode(findTask(sourceTaskId), {}, false)
    )
    const targetNode = Flow.createNode(
      toNode(findTask(targetTaskId), {}, false)
    )

    // 如果是条件分支，开始绘制各个条件
    if (sourceNode.type === Node.TYPE.CONDITION_BRANCH) {
      const conditionNode = createConditionNode({
        conditions: conditionList,
        conditionType,
      })

      graph.addEdge(sourceNode, conditionNode)
      graph.addEdge(conditionNode, targetNode)
    } else {
      if (sourceNode.type === Node.TYPE.PARALLEL_BRANCH) {
        targetNode.alias = Node.TYPE.PARALLEL_NODE
      }

      graph.addEdge(sourceNode, targetNode)
    }

    if (!startNode) {
      startNode = sourceNode
    }
  }

  if (startNode && sequenceList.length > 1) {
    drawNodeLinesByGraph(graph)
    checkGraphAndNodeState(graph, startNode)
  } else {
    throw new Error('尚未添加任何流程节点')
  }
}

/**
 * checkGraphAndNodeState
 * @param {import('../components/flow/helpers/FlowGraph').default} graph
 * @param {import('../components/flow/helpers/Node').default} startNode
 */
export function checkGraphAndNodeState(graph, startNode) {
  let hasApproverNode = false

  graph.traverseBFS(startNode, function(node) {
    if (
      node.type === Node.TYPE.APPROVER_NODE ||
      node.type === Node.TYPE.PARALLEL_BRANCH
    ) {
      hasApproverNode = true
    }

    const errorMessage = checkNodeState(node)

    if (errorMessage) {
      const defaultTitle = FlowNodeTypeModel[node.type].title
      let title = node.model.title
      const text = '节点'

      if (title && title.endsWith(text)) {
        title = title.replace(text, '')
      }

      if (defaultTitle === title) {
        title += text
      }

      throw new Error(
        errorMessage.startsWith(title) ? errorMessage : title + errorMessage
      )
    }
  })

  if (!hasApproverNode) {
    throw new Error('流程中缺少审批人节点')
  }
}

/**
 * 检查 node 的 model 是否异常
 * @param {Node} node
 */
export const checkNodeState = (node) => {
  if (!node.model.title) {
    const defaultModel = FlowNodeTypeModel[node.type]
    const nodeTitle = defaultModel.title.replace('人', '')

    return `${nodeTitle}节点名称不能为空`
  }

  switch (node.type) {
    case Node.TYPE.APPROVER_NODE:
      return checkParticipantStatus(node)
    case Node.TYPE.NOTIFIER_NODE:
      return checkParticipantStatus(node)
    case Node.TYPE.CONDITION_NODE:
      return checkConditionStatus(node)
    default:
      break
  }
}

/**
 * @typedef {import('../components/flow/helpers/Node').default} Node
 * @param {Node} node
 */
export const checkParticipantStatus = (node) => {
  if (node.props) {
    const { participant } = node.props
    const { formFieldKey, list, level } = PARTICIPANT_TYPES_MODEL[
      participant.type
    ]

    const isAssignType = (type) => {
      return [
        OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION,
        OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL,
        OPTIONAL_SCOPE_KEYS.ASSIGN_USER,
      ].includes(type)
    }

    /* 不存在任何已选中内容则进入检查逻辑 */
    if (!FORM_FIELDS_TYPES[participant.type] && list && Array.isArray(list)) {
      if (participant.type === PARTICIPANT_TYPES.OPTIONAL_PERSONNEL) {
        if (
          isAssignType(participant.optionalScope) &&
          (!participant.list || !participant.list.length)
        ) {
          const scope = OPTIONAL_SCOPE_ENUM.find(
            (i) => i.value === participant.optionalScope
          )
          if (scope) {
            node.model.errorState = `${scope.label.substring(2)}不可为空！`
          } else {
            node.model.errorState = `发起人自选配置有误，请检查后重试！`
          }
        }
      } else {
        if (!participant.list || !participant.list.length) {
          node.model.errorState = `${
            FlowNodeTypeModel[node.type].title
          }不能为空`
        }
      }
      /* else {
        if (
          participant.type === PARTICIPANT_TYPES.POSITION ||
          participant.type === PARTICIPANT_TYPES.DEPARTMENT
        ) {
          const noUserItems = []

          participant.list.forEach((item) => {
            if (item.hasUser === false) {
              noUserItems.push(item)
            }
          })

          if (noUserItems.length) {
            const typeName = PARTICIPANT_TYPES_NAME[participant.type]

            node.model.errorState = `${typeName}中无对应人员`
          }
        }
      } */
    }

    if (level) {
      if (!participant.level) {
        node.model.errorState = '请设置等级属性'
      }
    }

    if (formFieldKey) {
      if (!participant.formFieldKey) {
        node.model.errorState =
          PARTICIPANT_TYPES_NAME[participant.type] + '不能为空'
      }
    }
  } else {
    if (node.model.errorState) {
      node.model.errorState = false
    }
  }

  return node.model.errorState
}

export const checkConditionStatus = (node) => {
  if (node.props) {
    const conditions = node.props.conditions

    // 条件节点的 conditionType 默认为 undefined | 'general'
    // 所以此处不应该判断其为 'general' 而是判断非 'other_condition'
    // 则都应该进入判断 是否存在条件 且 条件 都存在有效的 field key
    if (node.conditionType !== OTHER_CONDITION) {
      const haveConditions = Array.isArray(conditions) && conditions.length > 0
      const hasMissedFieldKey =
        haveConditions &&
        conditions.filter((condition) => !condition.fieldKey).length !== 0

      if (!haveConditions) {
        node.model.errorState = '条件不能为空'
      } else if (hasMissedFieldKey) {
        node.model.errorState = '条件节点缺少的条件字段'
      } else {
        checkBracketPairs(conditions)

        if (node.model.errorState) {
          node.model.errorState = false
        }
      }
    }
  }

  return node.model.errorState
}

/**
 * @method checkBracketPairs
 * 解决的核心问题是： 括号边界的匹配，即检测起始和结束时的边界问题，每个起始必须匹配存在且正确的边界
 * @description 检测括号的算法
 *  1. 开始括号永远是前置(先)存在，然后才有结束括号
 *  2. 开始括号的标志位永远存在结束括号对应的标志位
 *  3. 条件自身即存在开始又存在结束，则不用处理类似(a)+(b)括号了自身
 * @example right:
 *  0. a || b
 *  1. (a && b) || c
 *  2. a || (b && c)
 *  3. ((a && b) || c) && d || e
 *  4. (((a && b) || c) && d) || e
 *  5. ((a && b) || c) && (d || e)
 * @example wrong:
 *  0. a) // or `(b`
 *  1. (a || b // or `a || b)`
 * @param {Array<{ leftBracket?: boolean, rightBracket?: boolean, [prop: string]: any }>} items
 * @returns {void|Error}
 */
export const checkBracketPairs = (items) => {
  // 开始括号栈 => FILO 先入后出(push => 入, pop => 尾出)
  const leftStack = []
  // 结束括号队列 => FIFO 先入先出(push => 入, shift => 顶出)
  const rightQueue = []

  // 开始括号栈指针 flag
  let leftPointer = 0
  // 结束括号栈指针 flag
  let rightPointer = 0

  let i = 0
  const last = items.length
  const graphMap = new Map()

  if (items.length) {
    do {
      leftPointer = leftStack.length
      rightPointer = rightQueue.length

      const condition = items[i++]

      // leftBracket
      if (condition.leftBracket) {
        // 入栈并记录标志位
        leftPointer = leftStack.push(condition)
      }

      // rightBracket
      if (condition.rightBracket) {
        // 入栈并记录标志位
        rightPointer = rightQueue.push(condition)

        if (leftPointer) {
          // 左括号出栈，对应最新的 第一个右括号
          const l = leftStack.pop()

          // 右括号出列，对应其匹配的左括号
          const r = rightQueue.shift()

          if (l && r) {
            // 用图记录其位置 { l: r }
            graphMap.set(l, r)
          }
        } else {
          // 无左括号 => Error
          throw Error('无法找到匹配的左括号')
        }
      }

      // 依然存在右括号，而没有左括号
      if (!leftPointer && rightPointer) {
        throw Error('无法找到匹配的左括号')
      }

      // 依然存在左括号，而没有右括号
      if (leftPointer > rightPointer && i === last) {
        throw Error('无法找到匹配的右括号')
      }
    } while (i < last)
  }
}
