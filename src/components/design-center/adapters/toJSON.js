import Node from '../components/flow/helpers/Node'
import Flow from '../components/flow/helpers/Flow'
import {
  getServerType,
  getSourceNode,
  getTargetNode,
  createFlowGraph
} from '../utils/adapterHelpers'
import { checkGraphAndNodeState } from '../utils/checkFlowModel'

/**
 * toJSON 反序列化客户端数据 ClientModel 到服务端数据 ServerModel
 * @param {Node} startNode 客户端本地树形结构的起始节点
 * @param {boolean} ignoreError 不运行错误检查代码
 * @returns {{taskList: TaskNode[], sequenceList: SequenceItem[]}} ServerDataModel 服务端返回的数据 model
 */
export const toJSON = (startNode, ignoreError) => {
  const graph = createFlowGraph()

  /** @type {TaskNode[]} */
  const taskList = []

  /** @type {SequenceItem[]}  */
  const sequenceList = []

  const connectGraphEdge = createDFSGraphConnector(graph, taskList)
  const genSequenceItems = createSequenceGenerator(graph, sequenceList)

  connectGraphEdge(startNode)
  genSequenceItems(startNode)

  if (!ignoreError) {
    if (startNode && sequenceList.length > 1) {
      checkGraphAndNodeState(graph, startNode)
    } else {
      throw new Error('尚未添加任何流程节点')
    }
  }

  if (process.env.NODE_ENV === 'development') {
    graph.print()
    console.log('graph: ', graph)
  }

  return {
    taskList: taskList.concat(toTask(END_NODE)),
    sequenceList
  }
}

/**
 * createDFSGraphConnector
 * @description 用DFS连接Graph的各个点<GraphVertex>生成边<GraphEdge>
 * @typedef {import('../components/flow/helpers/FlowGraph').default} FlowGraph
 * @param {FlowGraph} graph
 * @param {TaskNode[]} taskList
 * @callback ConnectFn
 * @param {Node} node
 * @returns {ConnectFn}
 */
const createDFSGraphConnector = (graph, taskList) => {
  /** @type {Node[]} */
  const END_NODES_STACK = []

  /**
   * connect 将 node 通过 FlowGraph 建立图索引关系
   * 尾递归 https://zh.wikipedia.org/wiki/%E5%B0%BE%E8%B0%83%E7%94%A8
   * 深度优先递归 DFS 建立图索引关系 G => {V<Node>, E<Node[]>}
   * @param {Node} node
   */
  const connect = (node) => {
    /* 不记录条件节点到 taskList 中，跳过条件节点 */
    if (node.type !== Node.TYPE.CONDITION_NODE) {
      taskList.push(toTask(node))
    }

    /* 跳过结束节点 */
    if (node.type === Node.TYPE.END_NODE) return

    graph.addVertex(node).addVertex(node.childNode)

    if (node.childrenNodes && node.childrenNodes.length) {
      /* Flag 标记清除算法 */
      let pushedIntoStack = false

      /* 如果当前节点是分支并以存在子节点，则将该节点推入结束节点栈中，并用 flag 标记 */
      if (node.childNode) {
        END_NODES_STACK.push(node.childNode)
        pushedIntoStack = true
      }

      node.childrenNodes.forEach((childNode) => {
        graph.addEdge(node, childNode)
        connect(childNode)
      })

      /* 如果被标记过 flag，则从栈中推出(清除) */
      if (pushedIntoStack) {
        END_NODES_STACK.pop()
      }
    }

    if (node.childNode) {
      /**
       * 如果存在子元素集合(node.childrenNodes) 则不需要连线 node -> node.childNode 之间
       */
      if (!node.childrenNodes || !node.childrenNodes.length) {
        graph.addEdge(node, node.childNode)
      }

      connect(node.childNode)
    }

    if (!node.childrenNodes && !node.childNode) {
      graph.addEdge(
        node,
        END_NODES_STACK[END_NODES_STACK.length - 1] || END_NODE
      )
    }
  }

  return connect
}

/**
 * createSequenceGenerator
 * @description 将 graph.edges 按 BFS 的顺序生成一维顶点集合[{ source: a, target: b }, ...]
 *
 * @typedef {import('../components/flow/helpers/FlowGraph').default} FlowGraph
 * @param {FlowGraph} graph
 * @param {SequenceItem[]} sequenceList
 * @callback SequenceGenerator
 * @param {Node} currNode
 * @returns {SequenceGenerator}
 */
