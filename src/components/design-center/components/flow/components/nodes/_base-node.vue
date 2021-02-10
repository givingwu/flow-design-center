<template>
  <div class="node" :class="errorState && 'node-warning'" v-bind="$attrs" v-on="$listeners">
    <div class="node-title" :title="title" :style="customTitleStyle">
      <template v-if="$slots.header">
        <slot name="header"></slot>
      </template>

      <template v-else>
        <div class="node-title-text" :title="title">
          <div v-if="titleIcon" class="node-title-icon">
            <i :class="`${titleIcon}`"></i>
          </div>

          <slot v-if="$slots.title" name="title"></slot>
          <span v-else>{{title}}</span>
        </div>

        <a
          v-if="showRemove && editable"
          title="删除该节点"
          class="node-close-icon"
          href="javascript:void(0)"
          @click.stop="handleRemoveNode"
        >
          <i :class="`el-icon-close`"></i>
        </a>
      </template>
    </div>

    <div
      v-if="errorState || content || placeholder"
      class="node-content"
      :title="errorState || content || '点击设置'"
    >
      <div class="node-content-text">
        <span v-if="errorState" class="error-message">{{errorState}}</span>
        <slot v-else-if="content">
          <template>{{content}}</template>
        </slot>
        <span v-else class="placeholder">{{placeholder}}</span>
      </div>

      <div v-if="contentIcon && editable" class="node-content-icon">
        <i :class="`${contentIcon}`"></i>
      </div>
    </div>
  </div>
</template>

<script>
import PropTypes from 'vue-types'
import Node from '../../helpers/Node'

export default {
  name: 'BaseNode',
  inheritAttrs: false,
  props: {
    editable: PropTypes.bool.def(true),
    showRemove: PropTypes.bool.def(true),
    // eslint-disable-next-line
    title: PropTypes.string.isRequired,
    content: PropTypes.string.def(''),
    placeholder: PropTypes.string.def('请填写内容'),
    titleIcon: PropTypes.string.def(''),
    contentIcon: PropTypes.string.def(''),
    customTitleStyle: PropTypes.any.def({}),
    errorState: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).def(
      false
    ),
    // eslint-disable-next-line
    node: PropTypes.instanceOf(Node).required,
  },
  methods: {
    handleRemoveNode() {
      const node = this.node && this.node.remove(this, this.index)
      this.$emit('update-node', node.getRootNode(node))
    },
  },
}
</script>
