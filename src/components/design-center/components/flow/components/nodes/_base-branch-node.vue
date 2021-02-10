<template>
  <div
    class="branch-node"
    :class="errorState && 'branch-node-warning'"
    v-bind="$attrs"
    :title="computedNodeTitle"
    v-on="$listeners"
  >
    <div
      v-if="showArrowLeft"
      title="左移"
      class="branch-node-icon-left"
      @click.stop="handleMoveForward"
    >
      <i class="el-icon-arrow-left"></i>
    </div>

    <div class="branch-node-inner">
      <div v-if="title" class="branch-node-title" :style="model.customTitleStyle">
        <div class="branch-node-title-text">
          <span>{{title}}</span>
        </div>

        <div class="branch-node-priority">{{priority}}</div>

        <a
          v-if="showRemove && editable"
          title="删除该节点"
          class="branch-node-icon-close"
          href="javascript:void(0)"
          @click.stop="handleRemoveNode"
        >
          <i :class="`el-icon-close`"></i>
        </a>
      </div>

      <div
        v-if="errorState || model.content || model.placeholder"
        class="branch-node-content"
        :title="errorState || model.content || '点击设置'"
      >
        <div class="branch-node-content-text">
          <span v-if="errorState" class="error-message">{{errorState}}</span>
          <slot v-else-if="model.content">
            <template>{{model.content}}</template>
          </slot>
          <span v-else class="placeholder">{{model.placeholder}}</span>
        </div>
      </div>
    </div>

    <div
      v-if="showArrowRight"
      title="右移"
      class="branch-node-icon-right"
      @click.stop="handleMoveBackward"
    >
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import PropTypes from 'vue-types'
import Node from '../../helpers/Node'
import FlowGraph from '../../helpers/FlowGraph'
import FlowNodeModel from '../../constants/FLOW_NODE_TYPE_MODEL'

export default {
  name: 'BaseBranchNode',
  inheritAttrs: false,
  props: {
    movable: PropTypes.bool.def(true),
    editable: PropTypes.bool.def(true),
    showRemove: PropTypes.bool.def(true),
    index: PropTypes.number.def(0),
    total: PropTypes.number.def(0),
    // eslint-disable-next-line
    node: PropTypes.instanceOf(Node).required,
    // eslint-disable-next-line
    graph: PropTypes.instanceOf(FlowGraph).required,
  },
  computed: {
    type() {
      return this.node && this.node.type
    },
    settings() {
      return FlowNodeModel[this.type]
    },
    model() {
      return { ...this.settings, ...(this.node && this.node.model) }
    },
    errorState() {
      return this.model.errorState
    },
    title() {
      if (this.settings.title === this.model.title) {
        return this.settings.title + (this.index + 1)
      } else {
        return this.model.title
      }
    },
    priority() {
      return '优先级' + (this.index + 1)
    },
    showArrowLeft() {
      return this.editable && this.index > 0
    },
    showArrowRight() {
      return (
        this.movable &&
        this.editable &&
        this.index < this.total &&
        this.index !== this.total
      )
    },
    computedNodeTitle() {
      const { showRemove, editable } = this
      let title = ''

      if (!showRemove || !editable) {
        if (!showRemove && !editable) {
          title = '不可编辑，不可移动'
        } else if (!showRemove) {
          title = '不可移动'
        } else if (!editable) {
          title = '不可编辑'
        }
      } else {
        title = '点击设置'
      }

      return title
    },
  },
  watch: {
    'model.content'(val) {
      if (val && this.errorState) {
        this.node.model.errorState = false
      }
    },
  },
  methods: {
    handleRemoveNode() {
      const node = this.node && this.node.remove(this, this.index)
      this.$emit('update-node', node.getRootNode(node))
    },
    handleMoveForward() {
      this.node && this.node.move(this.index, this.index - 1)
    },
    handleMoveBackward() {
      this.node && this.node.move(this.index, this.index + 1)
    },
  },
}
</script>
