<template>
  <el-drawer
    class="yz design-center-panel-drawer"
    v-bind="$attrs"
    modal
    append-to-body
    v-on="$listeners"
  >
    <template v-if="node">
      <el-tabs v-model="activeName">
        <el-tab-pane label="节点属性" name="node">
          <component
            :is="computedNode"
            v-if="computedNode"
            class="flow-panel"
            :node="node"
            :fields="fields"
            v-bind="$attrs"
            v-on="$listeners"
          ></component>
        </el-tab-pane>

        <el-tab-pane
          v-if="showPermissionPanel"
          label="表单字段权限"
          name="flow"
        >
          <PanelBlock v-if="needPermissionTable">
            <PanelPermissionTable
              v-bind="{
                node,
                fields,
                joinPlan,
                canCallbackFormData: !!(getFlowFormInfo || {})
                  .canCallbackFormData,
                flowType: (getFlowBaseInfo || {}).flowType
              }"
            ></PanelPermissionTable>
          </PanelBlock>
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-drawer>
</template>

<script>
  import './styles.scss'
  import PropTypes from 'vue-types'
  import Node from '../flow/helpers/Node'
  import PanelBlock from './_base-block'
  import PanelPermissionTable from './_base-permission-table'
  import Sponsor from './sponsor'
  import Approver from './approver'
  import Notifier from './notifier'
  import Parallel from './parallel'
  import Condition from './condition'

  const BasePanel = {
    name: 'BasePanel',
    components: {
      Sponsor,
      Approver,
      Notifier,
      Parallel,
      Condition,
      PanelBlock,
      PanelPermissionTable
    },
    inheritAttrs: false,
    props: {
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
      ),
      joinPlan: PropTypes.oneOf([1, 2, 3]).isRequired
    },
    data() {
      return {
        /* active tab item */
        activeName: 'node',
        /* PermissionTable 的显隐和能否编辑 */
        showPermissionEdit: true,
        showPermissionPanel: true,

        getFlowFormInfo: {},
        getFlowBaseInfo: {}
      }
    },
    computed: {
      computedType() {
        return (this.node && this.node.type) || 'base'
      },
      computedNode() {
        return Object.values(BasePanel.components).find(
          (component) => component.type && component.type === this.computedType
        )
      },
      needPermissionTable() {
        return [
          Node.TYPE.SPONSOR_NODE,
          Node.TYPE.APPROVER_NODE,
          Node.TYPE.NOTIFIER_NODE
        ].includes(this.node && this.node.type)
      }
    },
    watch: {
      node() {
        this.resetInnerState()
        this.node && this.handleJoinPlan()
      }
      // showPermissionEdit(val) {
      //   this.watchFieldList(val)
      // },
      // showPermissionPanel(val) {
      //   this.watchFieldList(val)
      // },
    },
    mounted() {
      this.handleJoinPlan(this.joinPlan)

      window.addEventListener('keydown', this.handleKeyPress)
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.handleKeyPress)
    },
    methods: {
      handleKeyPress(event) {
        if (event.keyCode === 27) {
          if (this.$attrs.visible) {
            this.$emit('update:visible', false)
          }
        }
      },
      resetInnerState() {
        /* active tab item */
        this.activeName = 'node'

        /* PermissionTable 的显隐和能否编辑 */
        // this.showPermissionEdit = true
        this.showPermissionPanel = true
      },
      handleJoinPlan() {
        const joinPlan = this.joinPlan
        const isSponsorNode =
          this.node && this.node.type === Node.TYPE.SPONSOR_NODE
        if (joinPlan === 2) {
          if (isSponsorNode) {
            this.showPermissionPanel = false
          }
        }

        if (joinPlan === 3) {
          this.showPermissionPanel = false
        }
      }
      // watchFieldList(val) {
      //   if (val === false) {
      //     const formFieldList = deepCopy(
      //       (this.node && this.node.props && this.node.props.formFieldList) || []
      //     )

      //     this.updateFieldList(
      //       formFieldList.map((t) => {
      //         if (t.canWrite) t.canWrite = false
      //         return t
      //       })
      //     )
      //   }
      // },
      // updateFieldList(formFieldList) {
      //   this.node && this.node.updateProps({ formFieldList })
      // },
    }
  }

  export default BasePanel
</script>

<style lang="scss">
  .design-center-panel-drawer {
    .el-drawer__header {
      display: none;
    }

    .el-drawer__body {
      overflow: auto;
      padding: 30px;
    }
  }
</style>
