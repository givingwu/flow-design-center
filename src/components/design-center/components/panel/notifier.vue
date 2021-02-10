<template>
  <div>
    <PanelBlock title="抄送人节点名称">
      <el-input
        v-model="node.model.title"
        size="mini"
        @change="handleChange"
      ></el-input>
    </PanelBlock>

    <PanelBlock title="抄送人设置">
      <el-radio-group v-model="participant.type" class="flow-panel-radios">
        <el-row>
          <el-col v-for="(val, key) in participantTypes" :key="key" :span="8">
            <el-radio :title="val" :label="key">{{ val }}</el-radio>
          </el-col>
        </el-row>
      </el-radio-group>

      <div v-if="showAddBtn" class="flow-panel-button">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          @click="handleAddPeople"
          >添加{{ participantTypes[participant.type] }}</el-button
        >
      </div>

      <div
        v-if="showAddBtn && participant.list && participant.list.length"
        class="flow-panel-radios"
      >
        <template v-for="tag in participant.list">
          <el-popover
            v-if="tag.hasUser === false"
            :key="tag.value"
            popper-class="flow-panel-popover"
            trigger="hover"
            :visible-arrow="false"
            :content="`该${participantTypes[participant.type]}中无用户存在`"
            placement="top"
          >
            <el-tag
              :key="tag.value"
              slot="reference"
              size="mini"
              disable-transitions
              closable
              @close="handleDeleteTag(participant.list, tag)"
            >
              <span
                >{{ tag.name }}
                {{ tag.parentFullName ? `(${tag.parentFullName})` : '' }}</span
              >
              <i class="el-icon-warning"></i>
            </el-tag>
          </el-popover>

          <el-tag
            v-else
            :key="tag.value"
            size="mini"
            disable-transitions
            closable
            @close="handleDeleteTag(participant.list, tag)"
          >
            <span
              >{{ tag.name }}
              {{ tag.parentFullName ? `(${tag.parentFullName})` : '' }}</span
            >
          </el-tag>
        </template>

        <el-button size="mini" type="text" @click="handleClearTags"
          >清空</el-button
        >
      </div>
    </PanelBlock>

    <slot name="table"></slot>

    <SubmitPicker
      v-bind="$attrs"
      :show.sync="pickerVisible"
      :type="pickerType"
      :participant-type="participant.type"
      :default-selected="computedParticipantsList"
      @confirm="handleConfirmPicker"
    ></SubmitPicker>

    <PositionPicker
      title="选择岗位标签"
      :show.sync="stationVisible"
      multiple
      list-key-name="parentFullName"
      :role-list="computedParticipantsList"
      @addCallBack="handleCallBack"
    ></PositionPicker>
  </div>
</template>

<script>
  import PropTypes from 'vue-types'
  import Node from '../flow/helpers/Node'
  import VueMfe from 'vue-mfe'
  import PanelBlock from './_base-block'
  import SubmitPicker from './_base-submit-picker'
  import { deepCopy } from '../../utils/index'
  import FLOW_NODE_TYPE_ENUM from '../flow/constants/FLOW_NODE_TYPE_ENUM'
  import FLOW_NODE_TYPE_PROPS from '../flow/constants/FLOW_NODE_TYPE_PROPS'
  import { checkDoesUserExist } from '../../service'
  import {
    CC_TYPES_NAME,
    FORM_FIELDS_TYPES,
    PARTICIPANT_PICKER_TYPES,
    PARTICIPANT_TYPES,
    PEOPLE_TYPES_KEY_MAP,
    SUBMIT_PICKER_TYPES
  } from '../../constants/ENUM_DEFINITIONS'
  // import FLOW_NODE_TYPE_MODEL from '../flow/constants/FLOW_NODE_TYPE_MODEL'

  export default {
    name: 'NotifierPanel',
    type: FLOW_NODE_TYPE_ENUM.NOTIFIER_NODE,
    components: {
      PanelBlock,
      SubmitPicker,
      PositionPicker: () => VueMfe.Lazy('auth2.components.PositionPicker')
    },
    inheritAttrs: false,
    props: {
      // eslint-disable-next-line
      node: PropTypes.instanceOf(Node).required
    },
    data() {
      const participant = this.getValue('participant')
      return {
        /* 参与人类型 */
        participantTypes: CC_TYPES_NAME,
        /* node props model */
        participant,
        stationVisible: false,
        /* submit picker reactive data */
        pickerType: SUBMIT_PICKER_TYPES[participant.type],
        pickerVisible: false
      }
    },
    computed: {
      computedParticipantsList() {
        const list = this.participant.list
        const isPosition =
          this.participant.type === PARTICIPANT_TYPES.POSITION_LABEL
        return (list && list.length ? list : []).map((i) => ({
          [isPosition ? 'positionName' : 'nodeName']: i.name,
          sysNo: i.value,
          parentFullName: i.parentFullName || '',
          key: isPosition
            ? i.value
            : `${i.value}-${PEOPLE_TYPES_KEY_MAP[this.pickerType]}`
        }))
      },
      showAddBtn() {
        return Boolean(
          !FORM_FIELDS_TYPES[this.participant.type] && !this.fromSelf
        )
      },
      fromSelf() {
        return this.participant.type === PARTICIPANT_TYPES.INITIATOR
      }
    },
    watch: {
      'participant.type'() {
        this.participant.list = []
        this.node.read('')
      },
      participant: {
        deep: true,
        handler(val) {
          if (this.fromSelf) {
            this.node.read(this.participantTypes[val.type])
          } else {
            this.node && this.node.read(val)
          }

          if (this.node.read() && this.node.model.errorState) {
            this.node.update({
              errorState: false
            })
          }

          this.handleUpdateProps('participant')
        }
      }
    },
    created() {
      checkDoesUserExist(this.participant)
    },
    methods: {
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
      handleChange(val) {
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
          this.pickerVisible = true
        }
      },
      handleCallBack(values) {
        this.participant.list = values.map((i) => ({
          name: i.positionName,
          value: i.sysNo,
          parentFullName: i.parentFullName,
          organizationType: i.organizationType,
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
      handleConfirmPicker(values) {
        this.participant.list = values
        checkDoesUserExist(this.participant)
      },
      handleDeleteTag(list, tag) {
        list.splice(list.indexOf(tag), 1)
      },
      handleClearTags() {
        this.participant.list = []
      }
    }
  }
</script>
