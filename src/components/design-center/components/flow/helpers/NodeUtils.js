import Flow from './Flow'
import Node from './Node'
import NodeManager from './NodeManager'
import { GENERAL_CONDITION, OTHER_CONDITION } from '../constants/CONDITION_TYPE'

/**
 * createChildNode
 * @param {Node} parentNode
 * @param {{ type: string }} options
 * @returns {Node}
 * @description 添加节点的时候根据不同的父节点类型给其添加新的子节点
 *  设 A 为 parentNode = startNode，B 为 oldNode，END = EndNode，New 为被添加节点
 *  + 1.普通（新）节点 "New"
 *    + 1.1 A -> END => A -> (New) -> END
 *    + 1.2 A -> B -> END => A -> (New) -> B => END
 *  + 分支节点
 *    + 添加新的分支节点（Diff：并行分支存在分支结束节点，而条件不需要）
 *      + "条件" 分支节点: New = ConditionBranch -> [Condition1, Condition2] => (TO STEP 1)
 *      + "并行" 分支节点: New = ParallelBranch -> [Parallel1, Parallel2] -> ParallelBranchEnd
 *    + 添加新的分支子节点:
 *      + 条件" 分支子节点: New = Flow.createNode(FLOW_NODE_TYPE.CONDITION_NODE)
 *        + A: ConditionBranch -> [Condition1, Condition2] -> END => A -> [Condition1, Condition2, New] -> END
 *      + 并行" 分支子节点: New = Flow.createNode(FLOW_NODE_TYPE.PARALLEL_NODE)
 *        + A: ParallelBranch -> [Parallel1, Parallel2] -> B: ParallelBranchEnd -> END => A -> [Parallel1, Parallel2, New] -> B -> END
 *    + 为分支子节点添加子节点: (TO STEP 1)
 */
export const createChildNode = (parentNode, { type, ...opts }) => {
  if (!parentNode || !(parentNode instanceof Node)) throw new TypeError()

  let newChildNode = null

  /* 是分支节点类型 */
  if (isBranchNode(type)) {
    /* 添加新的分支节点 */
    if (isConditionBranchNode(type)) {
      /* 条件分支 */
      newChildNode = createConditionBranchNode(opts)
    } else if (isParallelBranchNode(type)) {
      /* 并行节点 */
      newChildNode = createParallelBranchNode(opts)
    }
  } else if (isBranchChildNode(type)) {
    /* 添加新的分支子节点 */
    opts = { prevId: parentNode.nodeId, ...opts }
    const childrenNodes = getChildrenNodes(parentNode)

    if (isConditionNode(type)) {
      const node = createConditionNode(opts)

      if (isLastConditionNode(childrenNodes[childrenNodes.length - 1])) {
        childrenNodes.splice(childrenNodes.length - 1, 0, node)
      } else {
        childrenNodes.push(node)
        childrenNodes.push(
          createConditionNode({
            ...opts,
            conditionType: OTHER_CONDITION,
          })
        )
      }
    } else if (isParallelNode(type)) {
      childrenNodes.push(createParallelNode(opts))
    }

    return parentNode
  } else {
    newChildNode = Flow.createNode({ type, ...opts })
  }

  if (getChildNode(parentNode)) {
    resetChildNode(parentNode, newChildNode)
  } else {
    parentNode.next(newChildNode)
  }

  return parentNode
}

/**
 * fixNodeRef
 * @param {Node} node
 * @returns {Node}
 */
export const fixNodeRef = (node) => {
  if (isBranchNode(node)) {
    node = node.childNode
  }

  return node
}

/**
 * getChildNode 获取子节点
 * 1. 普通节点返回*当前节点*的子节点 => node.childNode
 * 2. 分支节点返回*结束节点*的子节点 => node.childNode.childNode
 * @param {Node} node
 * @returns {Node}
 */
export const getChildNode = (node) => {
  return fixNodeRef(node).childNode
}

/**
 * resetChildNode
 * @param {Node} parentNode 父节点
 * @param {Node} childNode 新的子节点
 * @returns {Node} newChildNode
 */
export const resetChildNode = (parentNode, childNode) => {
  /* A -> B -> END => A -> NEW -> B -> END */
  const oldChildNode = getChildNode(parentNode) /* B */

  parentNode.next(childNode) /* A -> NEW */

  if (oldChildNode) {
    if (isConditionBranchNode(childNode)) {
      const firstChildNode = childNode.childrenNodes[0]

      if (firstChildNode) {
        firstChildNode.next(oldChildNode)
      }
    } else {
      fixNodeRef(childNode).next(oldChildNode) /* NEW -> B */
    }
  }

  return childNode
}

/**
 * getChildrenNodes
 * @param {Node} node
 * @returns {Node[]|[]}
 */
export const getChildrenNodes = (node) => {
  if (node.childrenNodes && node.childrenNodes.length) {
    return node.childrenNodes
  }

  return []
}

