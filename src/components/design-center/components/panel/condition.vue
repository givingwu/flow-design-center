<template>
  <PanelBlock title="条件节点名称">
    <el-input v-model="node.model.title" size="mini" @change="handleChange"></el-input>
  </PanelBlock>
</template>

<script>
import Node from '../flow/helpers/Node'
import PanelBlock from './_base-block'
import PropTypes from 'vue-types'
import FLOW_NODE_TYPE_ENUM from '../flow/constants/FLOW_NODE_TYPE_ENUM'
// import FLOW_NODE_TYPE_MODEL from '../flow/constants/FLOW_NODE_TYPE_MODEL'

export default {
  name: 'ConditionPanel',
  type: FLOW_NODE_TYPE_ENUM.CONDITION_NODE,
  components: {
    PanelBlock,
  },
  props: {
    // eslint-disable-next-line
    node: PropTypes.instanceOf(Node).required,
  },
  methods: {
    handleChange(val) {
      this.node &&
        this.node.update({
          title: val,
        })
    },
  },
}
</script>
