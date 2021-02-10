<template>
  <div class="flow-branch-node">
    <BaseAddBtn
      v-if="btnText"
      v-bind="$attrs"
      :branch-type="nodeType"
      class="flow-branch-button"
      >{{ btnText }}</BaseAddBtn
    >

    <div
      class="flow-branch"
      :class="[type, $attrs.editable && 'flow-branch--gap']"
    >
      <div class="flow-branch-node-inner">
        <slot></slot>
      </div>
    </div>

    <!-- <BaseAddBtn v-bind="$attrs" class="flow-node-button" type="primary" circle v-on="$listeners"></BaseAddBtn> -->
  </div>
</template>

<script>
  import PropTypes from 'vue-types'
  import BaseAddBtn from './_base-add-btn'
  import FlowNodeType from '../constants/FLOW_NODE_TYPE_ENUM'
  import FlowNodeModel from '../constants/FLOW_NODE_TYPE_MODEL'
  import { isBranchNode } from '../helpers/NodeUtils'

  export default {
    name: 'FLowBranchNode',
    components: {
      BaseAddBtn
    },
    inheritAttrs: false,
    props: {
      // eslint-disable-next-line
      type: PropTypes.oneOf(Object.values(FlowNodeType).filter(isBranchNode))
        .isRequired,
      // eslint-disable-next-line
      // node: PropTypes.instanceOf(Node).required,
      // eslint-disable-next-line
      nodeType: PropTypes.oneOf(
        Object.values(FlowNodeType)
          .filter((t) => !isBranchNode(t))
          .concat(false)
      ).isRequired
    },
    computed: {
      btnText() {
        return (FlowNodeModel[this.type] || {})['btnText'] || ''
      }
    }
  }
</script>
