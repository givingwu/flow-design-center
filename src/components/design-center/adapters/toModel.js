import Node from '../components/flow/helpers/Node'
import Flow from '../components/flow/helpers/Flow'
import { createConditionNode } from '../components/flow/helpers/NodeUtils'
import {
  getNodeType,
  createFlowGraph,
  convertParticipant
  // convertTransfer,
} from '../utils/adapterHelpers'
import {
  updateFieldsWhenCreate,
  updateFieldsWithMerge
} from '../utils/fieldsHelpers'
import { deepCopy } from '../utils/index'
import { SPONSOR_PICKER_TYPE } from '../constants/CONDITION_ADDITION'

/**
 * @typedef {import('../components/flow/helpers/FlowGraph').default} FlowGraph
 * @typedef {{ id: string, type?: 'general'|'other_condition', name?: string|null, targetTaskId: string, sourceTaskId: string, conditions?: [] }} SequenceItem
 *
 * toModel 序列化服务端数据 ServeModel 到客户端数据 ClientModel
 * @param {{taskList: TaskNode[], sequenceList: SequenceItem[]}} ServerDataModel 服务端返回的数据 model
 * @param {{flowFields: [], conditionFields: []}} ClientDataModel 解析数据时需要的客户端本地数据
 * @param {boolean} isBusinessFlow 是否是业务流程
 * @returns {Node}
 */
export const toModel = (
  { taskList = [], sequenceList = [] } = {},
  { flowFields = [], conditionFields = [] } = {},
  isBusinessFlow
) => {
  if (taskList.length && sequenceList.length) {
    /* 有数据/反填充的情况下，处理数据初始化 graph vertices & edges，返回第一个节点 */
    const startNode = connectGraphEdges(
      { taskList, sequenceList },
      { flowFields, conditionFields },
      isBusinessFlow
    )

    return startNode
  } else {
    /* 无数据/新建的情况下，返回默认的起始节点 */
    return Flow.createNode({
      type: Node.TYPE.SPONSOR_NODE,
      nodeId: 'task-start',
      formFieldList: flowFields
    }).next(
      Flow.createNode({
        type: Node.TYPE.APPROVER_NODE,
        formFieldList: updateFieldsWhenCreate(flowFields)(
          Node.TYPE.APPROVER_NODE
        )
      })
    )
  }
}

/**
 * connectGraphEdges
 * @param {{taskList: TaskNode[], sequenceList: SequenceItem[]}} ServerDataModel 服务端返回的数据 model
 * @param {{flowFields: [], conditionFields: []}} ClientDataModel 解析数据时需要的客户端本地数据
 * @param {boolean} isBusinessFlow 是否是业务流程
 * @returns {Node} startNode
 */