/**
 * createConditionBranchNode
 * @param {{type: string, prevId: string, formFieldList: []}} [opts]
 */
export const createConditionBranchNode = (opts) => {
  const conditionBranchNode = Flow.createNode(Node.TYPE.CONDITION_BRANCH)
  const conditionChildrenNodes = [
    createConditionNode(opts),
    createConditionNode({
      ...opts,
      conditionType: OTHER_CONDITION,
    }),
  ]
  const conditionBranchEndNode = Flow.createNode(Node.TYPE.CONDITION_BRANCH_END)

  conditionBranchNode.next(conditionChildrenNodes) /* childrenNodes */
  conditionBranchNode.next(conditionBranchEndNode) /* childNode */

  conditionBranchNode.oppositeTaskId = conditionBranchEndNode.nodeId
  conditionBranchEndNode.oppositeTaskId = conditionBranchNode.nodeId

  return conditionBranchNode
}

/**
 * createConditionNode
 * @param {{type: string, prevId: string, formFieldList: []}} [opts]
 */
export const createConditionNode = (opts) => {
  return Flow.createNode({
    type: Node.TYPE.CONDITION_NODE,
    conditionType: GENERAL_CONDITION,
    ...opts,
  })
}

/**
 * createParallelBranchNode
 * @param {{type: string, prevId: string, formFieldList: []}} [opts]
 */
export const createParallelBranchNode = (opts) => {
  /* New = ParallelBranch -> [Parallel1, Parallel2] -> ParallelBranchEnd */
  const parallelBranchNode = Flow.createNode(Node.TYPE.PARALLEL_BRANCH)
  const parallelChildrenNodes = [
    createParallelNode(opts),
    createParallelNode(opts),
  ]
  const parallelBranchEndNode = Flow.createNode(Node.TYPE.PARALLEL_BRANCH_END)

  parallelBranchNode.next(parallelChildrenNodes) /* childrenNodes */
  parallelBranchNode.next(parallelBranchEndNode) /* childNode */

  parallelBranchNode.oppositeTaskId = parallelBranchEndNode.nodeId
  parallelBranchEndNode.oppositeTaskId = parallelBranchNode.nodeId

  return parallelBranchNode
}

/**
 * createParallelNode
 * @param {{type: string, prevId: string, formFieldList: []}} [opts]
 */
export const createParallelNode = (opts) => {
  return Flow.createNode({
    alias: Node.TYPE.PARALLEL_NODE,
    type: Node.TYPE.APPROVER_NODE,
    ...opts,
  })
}

/**
 * removeOldNode
 * @param {Node} node
 * @returns {Node} parentNode
 * @description 删除给出父节点的子节点
 *  设 A 为 parentNode = startNode, B 为 oldNode，END = EndNode，Old 为被删除节点
 *  + 1.普通（新）节点 "Old"(如果old是并行分支节点，则 Old = Old.childNode 即其并行结束节点)
 *    + 1.1 A -> (Old) -> END => A -> END
 *    + 1.2 A -> (Old) -> B => END => A -> B -> END
 *  + 分支节点（仅支持删除分支子节点）
 *    删除新的子分支节点（Diff：并行分支存在分支结束节点，而条件不需要），
 *    如果剩余子节点数量小于2 ，则删除整个分支节点（从父节点开始删除），从分支节点的子节点数组中移除当前项即可
 *      + childrenNodes.length > 2
 *        + 条件 & 分支
 *          Old = Branch -> [Node1, Node2, Node3] => Branch -> [Node1, Node2]
 *      + childrenNodes.length <= 2
 *        + 条件 Old => (TO STEP 1.2)
 *        + 分支
 *          A -> Branch -> [Node1, Node2] -> BranchEnd -> B -> END => A -> B -> END
 */
export const removeOldNode = (node) => {
  let parentNode = NodeManager.getNode(node.prevId) // 被删除节点的父节点

  if (isBranchChildNode(node.alias || node.type)) {
    /* 分支节点（仅支持删除分支子节点） */
    const childrenNodes = getChildrenNodes(parentNode)
    const needRemoveParent = childrenNodes.length <= 2
    const deletedNodeIndex = childrenNodes.findIndex(
      (childNode) => NodeManager.getNode(node).nodeId === childNode.nodeId
    ) // 被删除节点的索引

    if (needRemoveParent) {
      const grandParentNode = NodeManager.getNode(parentNode.prevId)
      const reservedNodeIndex = deletedNodeIndex === 1 ? 0 : 1

      if (grandParentNode) {
        NodeManager.removeNode(parentNode, false)

        childrenNodes
          .filter((_, index) => index === deletedNodeIndex)
          .forEach((childNode) => {
            NodeManager.removeNode(childNode, true)
          })

        NodeManager.removeNode(parentNode.childNode, false)

        const reservedChild = childrenNodes[reservedNodeIndex] // 被保留的分支节点
        let childNode = reservedChild && getChildNode(reservedChild) // 被保留的分支节点的子节点
        const grandChildNode = getChildNode(parentNode) // 父节点的子节点

        if (childNode) {
          NodeManager.removeNode(reservedChild, false)
          grandParentNode.next(childNode)

          if (grandChildNode) {
            childNode = getLastNode(childNode)
            childNode.next(grandChildNode)
            return grandChildNode
          }

          return childNode
        } else {
          NodeManager.removeNode(reservedChild, true)

          if (grandChildNode) {
            return grandParentNode.next(grandChildNode)
          }

          return grandParentNode.next(null)
        }
      }
    } else {
      childrenNodes.splice(deletedNodeIndex, 1)
      NodeManager.removeNode(node)

      return parentNode
    }
  } else {
    const childNode = node.childNode // 被删除节点的子节点

    if (parentNode) {
      NodeManager.removeNode(node, false)

      if (childNode) {
        if (isConditionBranchNode(parentNode)) {
          parentNode.oppositeTaskId = childNode.nodeId
        }

        return parentNode.next(childNode)
      } else {
        if (isConditionBranchNode(parentNode)) {
          parentNode.oppositeTaskId = ''
        }

        return parentNode.next(null)
      }
    }
  }
}

