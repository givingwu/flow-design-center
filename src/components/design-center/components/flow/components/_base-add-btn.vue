<template>
  <div v-if="branchType">
    <el-button
      size="mini"
      icon="el-icon-plus"
      v-bind="$attrs"
      v-on="$listeners"
      @click="handleAddNode(branchType)"
    >
      <slot></slot>
    </el-button>
  </div>

  <div v-else-if="!editable" class="flow-node-button--gap"></div>

  <el-popover
    v-else
    v-model="visible"
    placement="right"
    width="100"
    popper-class="flow-type-wrapper"
  >
    <div class="flow-type">
      <a
        v-for="{ type, icon, name, styles } in types"
        :key="name"
        class="flow-type-item"
        href="javascript:void(0)"
        :title="`添加${name}节点`"
        @click="handleAddNode(type)"
      >
        <div class="flow-type-item__icon" :style="styles">
          <i :class="`${icon}`"></i>
        </div>
        <div class="flow-type-item__name">{{ name }}</div>
      </a>
    </div>

    <template slot="reference">
      <el-button
        size="mini"
        icon="el-icon-plus"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot></slot>
      </el-button>

      <!-- <div v-if="arrowDown" class="flow-icon__down">
        <i class="el-icon-arrow-down"></i>
      </div>-->
    </template>
  </el-popover>
</template>

<script>
  import PropTypes from 'vue-types'
  import Node from '../helpers/Node'
  import { needMergeFields } from '../helpers/NodeUtils'
  import FLOW_ADD_BTN_TYPES from '../constants/FLOW_ADD_BTN_TYPES'
  import { updateFieldsWhenCreate } from '../../../utils/fieldsHelpers'

  export default {
    name: 'BaseAddBtn',
    inheritAttrs: false,
    props: {
      branchType: PropTypes.oneOf([
        Node.TYPE.CONDITION_NODE,
        Node.TYPE.PARALLEL_NODE,
        false
      ]).def(false),
      editable: PropTypes.bool.def(true),
      // arrowDown: PropTypes.bool.def(true),
      // eslint-disable-next-line
      node: PropTypes.instanceOf(Node).required,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.def(''),
          fieldKey: PropTypes.string.isRequired,
          fieldName: PropTypes.string.isRequired,
          canView: PropTypes.bool.isRequired,
          canWrite: PropTypes.bool.isRequired,
          require: PropTypes.oneOf([true, false, undefined]).isRequired,
          editable: PropTypes.bool.isRequired,
          textVisible: PropTypes.bool.isRequired,
          useCondition: PropTypes.bool.isRequired
        })
      )
    },
    data() {
      return {
        visible: false,
        types: FLOW_ADD_BTN_TYPES
      }
    },
    methods: {
      handleAddNode(type) {
        const opts = this.needMergeFields(type)
          ? {
              type,
              formFieldList: updateFieldsWhenCreate(this.fields)(
                type === Node.TYPE.PARALLEL_BRANCH
                  ? Node.TYPE.APPROVER_NODE
                  : type
              )
            }
          : { type }
        const node = this.node && this.node.add(opts)

        this.visible = false
        this.$emit('update-node', node.getRootNode(node))
      },
      needMergeFields(type) {
        return needMergeFields(type) || type === Node.TYPE.PARALLEL_BRANCH
      }
    }
  }
</script>