const createSequenceGenerator = (graph, sequenceList) => {
  const createSequenceItem = createUniqueSequenceItem(sequenceList)

  const push2sequenceList = (/** @type {Node} */ currNode) => {
    // 广度优先遍历图索引，生成连线记录 sequenceList
    graph.traverseBFS(currNode, function(node, neighbor) {
      // 如果当前节点是条件节点，跳过该节点
      if (node.type === Node.TYPE.CONDITION_BRANCH) {
        return
      }

      if (node.type === Node.TYPE.CONDITION_NODE) {
        const sourceNode = getSourceNode(node, graph)
        const targetNode = getTargetNode(neighbor, graph)

        if (sourceNode && targetNode) {
          return createSequenceItem({
            type: node.conditionType,
            sourceTaskId: sourceNode.nodeId,
            targetTaskId: targetNode.nodeId,
            conditionList: (node.props.conditions || [])
              .filter((condition) => condition && condition.fieldKey)
              // eslint-disable-next-line no-unused-vars
              .map(({ key, ...props }) => ({
                ...props
              }))
          })
        }
      }

      if (neighbor && node.type !== Node.TYPE.END_NODE) {
        if (Array.isArray(neighbor) && neighbor.length) {
          neighbor.forEach((childNode) => {
            createSequenceItem({
              sourceTaskId: node.nodeId,
              targetTaskId: childNode.nodeId
            })
          })
        } else {
          createSequenceItem({
            sourceTaskId: node.nodeId,
            targetTaskId: neighbor.nodeId
          })
        }
      }
    })
  }

  return push2sequenceList
}

/**
 * toTask 将 Client Node 节点转换成 Server Model
 * @param {Node} node
 * @returns {TaskNode}
 */
const toTask = (node) => {
  let taskNode = {
    taskNodeId: node.nodeId,
    taskNodeName: (node.model || {}).title,
    taskNodeDescription: null,
    taskType: getServerType(node.type)
  }

  if (node.oppositeTaskId) {
    taskNode.oppositeTaskId = node.oppositeTaskId
  }

  const {
    formFieldList = [],
    participant = {},
    buttonList = [],
    opinionSetting,
    transfer,
    ...props
  } = node.props

  if (node.type !== Node.TYPE.END_NODE) {
    if (formFieldList && formFieldList.length) {
      // eslint-disable-next-line no-unused-vars
      taskNode.formFieldList = formFieldList.map(({ type, ...props }) => ({
        ...props
      }))
    }
  }

  if (node.type === Node.TYPE.SPONSOR_NODE) {
    //
  } else if (
    node.type === Node.TYPE.NOTIFIER_NODE ||
    node.type === Node.TYPE.APPROVER_NODE
  ) {
    const { list = [], formFieldKey = '', ...participantProps } = participant

    if (formFieldKey) {
      taskNode.participant = { formFieldKey, ...participantProps }
    } else if (list && list.length) {
      taskNode.participant = {
        // eslint-disable-next-line no-unused-vars
        list: list.map(({ model: { unitType, ...data }, hasUser }) => ({
          ...data,
          hasUser
        })),
        ...participantProps
      }
    } else {
      taskNode.participant = {
        ...participantProps
      }
    }

    if (node.type === Node.TYPE.APPROVER_NODE) {
      taskNode.buttonList = [] || buttonList
      taskNode.opinionSetting = {
        ...opinionSetting
      }

      if (transfer && transfer.list && transfer.list.length) {
        const { type, list } = transfer
        taskNode.transfer = {
          type,
          // eslint-disable-next-line no-unused-vars
          list: list.map(({ model: { unitType, ...data } }) => ({ ...data }))
        }
      }
    }

    taskNode = {
      ...taskNode,
      ...props
    }
  } else if (node.type === Node.TYPE.CONDITION_BRANCH) {
    return taskNode
  }

  return taskNode
}

/**
 * @typedef {{ id: string, name?: string|null, type?: 'general'|'other_condition', targetTaskId: string, sourceTaskId: string, conditions?: [] }} SequenceItem
 *
 * createSequenceItem
 * @description 生成每个序列对象<SequenceItem>
 * @param {SequenceItem[]} sequenceList
 * @callback CreateSequenceItemFn
 * @param {SequenceItem} opts
 * @returns {SequenceItem}
 * @returns {CreateSequenceItemFn}
 */
const createUniqueSequenceItem = (sequenceList) => {
  /** @type {string[]} */
  const cached = []

  return (opts = {}) => {
    if (!opts.sourceTaskId || !opts.targetTaskId) {
      throw new Error(
        `One of the 'opts.sourceTaskId' || 'opts.targetTaskId' is an invalid value ${JSON.stringify(
          opts
        )}`
      )
    }

    if (opts.sourceTaskId === opts.targetTaskId) {
      throw new Error(
        'Are you sure the sourceTaskId and targetTaskId are same?'
      )
    }

    const key = [opts.sourceTaskId, opts.targetTaskId].join('->')

    if (!cached.includes(key)) {
      cached.push(key)
    } else {
      console.log(`duplicate key ${key} has been cached`)
    }

    sequenceList.push({
      id: Node.getUUID('task'),
      name: null,
      conditionList: [],
      ...opts
    })
  }
}

/**
 * @typedef TaskNode
 * @property {string} taskNodeId
 * @property {string} taskType
 * @property {string} [taskNodeName]
 * @property {Object<string, any>} [participant]
 */
/** @type {TaskNode}  */
export const END_TASK_NODE = {
  taskNodeId: 'task-end',
  taskNodeName: '结束',
  taskType: Node.TYPE.END_NODE
}

export const END_NODE = Flow.createNode({
  type: Node.TYPE.END_NODE,
  nodeId: END_TASK_NODE.taskNodeId,
  model: {
    title: END_TASK_NODE.taskNodeName
  }
})
