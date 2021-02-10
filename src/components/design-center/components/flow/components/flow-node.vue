<!-- https://alligator.io/vuejs/dynamic-components/ -->
<template>
  <div :class="`${type}-node`" class="flow-node">
    <component
      :is="computedNode"
      v-if="computedNode"
      v-bind="$attrs"
      v-on="$listeners"
    ></component>
    <BaseAddBtn
      v-if="showAddBtn"
      v-bind="$attrs"
      class="flow-node-button"
      type="primary"
      circle
      v-on="computedListeners"
    ></BaseAddBtn>
    <!-- :arrow-down="computedArrowDown" -->
  </div>
</template>

<script>
  import PropTypes from 'vue-types'
  import { isBranchNode } from '../helpers/NodeUtils'
  import FLOW_NODE_TYPE_ENUM from '../constants/FLOW_NODE_TYPE_ENUM'
  import BaseAddBtn from './_base-add-btn'
  import SponsorNode from './nodes/sponsor'
  import ApproverNode from './nodes/approver'
  import NotifierNode from './nodes/notifier'
  import ConditionNode from './nodes/condition'
  import ParallelNode from './nodes/parallel'
  import EndNode from './nodes/end'

  // const flowNodeEnum = Object.values(FLOW_NODE_TYPE_ENUM)
  const FlowNode = {
    name: 'FlowNode',
    components: {
      BaseAddBtn,
      SponsorNode,
      ApproverNode,
      NotifierNode,
      ConditionNode,
      ParallelNode,
      EndNode
    },
    inheritAttrs: false,
    props: {
      type: PropTypes.oneOf(
        Object.values(FLOW_NODE_TYPE_ENUM).filter((t) => !isBranchNode(t))
      ).isRequired
      // eslint-disable-next-line
      // node: PropTypes.instanceOf(Node).required,
    },
    computed: {
      /* computedArrowDown() {
      return !isBranchNode(this.type)
    }, */
      computedNode() {
        return Object.values(FlowNode.components).find(
          (component) => component.type && component.type === this.type
        )
      },
      showAddBtn() {
        return this.type !== 'end'
      },
      computedListeners() {
        // eslint-disable-next-line no-unused-vars
        const { click, ...listeners } = this.$listeners

        return {
          ...listeners
        }
      }
    }
  }

  export default FlowNode
</script>
