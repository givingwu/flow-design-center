<template>
  <div class="end-node">
    <div class="end-node-circle"></div>
    <div class="end-node-text">{{text}}</div>
  </div>
</template>

<script>
import FlowNodeType from '../../constants/FLOW_NODE_TYPE_ENUM'
import FlowNodeModel from '../../constants/FLOW_NODE_TYPE_MODEL'

const TYPE = FlowNodeType.END_NODE
const defaultConfig = FlowNodeModel[TYPE]

export default {
  name: 'EndNode',
  type: TYPE,
  data() {
    return {
      text: defaultConfig.content
    }
  },
}
</script>