const connectGraphEdges = (
  { sequenceList, taskList },
  { flowFields, conditionFields },
  isBusinessFlow
) => {
  const graph = createFlowGraph()
  const findTask = findTaskById(taskList)

  let startNode = null

  for (let i = 0; i < sequenceList.length; i++) {
    const node = sequenceList[i]
    const {
      type: conditionType,
      sourceTaskId,
      targetTaskId,
      conditionList
    } = node

    const sourceNode = Flow.createNode(
      toNode(deepCopy(findTask(sourceTaskId)), { flowFields })
    )
    const targetNode = Flow.createNode(
      toNode(deepCopy(findTask(targetTaskId)), { flowFields })
    )

    // fix: [审批流]条件字段不存在不能发布审批流程的(#1022122)
    const conditions =
      Array.isArray(conditionList) && conditionList.length
        ? filterConditions(conditionList, flowFields, isBusinessFlow)
        : []

    // 如果是条件分支，开始绘制各个条件
    if (sourceNode.type === Node.TYPE.CONDITION_BRANCH) {
      const conditionNode = createConditionNode({
        conditions,
        conditionType
      })

      conditionNode.read({
        conditions,
        fields: conditionFields
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

  drawNodeLinesByGraph(graph)

  return startNode
}

/**
 * * drawNodeLinesByGraph BFS 绘制视图节点和连线
 * @param {FlowGraph} graph
 * @param {Node} startNode
 * // @param {WeakMap<Node, Node>} conditionNodesMap
 */
export const drawNodeLinesByGraph = (graph) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('graph: ', graph)
  }

  const commonNodeMap = {}

  for (const [key, node] of graph.edges) {
    // END_NODE or PARALLEL_BRANCH_END 无需连线
    if (
      node &&
      node.type !== Node.TYPE.PARALLEL_BRANCH_END &&
      node.type !== Node.TYPE.CONDITION_BRANCH_END &&
      node.type !== Node.TYPE.END_NODE
    ) {
      const prevNode = graph.getVertexByKey(key)

      if (commonNodeMap[node.nodeId]) {
        console.log('commonNodeMap: ', commonNodeMap)
        continue
      } else {
        prevNode.next(node)
      }

      if (prevNode.oppositeTaskId && !commonNodeMap[prevNode.oppositeTaskId]) {
        if (!prevNode.childNode) {
          commonNodeMap[prevNode.oppositeTaskId] = prevNode.next(
            graph.getVertexByKey(prevNode.oppositeTaskId)
          )
        }
      }
    }
  }
}

/**
 * @typedef ClientNodeModel
 * @property {string} nodeId
 * @property {string} type
 * @property {{ title: string, content: string }} model
 * @property {{ type: string, list: [], [fieldKey]: string }} [participant]
 * @property {[]} [formFieldList]
 *
 * toNode 将 ServerTaskItem 转为 Node 构造函数参数
 * @param {TaskNode} ServerTaskItem
 * @param {{flowFields: [], conditionFields: []}} ClientDataModel 解析数据时需要的客户端本地数据
 * @param {boolean} needConvert 是否转换数据结构到 ClientViewModel
 * @returns {ClientNodeModel}
 */
export const toNode = (
  {
    taskNodeId = '',
    taskNodeName = '',
    taskType = '',
    participant = {},
    transfer,
    formFieldList = [],
    ...props
  } = {},
  { flowFields: fields = [] } = {},
  needConvert = true
) => {
  const nodeType = getNodeType(taskType)
  let content = ''

  if (needConvert) {
    if (participant) {
      content = convertParticipant(participant, fields)
    }

    // convertTransfer(transfer, nodeType)
  }

  return {
    nodeId: taskNodeId,
    type: nodeType,
    model: {
      title: taskNodeName,
      content
    },
    participant,
    transfer,
    formFieldList: updateFieldsWithMerge(fields, formFieldList, nodeType),
    ...props
  }
}

/**
 * findTaskById
 * @typedef {Object<string, any>} TaskNode
 * @property {string} taskNodeId
 * @property {string} taskNodeName
 * @property {string} taskType
 * @property {Object<string, any>} [participant]
 *
 * @param {TaskNode[]} tasks
 * @callback FindTaskFn
 * @param {string} id
 * @returns {TaskNode}
 * @returns {FindTaskFn}
 */
export const findTaskById = (tasks = []) => {
  const cachedTasks = tasks.reduce((cache, task) => {
    cache[task.taskNodeId] = task
    return cache
  }, {})

  return (id) => {
    return (
      id &&
      (cachedTasks[id]
        ? cachedTasks[id]
        : (cachedTasks[id] = tasks.find((t) => t && t.taskNodeId === id)))
    )
  }
}

/**
 * @param {field[]} flowFields
 * @param {condition[]} conditionList
 * @param {boolean} isBusinessFlow 是否是业务流程
 */
function filterConditions(conditionList, flowFields, isBusinessFlow) {
  return conditionList.filter(Boolean).map((condition) => {
    // 如果是默认的发起人类型
    const isSponsor = SPONSOR_PICKER_TYPE[condition.fieldKey]

    if (!isSponsor) {
      const field = flowFields.find(
        (item) => item.fieldKey === condition.fieldKey
      )

      if (!field) {
        condition.fieldKey = ''
      } else {
        // fix: 如果是业务流程，且字段的 required 属性是 false，也需要清空该条件
        if (isBusinessFlow && field.require !== undefined && !field.require) {
          condition.fieldKey = ''
        }
      }
    }

    return condition
  })
}
