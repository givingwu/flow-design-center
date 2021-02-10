import Node from './Node'
import FlowNodeType from '../constants/FLOW_NODE_TYPE_ENUM'
import FlowNodeModel from '../constants/FLOW_NODE_TYPE_MODEL'
import FlowNodeProps from '../constants/FLOW_NODE_TYPE_PROPS'
import { deepMerge, deepCopy } from '../../../utils/index'

export default class Flow {
  /* node map collection */
  static NODE_MAP = {}

  /**
   * 注册新节点类型 void
   * @memberof Flow
   * @param {string} type 节点名称
   * @param {Object} mode 节点视图数据
   */
  static registerNode = (type, model = {}, props = {}) => {
    if (type && !Flow.NODE_MAP[type]) {
      Flow.NODE_MAP[type] = {
        type,
        model,
        ...props,
      }
    } else {
      throw new Error(`Type ${type} has been registered before.`)
    }
  }

  /**
   * 创建一个新的节点 node: Node
   * @memberof Flow
   * @param {string|Object} opts 节点配置项
   * @returns {Node}
   */
  static createNode = (opts) => {
    opts = typeof opts === 'string' ? { type: opts } : opts

    /* 需要 deepCopy base，因为 base 始终指向同一个引用即 Flow.NODE_MAP 的某个 key 的 value 的对象引用 */
    const base = Flow.NODE_MAP[opts.type]

    if (base) {
      return new Node(deepMerge({}, deepCopy(base), { ...opts }))
    } else {
      throw new ReferenceError(
        `No any type ${opts.type} found in Flow.NODE_MAP, have u registered it before?`
      )
    }
  }
}

Object.values(FlowNodeType).forEach((type) => {
  Flow.registerNode(type, FlowNodeModel[type], FlowNodeProps[type])
})
