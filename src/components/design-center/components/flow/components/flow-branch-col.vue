<template>
  <div class="flow-branch-col">
    <template v-if="left">
      <div class="flow-branch-col-line left top"></div>
      <div class="flow-branch-col-line left btm"></div>
    </template>

    <div class="flow-branch-col-inner">
      <slot v-bind="$attrs"></slot>
    </div>

    <template v-if="right">
      <div class="flow-branch-col-line right top"></div>
      <div class="flow-branch-col-line right btm"></div>
    </template>
  </div>
</template>

<script>
import PropTypes from 'vue-types'

export default {
  name: 'FlowBranchCol',
  props: {
    left: PropTypes.bool.def(false),
    right: PropTypes.bool.def(false),
  },
}
</script>
