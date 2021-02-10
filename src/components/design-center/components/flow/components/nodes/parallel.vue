<script>
// import PropTypes from 'vue-types'
import BaseBranchNode from './_base-branch-node'
import FlowNodeType from '../../constants/FLOW_NODE_TYPE_ENUM'
// import FlowNodeModel from '../../constants/FLOW_NODE_TYPE_MODEL'

export default {
  name: 'ParallelNode',
  type: FlowNodeType.PARALLEL_NODE,
  components: {
    BaseBranchNode,
  },
  inheritAttrs: false,
  render(h) {
    return h('BaseBranchNode', {
      attrs: this.$attrs,
      on: this.$listeners,
    })
  },
}
</script>
