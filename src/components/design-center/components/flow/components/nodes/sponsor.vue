<script>
import PropTypes from 'vue-types'
import BaseNode from './_base-node'
import FlowNodeType from '../../constants/FLOW_NODE_TYPE_ENUM'
import FlowNodeModel from '../../constants/FLOW_NODE_TYPE_MODEL'

const TYPE = FlowNodeType.SPONSOR_NODE
const defaultConfig = FlowNodeModel[TYPE]

export default {
  name: 'SponsorNode',
  type: TYPE,
  components: {
    BaseNode,
  },
  inheritAttrs: false,
  props: {
    // eslint-disable-next-line
    node: PropTypes.instanceOf(Node).required,
  },
  render(h) {
    return h('BaseNode', {
      props: {
        ...defaultConfig,
        ...this.node.model,
        node: this.node,
        showRemove: false,
      },
      attrs: this.$attrs,
      on: this.$listeners,
    })
  }
}
</script>
