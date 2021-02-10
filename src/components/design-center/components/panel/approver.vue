<template>
  <div>
    <PanelBlock title="审批人节点名称">
      <el-input
        v-model="node.model.title"
        size="mini"
        @change="handleChange"
      ></el-input>
    </PanelBlock>

    <PanelBlock title="审批人设置">
      <el-select
        v-model="participant.type"
        placeholder="请选择"
        class="flow-panel-radios"
      >
        <el-option
          v-for="option in participantTypesOpts"
          :key="option.value"
          v-bind="option"
        ></el-option>
      </el-select>

      <div v-if="showAddBtn" class="flow-panel-button">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          @click="handleAddPeople"
          >添加{{ participantTypes[participant.type] }}</el-button
        >

        <el-button
          v-if="showClearBtn"
          size="mini"
          type="text"
          @click="handleClearTags"
          >清空</el-button
        >
      </div>

      <template v-if="showSelect">
        <div v-if="selectOptions.length" class="flow-panel-button">
          <el-select v-model="participant.formFieldKey" size="mini">
            <el-option
              v-for="{ label, value } in selectOptions"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </div>
        <div v-else class="flow-panel-button">暂无数据</div>
      </template>

      <template v-if="showPositionLabelSelection">
        <el-radio-group v-model="participant.scope">
          <el-radio
            v-for="(val, key) in approveOrderEnum"
            :key="key"
            :title="val"
            :label="key"
          >
            <template v-if="key === APPROVE_ORDER_TYPE.PRIORITY">
              <span>{{ val }}</span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  <p>
                    按以下岗位标签拖动排序：若找到排序最高的岗位标签有对应审批人，<br />
                    则提交给该人员审批；若找不到则自动依次往下查找。<br />
                  </p>
                  <br />
                  <p>
                    如审批岗位标签：第1优先级是【副经理】，第2优先级是【经理】。
                  </p>
                  <br />
                  <ul>
                    <li>A分公司有副经理，则直接提交给副经理审批。</li>
                    <li>B分公司没有副经理，则提交给经理审批。</li>
                  </ul>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>

            <template v-else>{{ val }}</template>
          </el-radio>
        </el-radio-group>
      </template>

      <div
        v-if="showAddBtn && participant.list && participant.list.length"
        class="participant"
      >
        <Draggable
          v-model="participant.list"
          :disabled="!isDraggable"
          ghost-class="wf-approver-ghost-item"
        >
          <template v-for="tag in participant.list">
            <el-popover
              v-if="tag.hasUser === false"
              :key="tag.key"
              popper-class="flow-panel-popover"
              trigger="hover"
              :visible-arrow="false"
              :content="`该${participantTypes[participant.type]}中无用户存在`"
              placement="top"
            >
              <span
                slot="reference"
                class="participant-item"
                :class="isDraggable ? 'draggable' : ''"
              >
                <i v-if="isDraggable" class="el-icon-rank"></i>
                <el-tag
                  :key="tag.value"
                  type="danger"
                  size="mini"
                  disable-transitions
                  closable
                  @close="handleDeleteTag(participant.list, tag)"
                >
                  <span>{{ tag.name }} {{ tag.parentFullName || '' }}</span>
                  <i class="el-icon-warning"></i>
                </el-tag>
              </span>
            </el-popover>

            <span
              v-else
              :key="tag.key"
              class="participant-item"
              :class="isDraggable ? 'draggable' : ''"
            >
              <i v-if="isDraggable" class="el-icon-rank"></i>
              <el-tag
                :key="tag.value"
                size="mini"
                disable-transitions
                closable
                @close="handleDeleteTag(participant.list, tag)"
              >
                <span>{{ tag.name }} {{ tag.parentFullName || '' }}</span>
              </el-tag>
            </span>
          </template>
        </Draggable>

        <el-button
          v-if="!showAddBtn && showClearBtn"
          size="mini"
          type="text"
          @click="handleClearTags"
          >清空</el-button
        >
      </div>

      <div v-if="isOptionalPersonal">
        <div class="personal-block">
          <el-select v-model="participant.optionalType" placeholder="请选择">
            <el-option
              v-for="type in optionalTypes"
              :key="type.value"
              v-bind="type"
            ></el-option>
          </el-select>
        </div>
        <div class="personal-block">
          <p>自选范围</p>
          <el-select
            v-model="participant.optionalScope"
            placeholder="请选择"
            @change="handleClearTags"
          >
            <el-option
              v-for="scope in optionalScope"
              :key="scope.value"
              v-bind="scope"
            ></el-option>
          </el-select>
          <el-button
            v-if="generateBtnName()"
            type="primary"
            @click="handleOptional"
            >{{ generateBtnName() }}</el-button
          >

          <div class="participant">
            <template v-for="(user, index) in participant.list">
              <el-tag
                :key="user.value"
                class="participant-item"
                size="mini"
                closable
                @close="handleScopeClose(index)"
                >{{ user.name
                }}{{ user.parentFullName && ` ${user.parentFullName}` }}</el-tag
              >
            </template>
          </div>
        </div>
      </div>
    </PanelBlock>

    <template
      v-if="
        !isOptionalPersonal ||
        (isOptionalPersonal && participant.optionalType === 'multiple')
      "
    >
      <el-divider></el-divider>

      <PanelBlock title="多人审批时采用方式">
        <div class="flow-panel-radios">
          <el-radio-group v-model="taskRule">
            <el-radio
              v-for="(val, key) in taskRuleTypes"
              :key="key"
              :label="key"
              >{{ val }}</el-radio
            >
          </el-radio-group>
        </div>
      </PanelBlock>
    </template>

    <el-divider></el-divider>

    <PanelBlock title="自动通过设置">
      <div class="flow-panel-radios">
        <el-checkbox v-model="initiatorAutoComplete">
          审批人 = 发起人时，自动通过
          <el-tooltip
            content="取消勾选，则审批人=发起人时，依然需要审批"
            placement="top"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-checkbox>
        <el-checkbox v-model="participantEmptyRule">
          审批人为空时，自动通过
          <el-tooltip
            content="取消勾选，则审批人为空时，不允许提交"
            placement="top"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-checkbox>
      </div>
    </PanelBlock>

    <PanelBlock>
      <h4 slot="title">
        <span>审批意见</span>
        <i v-if="false" class="el-icon-question"></i>
      </h4>

      <div class="flow-panel-checkbox">
        <el-checkbox v-model="opinionSetting.textOpinionEnabled">{{
          opinionSetting.textOpinionName
        }}</el-checkbox>
        <el-collapse-transition>
          <div
            v-if="opinionSetting.textOpinionEnabled"
            class="flow-panel-checkbox-gap"
          >
            <el-checkbox v-model="opinionSetting.textOpinionRequired"
              >必填</el-checkbox
            >
          </div>
        </el-collapse-transition>
        <p
          style="
            color: black;
            font-size: 14px;
            font-weight: normal;
            margin: 10px 0;
          "
        >
          审批意见提示文字
        </p>
        <el-input
          v-model="opinionSetting.textOpinionTip"
          size="mini"
        ></el-input>
      </div>
    </PanelBlock>

    <PanelBlock>
      <h4 slot="title">
        <span>手写签名</span>
        <i v-if="false" class="el-icon-question"></i>
      </h4>
      <div class="flow-panel-checkbox">
        <el-checkbox v-model="opinionSetting.writeSignatureEnabled"
          >审批时需要签名</el-checkbox
        >
        <el-collapse-transition>
          <div
            v-if="opinionSetting.writeSignatureEnabled"
            class="flow-panel-checkbox-gap"
          >
            <!-- <div>
              <el-checkbox v-model="opinionSetting.writeSignatureRequired">必填</el-checkbox>
            </div>-->
            <div>
              <el-checkbox v-model="opinionSetting.writeSignatureCanUseLast"
                >允许使用上次签名</el-checkbox
              >
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </PanelBlock>

    <el-divider></el-divider>

    <PanelBlock>
      <h4 slot="title">
        <span>其他操作</span>
        <i v-if="false" class="el-icon-question"></i>
      </h4>

      <div class="flow-panel-checkbox">
        <el-checkbox v-model="canTransfer">允许转交</el-checkbox>
        <br />
        <el-checkbox v-model="canRollback">允许回退</el-checkbox>
        <el-collapse-transition>
          <div v-if="canRollback" class="flow-panel-checkbox-gap">
            <el-checkbox v-model="isDirectRollback">
              重新提交时，直接给回退节点
              <el-tooltip
                content="被回退人重新修改后，直接提交给回退节点审批"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-checkbox>
          </div>
        </el-collapse-transition>
      </div>
    </PanelBlock>

    <SubmitPicker
      v-bind="$attrs"
      :show.sync="pickerVisible"
      :type="pickerType"
      :participant-type="participant.type"
      :default-selected="computedParticipantsList"
      @confirm="handleConfirmPicker"
    ></SubmitPicker>

    <PositionPicker
      :show.sync="stationVisible"
      :role-list="computedParticipantsList"
      list-key-name="parentFullName"
      title="选择岗位标签"
      multiple
      @addCallBack="handleCallBack"
    ></PositionPicker>
  </div>
