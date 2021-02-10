import './components/styles.scss'
import PropTypes from 'vue-types'
import Node from './helpers/Node'
import { getNodeTypeByBranch } from './helpers/NodeUtils'
import FlowNode from './components/flow-node'
import FlowBranchCol from './components/flow-branch-col'
import FlowBranchNode from './components/flow-branch-node'
import { toJSON } from '../../adapters/toJSON'
import { toModel } from '../../adapters/toModel'

export default {
  name: 'FlowLayout',
  adapters: {
    toJSON,
    toModel
  },
  components: {
    FlowNode,
    FlowBranchCol,
    FlowBranchNode
  },
  inheritAttrs: false,
  props: {
    // eslint-disable-next-line
    rootNode: PropTypes.instanceOf(Node).required,
    currNode: PropTypes.instanceOf(Node).required,
    editable: PropTypes.bool.def(true)
  },
  computed: {
    graph() {
      return this.node && this.node.graph
    }
  },
  mounted() {
    this.$emit('loaded')
  },
  methods: {
    renderNode(node, props = {}) {
      if (!node) return null

      const { type = '', childNode, childrenNodes } = node
      const isBranchNode = node.isBranchNode()
      const attributes = {
        attrs: this.$attrs,
        class: {
          'is-active': this.currNode === node
        }
      }

      if (this.editable) {
        attributes.on = {
          ...this.$listeners,
          click: () => {
            this.$emit('click-node', node, props)
          }
        }
      }

      return [
        type && !isBranchNode && (
          <FlowNode
            type={type}
            node={node}
            editable={this.editable}
            index={props.index}
            total={props.total}
            node={node}
            {...attributes}
            // {...{ model }}
            // {...{ props }}
          />
        ),
        isBranchNode &&
          childrenNodes &&
          childrenNodes.length &&
          this.renderBranchNode(childrenNodes, node, type),
        childNode && this.renderNode(childNode)
      ]
    },
    renderBranchNode(nodes, node, type) {
      const nodeType = getNodeTypeByBranch(type)
      const total = nodes.length - 1
      const attributes = {
        attrs: this.$attrs
      }

      if (this.editable) {
        attributes.on = {
          ...this.$listeners
        }
      }

      return (
        <FlowBranchNode
          type={type}
          nodeType={this.editable && nodeType}
          editable={this.editable}
          node={node}
          {...attributes}
        >
          {nodes.map((node, index) => (
            <FlowBranchCol left={index === 0} right={index === total}>
              {this.renderNode(node, { index, total })}
            </FlowBranchCol>
          ))}
        </FlowBranchNode>
      )
    }
  },
  render() {
    return (
      <div class="flow-layout">
        {this.renderNode(this.rootNode)}
        <FlowNode type="end" />
      </div>
    )
  }
}
