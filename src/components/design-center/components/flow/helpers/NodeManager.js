import Node from './Node'

/* the Map used for Cache all nodes */
/** @type {Map<string, Node>} nodesMap */
const nodesMap = new Map()

/**
 * @class NodeManager
 */
export default class NodeManager {
  /**
   * @static
   * @memberof NodeManager
   * @method isExist
   * @param {Node|string} node
   * @returns {boolean}
   */
  static isExist(nodeOrNodeId) {
    return nodesMap.has(this._getNodeId(nodeOrNodeId))
  }

  /**
   * @static
   * @memberof NodeManager
   * @method getNode
   * @param {Node|string} nodeOrNodeId
   * @returns {Node}
   */
  static getNode(nodeOrNodeId) {
    if (!NodeManager.isExist(this._getNodeId(nodeOrNodeId))) {
      throw new Error(
        `The node ${this._getNodeId(nodeOrNodeId)} was not found in NodeManager`
      )
    }

    return nodesMap.get(this._getNodeId(nodeOrNodeId))
  }

  /**
   * @static
   * @memberof NodeManager
   * @method addNode
   * @param {Node} node
   */
  static addNode(node) {
    if (!(node instanceof Node)) return
    nodesMap.set(node.nodeId, node)
  }

  static updateNode = this.addNode

  /**
   * @static
   * @memberof NodeManager
   * @method removeNode DFS 删除分子节点及其所有子节点
   * @param {Node|string} nodeOrNodeId
   * @param {boolean} removeChild 递归删除子节点
   */
  static removeNode(nodeOrNodeId, removeChild = true) {
    let node = NodeManager.getNode(nodeOrNodeId)

    if (!node || !(node instanceof Node)) return

    if (node.childNode && removeChild) {
      NodeManager.removeNode(node.childNode, removeChild)
    }

    nodesMap.delete(node.nodeId)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Deleted node.nodeId is: ',
        node.nodeId,
        '\nnodesMap: ',
        nodesMap
      )
    }

    node = null
  }

  static clear() {
    nodesMap.clear()
  }

  /**
   * _getNodeId
   * @private
   * @protected
   * @param {Node|string} nodeOrNodeId
   * @returns {string}
   */
  static _getNodeId(nodeOrNodeId) {
    let nodeId = nodeOrNodeId

    if (nodeOrNodeId instanceof Node) {
      nodeId = nodeOrNodeId.nodeId
    }

    return nodeId
  }
}