</template>

<script>
  import PropTypes from 'vue-types'
  import VueMfe from 'vue-mfe'
  import Node from '../flow/helpers/Node'
  import PanelBlock from './_base-block'
  import SubmitPicker from './_base-submit-picker'
  import FLOW_NODE_TYPE_ENUM from '../flow/constants/FLOW_NODE_TYPE_ENUM'
  import FLOW_NODE_TYPE_PROPS from '../flow/constants/FLOW_NODE_TYPE_PROPS'
  import {
    OPTIONAL_TYPE_ENUM,
    OPTIONAL_SCOPE_ENUM,
    OPTIONAL_SCOPE_KEYS
  } from './../../constants/OPTIONAL_PERSONAL'
  import { ROLLBACK_ENUM } from './../../constants/ROLLBACK_ENUM'
  import { checkDoesUserExist } from '../../service'
  import { deepCopy } from '../../utils/index'
  import {
    AUDIT_TYPES_NAME,
    FORM_FIELDS_KEYS,
    FORM_FIELDS_TYPES,
    NO_AUDIT_TYPES,
    // NO_AUDIT_TYPES_NAME,
    PARTICIPANT_PICKER_TYPES,
    PARTICIPANT_TYPES,
    PARTICIPANT_TYPES_NAME,
    PEOPLE_TYPES_KEY_MAP,
    SUBMIT_PICKER_TYPES
  } from '../../constants/ENUM_DEFINITIONS'
  import { objectToOptions } from '../../utils/objectToOptions'
  import draggable from 'vuedraggable'
  import {
    APPROVE_ORDER_TYPE,
    APPROVE_ORDER_ENUM
  } from '../../constants/POSITION_LABEL_SELECTION'
  // import FLOW_NODE_TYPE_MODEL from '../flow/constants/FLOW_NODE_TYPE_MODEL'

  /* const defaultTrasnfer = {
  type: TRANSFER_TYPE,
  list: [],
} */

  const fileds2options = (arr) =>
    arr.map(({ fieldKey, fieldName }) => ({
      value: fieldKey,
      label: fieldName
    }))

  export default {
    name: 'ApproverPanel',
    type: FLOW_NODE_TYPE_ENUM.APPROVER_NODE,
    components: {
      Draggable: draggable,
      PanelBlock,
      SubmitPicker,
      PositionPicker: () => VueMfe.Lazy('auth2.components.PositionPicker')
    },
    props: {
      // eslint-disable-next-line
      node: PropTypes.instanceOf(Node).required,
      // eslint-disable-next-line
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.def(''),
          fieldKey: PropTypes.string.isRequired,
          fieldName: PropTypes.string.isRequired,
          canView: PropTypes.bool.isRequired,
          canWrite: PropTypes.bool.isRequired,
          require: PropTypes.bool.isRequired,
          editable: PropTypes.bool.isRequired,
          textVisible: PropTypes.bool.isRequired,
          useCondition: PropTypes.bool.isRequired
        })
      )
    },
    data() {
      /**
       * http://shzhangji.com/blog/2018/04/17/form-handling-in-vuex-strict-mode/
       * 在反显的状态下数据来自 Vuex 不能直接更新，所以干脆就 deepCopy 一份数据
       */
      const participant = this.getValue('participant')
      const canRollback = this.getValue('canRollback')

      return {
        optionalTypes: OPTIONAL_TYPE_ENUM,
        optionalScope: OPTIONAL_SCOPE_ENUM,
        /* 参与人类型 */
        participantTypesOpts: objectToOptions(PARTICIPANT_TYPES_NAME),
        participantTypes: PARTICIPANT_TYPES_NAME,
        /* 多人审批类型 */
        taskRuleTypes: AUDIT_TYPES_NAME,
        /* 审批人为空的类型 */
        // participantEmptyTypes: NO_AUDIT_TYPES_NAME,

        /* 审批优先级枚举 */
        approveOrderEnum: APPROVE_ORDER_ENUM,

        /* node props model */
        participant: {
          ...participant,
          scope: participant.scope || APPROVE_ORDER_TYPE.ALL
        },
        stationVisible: false,
        opinionSetting: this.getValue('opinionSetting'),
        taskRule: this.getValue('taskRule'),
        canTransfer: this.getValue('canTransfer'),
        // transfer: this.getValue('transfer'),
        canRollback:
          canRollback === null || canRollback === undefined
            ? true
            : canRollback,
        participantEmptyRule:
          this.getValue('participantEmptyRule') ===
            NO_AUDIT_TYPES.AUTO_COMPLETE || false,
        initiatorAutoComplete: this.getValue('initiatorAutoComplete') || false,
        rollbackSubmitType: this.getValue('rollbackSubmitType'),
        /* is tansfer flag */
        // isTransfer: false,
        /* submit picker reactive data */
        pickerType: null, // SUBMIT_PICKER_TYPES[participant.type],
        isDirectRollback: false
      }
    },
    computed: {
      computedTrasfersList() {
        const list = (this.transfer || {}).list

        return (list && list.length ? list : []).map(({ model = {} }) => model)
      },
      computedParticipantsList() {
        const list = this.participant.list
        const isPosition =
          this.participant.type === PARTICIPANT_TYPES.POSITION_LABEL ||
          (this.isOptionalPersonal &&
            this.participant.optionalScope ===
              OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL)
        return (list && list.length ? list : []).map((i) => ({
          ...i,
          [isPosition ? 'positionName' : 'nodeName']: i.name,
          parentFullName: i.parentFullName,
          sysNo: i.value,
          key: isPosition
            ? i.value
            : `${i.value}-${PEOPLE_TYPES_KEY_MAP[this.pickerType]}`
        }))
      },
      formRoleFields() {
        return this.fields.filter(({ type }) => type === FORM_FIELDS_KEYS.JOB)
      },
      formDepartmentFields() {
        return this.fields.filter(
          ({ type }) => type === FORM_FIELDS_KEYS.DEPARTMENT
        )
      },
      selectOptions() {
        return this.getSelectOptions()
      },
      showAddBtn() {
        return !this.showSelect && !this.isSelf && !this.isOptionalPersonal
      },
      showClearBtn() {
        return this.participant.list && this.participant.list.length
      },
      showSelect() {
        return Boolean(FORM_FIELDS_TYPES[this.participant.type])
      },
      showPositionLabelSelection() {
        return this.participant.type === PARTICIPANT_TYPES.POSITION_LABEL
      },
      isSelf() {
        return this.participant.type === PARTICIPANT_TYPES.INITIATOR
      },
      isDraggable() {
        return (
          this.participant.scope &&
          this.participant.scope === APPROVE_ORDER_TYPE.PRIORITY
        )
      },
      isAssignType() {
        return [
          OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION,
          OPTIONAL_SCOPE_KEYS.ASSIGN_USER,
          OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL
        ].includes(this.participant.optionalScope)
      },
      pickerVisible: {
        get() {
          return !!this.pickerType
        },
        set(val) {
          if (!val) {
            /* if (this.isTransfer) {
            this.isTransfer = false
          } */

            if (this.pickerType) {
              this.pickerType = null
            }

            return false
          }
        }
      },
      isOptionalPersonal() {
        return this.participant.type === PARTICIPANT_TYPES.OPTIONAL_PERSONNEL
      }
    },
    watch: {
      'participant.type'() {
        this.participant.list = []

        if (this.participant.formFieldKey) {
          this.participant.formFieldKey = null
        }

        this.node.read('')
        if (this.isOptionalPersonal) {
          if (!Reflect.has(this.participant, 'optionalType')) {
            this.$set(this.participant, 'optionalType', 'single')
          }
          if (!Reflect.has(this.participant, 'optionalScope')) {
            this.$set(
              this.participant,
              'optionalScope',
              OPTIONAL_SCOPE_KEYS.TENANT_ORGANIZATION
            )
          }
        }
      },
      'participant.formFieldKey'(val) {
        if (val) {
          this.node.read(
            PARTICIPANT_TYPES_NAME[this.participant.type] +
              '：' +
              (this.fields.find((field) => field.fieldKey === val) || {})
                .fieldName || ''
          )
        } else {
          this.node.read('')
        }
      },
      'participant.list'(val) {
        if (this.isSelf) {
          this.node.read(this.participantTypes[this.participant.type])
        } else if (this.showSelect) {
          const text =
            (
              (this.selectOptions || []).find(
                ({ value }) => value === this.participant.formFieldKey
              ) || {}
            ).label || ''

          this.node && this.node.read(text)
        } else {
          if (this.isOptionalPersonal && !this.isAssignType) {
            const scope =
              OPTIONAL_SCOPE_ENUM.find(
                (i) => i.value === this.participant.optionalScope
              ) || {}
            if (scope.label) {
              this.node.read(
                `${this.participantTypes[this.participant.type]}(${
                  scope.label
                })`
              )
            }
          } else {
            val.length ? this.node.read({ list: val }) : this.node.read('')
          }
        }
      },
      participant: {
        deep: true,
        handler() {
          if (this.node.read() && this.node.model.errorState) {
            this.node.model.errorState = false
          }

          this.handleUpdateProps('participant')
        }
      },
      opinionSetting: {
        deep: true,
        handler(val) {
          if (!val.writeSignatureEnabled) {
            if (val.writeSignatureRequired) {
              val.writeSignatureRequired = false
            }

            if (val.writeSignatureCanUseLast) {
              val.writeSignatureCanUseLast = false
            }
          } else {
            // feat: (#1006031)【审批流】【流程设计】【节点设置】【手写签名】手写签名一旦勾选，一定为必填
            if (!val.writeSignatureRequired) {
              val.writeSignatureRequired = true
            }
          }

          if (!val.textOpinionEnabled && val.textOpinionRequired) {
            val.textOpinionRequired = false
          }

          this.handleUpdateProps('opinionSetting')
        }
      },
      taskRule() {
        this.handleUpdateProps('taskRule')
      },
      canTransfer() {
        this.handleUpdateProps('canTransfer')
      },
      /* transfer: {
      deep: true,
      handler() {
        this.handleUpdateProps('transfer')
      },
    }, */
      canRollback() {
        if (!this.canRollback) {
          this.isDirectRollback = false
        }
        this.handleUpdateProps('canRollback')
      },
      participantEmptyRule(value) {
        this.node &&
          this.node.updateProps({
            participantEmptyRule: value
              ? NO_AUDIT_TYPES.AUTO_COMPLETE
              : NO_AUDIT_TYPES.CANNOT_SUBMIT
          })
      },
      initiatorAutoComplete() {
        this.handleUpdateProps('initiatorAutoComplete')
      },
      isDirectRollback: {
        immediate: true,
        handler(val) {
          if (this.node) {
            this.node.updateProps({
              rollbackSubmitType: !val
                ? ROLLBACK_ENUM.SEQUENCE
                : ROLLBACK_ENUM.BACK_TRACKED
            })
          }
        }
      },
      rollbackSubmitType: {
        immediate: true,
        handler(val) {
          this.isDirectRollback = val !== ROLLBACK_ENUM.SEQUENCE
        }
      }
      /* isTransfer(val) {
      if (val) {
        this.pickerType = PARTICIPANT_PICKER_TYPES[TRANSFER_TYPE]
      } else {
        this.pickerType = null
      }
    }, */
    },
    created() {
      if (this.isOptionalPersonal) {
        if (
          this.participant.optionalScope === OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION
        ) {
          checkDoesUserExist({
            list: this.participant.list,
            type: PARTICIPANT_TYPES.POSITION
          })
        }
      } else {
        checkDoesUserExist(this.participant)
      }

      this.APPROVE_ORDER_TYPE = APPROVE_ORDER_TYPE
    },
    methods: {
      generateBtnName() {
        if (
          [
            OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL,
            OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION,
            OPTIONAL_SCOPE_KEYS.ASSIGN_USER
          ].includes(this.participant.optionalScope)
        ) {
          const scope = (
            this.optionalScope.find(
              (i) => i.value === this.participant.optionalScope
            ) || {}
          ).label
          if (scope) {
            return `选择${scope.substring(2)}`
          }
        }
      },
      handleOptional() {
        if (
          this.participant.optionalScope ===
          OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL
        ) {
          this.stationVisible = true
        } else {
          this.pickerType =
            this.participant.optionalScope ===
            OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION
              ? SUBMIT_PICKER_TYPES.ROLE
              : SUBMIT_PICKER_TYPES.USER
        }
      },
      handleScopeClose(index) {
        this.participant.list.splice(index, 1)
      },
      /**
       * @description 如果 node 节点的 props 中已存在该值，则取它的值，否则取 defaultSettings 的默认值
       * @param {string} key key name
       * @returns {any*}
       */
      getValue(key) {
        if (this.node && this.node.props) {
          const propValue = this.node.props[key]
          const isObject = typeof this.node.props[key] === 'object'

          return isObject
            ? deepCopy({
                // fixed: 并行分支子节点选择后未更新VIEW(#1017053)
                ...FLOW_NODE_TYPE_PROPS[this.node.type][key],
                ...this.node.props[key]
              })
            : propValue
        }
      },
      getSelectOptions() {
        if (this.showSelect) {
          const type = this.participant.type

          if (
            type === PARTICIPANT_TYPES.POSITION_OF_FORM ||
            type === PARTICIPANT_TYPES.ORGANIZATION_POSITION_OF_FORM
          ) {
            return fileds2options(this.formRoleFields) || []
          } else if (
            type === PARTICIPANT_TYPES.DEPARTMENT_OF_FORM ||
            type === PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM
          ) {
            return fileds2options(this.formDepartmentFields) || []
          }
        }

        return []
      },
      /* update node model */
      handleChange(val) {
        this.node &&
          this.node.update({
            title: val
          })
      },
      /* update node props */
      handleUpdateProps(key) {
        this.node &&
          this.node.updateProps({
            [key]: this[key]
          })
      },
      handleAddPeople() {
        if (this.participant.type === PARTICIPANT_TYPES.POSITION_LABEL) {
          this.stationVisible = true
        } else {
          this.pickerType =
            PARTICIPANT_PICKER_TYPES[this.participant.type] || null
        }
      },
      handleConfirmPicker(values) {
        if (this.isOptionalPersonal) {
          this.participant.list = values.map((i) => {
            if (
              this.participant.optionalScope === OPTIONAL_SCOPE_KEYS.ASSIGN_USER
            ) {
              return {
                name: i.name,
                value: i.sysNo,
                hasUser: true,
                model: {
                  userName: i.name,
                  userSysNo: i.sysNo,
                  unitType: PARTICIPANT_TYPES.OPTIONAL_PERSONNEL
                }
              }
            }
            if (
              this.participant.optionalScope ===
              OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION
            ) {
              return {
                name: i.name,
                value: i.sysNo,
                hasUser: undefined,
                model: {
                  positionName: i.name,
                  positionSysNo: i.sysNo,
                  unitType: PARTICIPANT_TYPES.OPTIONAL_PERSONNEL
                }
              }
            }
          })
          if (
            this.participant.optionalScope ===
            OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION
          ) {
            checkDoesUserExist({
              list: this.participant.list,
              type: PARTICIPANT_TYPES.POSITION
            })
          }
        } else {
          this.participant.list = values
          checkDoesUserExist(this.participant)
        }
      },
      handleCallBack(values) {
        this.participant.list = values.map((i) => ({
          ...i,
          name: i.positionName,
          parentFullName: i.parentFullName,
          organizationType: i.organizationType,
          value: i.sysNo,
          hasUser: undefined,
          model: {
            positionLabelSysNo: i.sysNo,
            positionLabelName: i.positionName,
            parentFullName: i.parentFullName,
            organizationType: i.organizationType,
            unitType: PARTICIPANT_TYPES.POSITION_LABEL
          }
        }))
      },
      handleDeleteTag(list, tag) {
        list.splice(list.indexOf(tag), 1)
      },
      handleClearTags() {
        this.participant.list = []
      }
      /* handleAddTransfers() {
      this.isTransfer = true
    }, */
      /* handleConfirmTransfers(values) {
      this.isTransfer = false
      this.transfer = {
        type: TRANSFER_TYPE,
        list: values,
      }
    }, */
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/var';

  .participant {
    &-item {
      display: inline-flex;
      align-items: center;
      margin-top: 10px;

      & + &,
      & + span {
        margin-left: 5px;
      }

      &.draggable {
        .el-tag {
          cursor: move;
        }
      }

      .el-icon-rank {
        cursor: move;
        color: $--color-icon-primary;
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
</style>

<style lang="scss">
  .wf-approver-ghost-item {
    .el-tag {
      opacity: 0.5;
      background: #c8ebfb;
    }
  }
</style>
