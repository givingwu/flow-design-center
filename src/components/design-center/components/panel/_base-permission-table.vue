<template>
  <Table
    style="width: 100%"
    size="mini"
    :data="formFieldList"
    :options="options"
  ></Table>
  <!-- :row-key="row => row.fieldKey" -->
</template>

<script>
  import PropTypes from 'vue-types'
  import Node from '../flow/helpers/Node'
  import { FORM_FLOW } from './../../constants/FLOW_TYPE'

  /**
   * 1. 审批、抄送、发起节点 存到 formFieldsList
   * 2. 过滤一下 canView/canWrite/require 状态
   * 3. 审批、发起 所有默认可见、可编辑，抄送 默认所有可见，可编辑不能选
   */
  export default {
    name: 'PanelPermissionTable',
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
      joinPlan: PropTypes.oneOf([1, 2, 3]).isRequired,
      canCallbackFormData: PropTypes.bool.def(true),
      flowType: PropTypes.number.def(1)
    },
    data() {
      const notViewFieldList =
        this.node.props &&
        this.node.props.formFieldList.filter((i) => !i.textVisible)
      const nodeFiledsList =
        this.node.props &&
        this.node.props.formFieldList.filter((i) => i.textVisible)
      const isCCNode = this.node.type === Node.TYPE.NOTIFIER_NODE
      const isSponsorNode = this.node.type === Node.TYPE.SPONSOR_NODE
      const hasFields = !!(this.fields && this.fields.length)
      const isAllCanEdit = nodeFiledsList.some((i) => i.editable)
      // 是否显示可编辑列，需满足以下条件，1.至少有一列可编辑，2.不是抄送节点 3. 是发起人或没有审批回调或为空白审批
      const isShowEditCol =
        isAllCanEdit &&
        !isCCNode &&
        (isSponsorNode ||
          this.canCallbackFormData ||
          this.flowType === FORM_FLOW)
      const data = {
        options: [],
        formFieldList: [],
        notViewFormFieldList: []
      }

      data.options = [
        {
          label: '名称',
          prop: 'fieldName',
          renderHeader: () => {
            return <span class="field-name">名称</span>
          },
          render: ({ row }) => {
            let classes = 'field-name'
            classes += row.require ? ' is-required' : ''

            return <div class={classes}>{row.fieldName}</div>
          }
        },
        {
          label: '可见',
          width: 48,
          renderHeader: () => {
            return <span>可见</span>
          }
        },
        {
          label: '',
          prop: 'canView',
          width: 34,
          renderHeader: () => {
            return (
              hasFields && (
                <el-checkbox
                  style="margin-left: -10px;"
                  value={this.chosenAllCanView}
                  onInput={(val) => {
                    this.formFieldList.forEach((t) => (t.canView = val))

                    if (!val) {
                      this.formFieldList.forEach((t) => (t.canWrite = val))
                    }
                  }}
                />
              )
            )
          },
          render: ({ row, column: col, index }) => {
            return (
              <el-checkbox
                style="margin-left: -10px;"
                value={row[col.prop]}
                onInput={(val) => {
                  row[col.prop] = val

                  if (!val) {
                    const correspondingItem = this.formFieldList[index]
                    if (correspondingItem && correspondingItem.canWrite) {
                      correspondingItem.canWrite = false
                    }
                  }
                }}
              />
            )
          }
        },
        isShowEditCol && {
          label: '可编辑',
          width: 92,
          renderHeader: () => {
            return <span style="margin-left: 30px">可编辑</span>
          }
        },
        isShowEditCol && {
          label: '',
          prop: 'canWrite',
          width: 24,
          renderHeader: () => {
            return (
              hasFields && (
                <el-checkbox
                  style="margin-left: -10px;"
                  disabled={!this.chosenAllCanView}
                  value={this.chosenAllCanView && this.chosenAllCanEdit}
                  onInput={(val) => {
                    this.canWriteFields.forEach((t) => (t.canWrite = val))
                  }}
                />
              )
            )
          },
          render: ({ row, column: col }) => {
            return (
              !this.checkUsingCondition(row) &&
              row.editable && (
                <el-checkbox
                  style="margin-left: -10px;"
                  disabled={!row.canView}
                  value={row[col.prop]}
                  onInput={(val) => {
                    row[col.prop] = val
                  }}
                />
              )
            )
          }
        }
      ].filter(Boolean)

      if (notViewFieldList && notViewFieldList.length) {
        data.notViewFormFieldList = notViewFieldList
      }

      if (nodeFiledsList && nodeFiledsList.length) {
        data.formFieldList = nodeFiledsList
      } else {
        data.formFieldList =
          this.fields.map((t) => ({
            ...t,
            canView: this.joinPlan === 1 ? true : t.textVisible,
            canWrite: this.joinPlan === 1 ? !isCCNode : false
          })) || []
      }

      if (isCCNode) {
        data.formFieldList = data.formFieldList.map((t) => {
          if (t.canWrite) t.canWrite = false
          return t
        })
      }

      return data
    },
    computed: {
      canWriteFields() {
        return this.formFieldList.filter(
          (i) => i.textVisible && i.editable && !this.checkUsingCondition(i)
        )
      },
      chosenAllCanView() {
        return this.formFieldList.every((t) => t.canView)
      },
      chosenAllCanEdit() {
        return this.canWriteFields.every((t) => t.canWrite)
      }
    },
    watch: {
      formFieldList: {
        deep: true,
        immediate: true,
        handler() {
          this.updateFieldList()
        }
      }
    },
    /* created() {
    if (!this.node.props || !this.node.props.formFieldList) {
      this.updateFieldList()
    }
  }, */
    methods: {
      updateFieldList() {
        this.node &&
          this.node.updateProps({
            formFieldList: this.formFieldList.concat(this.notViewFormFieldList)
          })
      },
      checkUsingCondition(row) {
        const formField = this.fields.find((i) => i.fieldKey === row.fieldKey)
        const isSponsor = this.node.type === Node.TYPE.SPONSOR_NODE
        if (!isSponsor && formField && formField.useCondition) {
          row.canWrite = false
          return !isSponsor && formField.useCondition
        }
        return false
      }
    }
  }
</script>