/**
 * getNodeType
 * @param {Node} node
 */
export const getNodeType = (node) => {
  if (typeof node === 'object' && node instanceof Node) {
    return node.alias || node.type
  } else if (typeof node === 'string') {
    return node
  } else {
    throw new Error(
      `The type of node was invalid value of ${typeof node}: ${
        node ? node.type : node
      }`
    )
  }
}

/**
 * isConditionBranchNode
 * @param {Node|string} node
 */
export const isConditionBranchNode = (node) => {
  return getNodeType(node) === Node.TYPE.CONDITION_BRANCH
}

/**
 * isParallelBranchNode
 * @param {Node|string} node
 */
export const isParallelBranchNode = (node) => {
  return getNodeType(node) === Node.TYPE.PARALLEL_BRANCH
}

/**
 * isConditionNode
 * @param {Node|string} node
 */
export const isConditionNode = (node) => {
  return getNodeType(node) === Node.TYPE.CONDITION_NODE
}

/**
 * isLastConditionNode
 * @param {Node} node
 */
export const isLastConditionNode = (node) => {
  return (
    isConditionNode(node) &&
    getNextSiblingNode(node) === null &&
    node.conditionType === OTHER_CONDITION
  )
}

/**
 * isParallelNode
 * @param {Node|string} node
 */
export const isParallelNode = (node) => {
  return getNodeType(node) === Node.TYPE.PARALLEL_NODE
}

/**
 * isBranchNode
 * @param {string} type
 */
export const isBranchNode = (type) => {
  return isConditionBranchNode(type) || isParallelBranchNode(type)
}

/**
 * isBranchChildNode
 * @param {string} type
 */
export const isBranchChildNode = (type) => {
  return type === Node.TYPE.CONDITION_NODE || type === Node.TYPE.PARALLEL_NODE
}

/**
 * get Node type by the given branch type
 */
export const getNodeTypeByBranch = (branchType) => {
  if (branchType === Node.TYPE.CONDITION_BRANCH) {
    return Node.TYPE.CONDITION_NODE
  }

  if (
    branchType === Node.TYPE.PARALLEL_BRANCH ||
    branchType === Node.TYPE.PARALLEL_BRANCH_END
  ) {
    return Node.TYPE.PARALLEL_NODE
  }

  return ''
}

/**
 * needMergeFields
 */
export const needMergeFields = (type) => {
  return [
    Node.TYPE.SPONSOR_NODE,
    Node.TYPE.APPROVER_NODE,
    Node.TYPE.NOTIFIER_NODE,
    Node.TYPE.PARALLEL_NODE,
  ].includes(type)
}

/**
 * nodeDeepIterator
 * @param {Node} node
 * @callback NodeDeepIterator
 * @param {Node}
 * @returns {void}
 * @param {Node}
 * @param {NodeDeepIterator} cb
 */
export const nodeDeepIterator = (node, cb) => {
  if (cb && typeof cb === 'function') {
    cb(node)
  }

  if (node.childrenNodes && node.childrenNodes.length) {
    node.childrenNodes.forEach((childNode) => {
      nodeDeepIterator(childNode, cb)
    })
  }

  if (node.childNode) {
    nodeDeepIterator(node.childNode, cb)
  }
}

/**
 * getLastNode
 * @param {Node} node
 */
export const getLastNode = (node) => {
  while (node) {
    if (node.childNode) {
      node = node.childNode
    } else {
      return node
    }
  }
}

/**
 * getNextSiblingNode
 * @param {Node} node
 * @returns {Node|null}
 */
export const getNextSiblingNode = (node) => {
  const prevId = node.prevId
  const parentNode = NodeManager.getNode(prevId)

  // all children nodes under parentNode
  const children = parentNode.childrenNodes || []
  const currentIndex = children.indexOf(node)

  return children[currentIndex + 1] || null
}
