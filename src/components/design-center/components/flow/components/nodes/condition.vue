<script>
// import PropTypes from 'vue-types'
import BaseBranchNode from './_base-branch-node'
import FlowNodeType from '../../constants/FLOW_NODE_TYPE_ENUM'
import {
  getNextSiblingNode,
  isLastConditionNode,
} from '../../helpers/NodeUtils'

export default {
  name: 'ConditionNode',

  type: FlowNodeType.CONDITION_NODE,

  components: {
    BaseBranchNode,
  },

  inheritAttrs: false,

  computed: {
    // Current node is the last one and is `other_condition` type
    isLast() {
      return isLastConditionNode(this.$attrs.node)
    },

    // Current node is the previous of the last one
    isPrevOfLast() {
      const nextSiblingNode = getNextSiblingNode(this.$attrs.node)

      return nextSiblingNode && isLastConditionNode(nextSiblingNode)
    },
  },

  render(h) {
    return h('BaseBranchNode', {
      attrs: {
        ...this.$attrs,
        movable: !this.isPrevOfLast && !this.isLast,
        node: this.isLast
          ? {
              ...this.$attrs.node,
              model: {
                ...this.$attrs.node.model,
                content: '其他情况',
              },
            }
          : this.$attrs.node,
        showRemove: !this.isLast,
        editable: !this.isLast,
      },
      nodeProps: this.isLast
        ? {
            title: '其他条件节点不可编辑',
          }
        : null,
      style: this.isLast
        ? {
            cursor: 'not-allowed',
          }
        : null,
      on: this.isLast ? null : this.$listeners,
    })
  },
}
</script>
