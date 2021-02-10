<template>
  <el-dialog v-bind="$attrs" v-on="$listeners">
    <slot slot="title" name="title"></slot>
    <el-form
      ref="conditionsForm"
      :model="form"
      class="flow-condition"
      size="mini"
      @submit="handleClickConfirm"
    >
      <template v-for="(group, groupIndex) in form.conditions">
        <div
          v-if="groupIndex > 0"
          :key="`${group[0].key}`"
          class="flow-condition-group__logic"
        >
          {{ LOGIC_SIGNS[group[0].unionLogic] }}
        </div>

        <div :key="groupIndex" class="flow-condition-group">
          <div class="flow-condition-group__title">
            <div class="flow-condition-group__title-text">
              条件组{{ groupIndex + 1 }}
            </div>

            <div
              v-if="form.conditions.length > 1"
              class="flow-condition-group__title-del"
            >
              <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click="() => handleRemoveConditionGroup(groupIndex)"
              ></el-button>
            </div>
          </div>

          <div class="flow-condition-group__content">
            <div
              v-for="(condition, index) in group"
              :key="condition.key"
              class="flow-condition-item"
            >
              <div
                v-if="
                  index > 0 &&
                    condition.unionLogic &&
                    LOGIC_SIGNS[condition.unionLogic]
                "
                class="flow-condition-item__logic"
              >
                {{ LOGIC_SIGNS[condition.unionLogic] }}
              </div>

              <el-row :gutter="10">
                <!-- 条件字段  -->
                <el-col :span="9">
                  <el-form-item
                    class="flow-condition-item"
                    :prop="
                      'conditions.' + groupIndex + '.' + index + '.fieldKey'
                    "
                    size="mini"
                    :rules="[
                      {
                        required: true,
                        message: '请选择条件字段',
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-select
                      v-model="condition.fieldKey"
                      placeholder="选择字段"
                      aria-placeholder="选择字段"
                      style="width: 100%"
                      @change="handleChange(condition)"
                    >
                      <el-option
                        v-for="item in selectOptions"
                        :key="item.key"
                        v-bind="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- 条件规则 -->
                <el-col :span="5">
                  <el-form-item
                    :prop="
                      'conditions.' +
                        groupIndex +
                        '.' +
                        index +
                        '.conditionType'
                    "
                    size="mini"
                    :rules="[
                      {
                        required: true,
                        message: '请选择判断条件',
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-select
                      v-model="condition.conditionType"
                      style="width: 100%"
                      :disabled="!condition.fieldKey"
                      placeholder="判断条件"
                      aria-placeholder="判断条件"
                      @change="
                        (value) => handleConditionTypeChange(condition, value)
                      "
                    >
                      <el-option
                        v-for="(key, val) in getConditionTypes(condition)"
                        :key="key"
                        :label="key"
                        :value="val"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- 条件值 -->
                <el-col :span="9">
                  <el-form-item
                    :prop="'conditions.' + groupIndex + '.' + index + '.value'"
                    size="mini"
                    :rules="[
                      {
                        required: true,
                        message: '请填写条件对应值',
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <!-- 单选下拉框值 -->
                    <!-- v-model="condition.value" -->
                    <el-select
                      v-if="
                        !Boolean(getPickerType(condition)) &&
                          getFieldOptions(condition)
                      "
                      v-ref="(ref) => handleConditionPickerRef(condition, ref)"
                      :value="
                        isMultipleType(condition)
                          ? condition.value
                          : condition.value[0]
                      "
                      placeholder="单选值"
                      aria-placeholder="值"
                      :multiple="isMultipleType(condition)"
                      @change="
                        (value) => handleConitionValueChange(condition, value)
                      "
                    >
                      <el-option
                        v-for="item in getFieldOptions(condition)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>

                    <!-- 被动输入框值 -->
                    <!-- v-model="condition.value" -->
                    <el-input
                      v-else-if="
                        Boolean(getPickerType(condition)) ||
                          isPosition(condition)
                      "
                      :value="getFieldOptions(condition)"
                      multiple
                      readonly
                      placeholder="值"
                      aria-placeholder="值"
                      style="width: 100%"
                      @click.native="() => handleClickPickerInput(condition)"
                    ></el-input>

                    <!-- 主动输入框值 -->
                    <el-input
                      v-else
                      v-model="condition.value"
                      :type="condition.conditionCode"
                      placeholder="值"
                      aria-placeholder="值"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <!-- 删除 -->
                <el-col v-if="form.conditions[groupIndex].length > 1" :span="1">
                  <div class="flow-condition-remove">
                    <el-button
                      type="text"
                      icon="el-icon-remove"
                      size="mini"
                      @click="() => handleRemoveCondition(groupIndex, index)"
                    ></el-button>
                  </div>
                </el-col>
              </el-row>
            </div>

            <div class="flow-condition-action">
              <el-button
                size="mini"
                icon="el-icon-plus"
                class="standard"
                type="primary"
                plain
                @click="handleAddCondition(groupIndex, { unionLogic: AND })"
                >且条件</el-button
              >

              <el-button
                size="mini"
                icon="el-icon-plus"
                class="standard"
                type="primary"
                plain
                @click="handleAddCondition(groupIndex, { unionLogic: OR })"
                >或条件</el-button
              >
            </div>
          </div>
        </div>
      </template>
    </el-form>

    <div class="flow-condition-action">
      <el-link
        icon="el-icon-plus"
        type="primary"
        plain
        @click="handleAddConditionGroup({ unionLogic: AND })"
        >且条件组</el-link
      >

      <el-link
        style="margin-left: 20px"
        icon="el-icon-plus"
        type="primary"
        plain
        @click="handleAddConditionGroup({ unionLogic: OR })"
        >或条件组</el-link
      >
    </div>

    <SubmitterPicker
      ref="picker"
      :show.sync="isSubmitterPickerVisible"
      multiple
      :title="computedPickerTitle"
      :default-selected="computedPickerValue"
      modal
      :append-to-body="true"
      :select-lock="type || 'user'"
      @onConfirm="handleConfirmPicker"
    ></SubmitterPicker>

    <TabTreePicker
      :is-show-project="type === 'project'"
      :is-show-company="type === 'company'"
      :show.sync="isTabTreePickerVisible"
      multiple
      :title="computedPickerTitle"
      :default-selected="computedPickerValue"
      modal
      :append-to-body="true"
      :exclude-types="[
        OrgNodeType.Department,
        OrgNodeType.ConstructUnit,
        OrgNodeType.ConstructUnitGroup
      ]"
      :select-lock="type || 'user'"
      @onConfirm="handleConfirmPicker"
    ></TabTreePicker>

    <PositionPicker
      title="选择岗位标签"
      list-key-name="nodeName"
      :show.sync="positionVisible"
      :role-list="computedPositionPickerValue"
      @addCallBack="handleCallBack"
    ></PositionPicker>

    <template slot="footer">
      <el-button class="process" type="primary" plain @click="handleClickCancel"
        >取消</el-button
      >
      <el-button class="process" type="primary" @click="handleClickConfirm"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
  import VueMfe from 'vue-mfe'
  import PropTypes from 'vue-types'
  import Node from './components/flow/helpers/Node'
  import { deepCopy } from './utils/index'
  import { checkBracketPairs } from './utils/checkFlowModel'
  import { groupToCondition, conditionToGroup } from './utils/conditionAdapters'
  import {
    getDefaultNodeType,
    getConditionLevelByNodeType
  } from './utils/pickerDataAdapters'
  import ref from '@/directives/ref'
  import * as OrgNodeType from '@/enums/orgNodeType'
  import { AND, LOGIC_SIGN_NAME, OR } from './constants/LOGICAL_SIGN'
  import {
    CONDITION_CODE_TYPES,
    CONDITION_FIELD_TYPES,
    CONDITION_TYPES,
    PEOPLE_TYPES,
    PEOPLE_PICKER_TYPES,
    PEOPLE_TYPES_KEY_MAP,
    PEOPLE_TYPES_TITLE,
    SELECTION_MAP
  } from './constants/ENUM_DEFINITIONS'
  import { START_USER_POST_LABEL } from './constants/CONDITION_ADDITION'

  const defaultConditionItem = {
    fieldKey: '',
    conditionType: '',
    conditionCode: 'string',
    value: '',
    key: Node.getUUID(),
    order: 1,
    leftBracket: false,
    rightBracket: false,
    unionLogic: null
  }

  export default {
    name: 'ConditionSettings',

    components: {
      TabTreePicker: () => VueMfe.Lazy('auth2.components.TabTreePicker'),
      PositionPicker: () => VueMfe.Lazy('auth2.components.PositionPicker'),
      SubmitterPicker: () => VueMfe.Lazy('auth2.components.SubmitterPicker')
    },

    directives: { ref },

    inheritAttrs: false,

    props: {
      // visible: PropTypes.bool.def(false),
      // eslint-disable-next-line
      node: PropTypes.instanceOf(Node).required,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          fieldKey: PropTypes.string.isRequired,
          fieldName: PropTypes.string.isRequired,
          fieldType: PropTypes.oneOf(Object.values(CONDITION_TYPES)).isRequired,
          fieldOptions: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired
            })
          )
        })
      ),
      usingConditionFields: PropTypes.object.def({})
    },

    data() {
      const nodeConditions = this.getValue('conditions').filter(
        (condition) =>
          condition &&
          condition.value &&
          condition.conditionCode &&
          condition.conditionType
      )

      let conditionsGroup = conditionToGroup(nodeConditions)

      if (!conditionsGroup || !conditionsGroup.length) {
        // default conditions array: outside group
        conditionsGroup = [[deepCopy(defaultConditionItem)]]
      }

      conditionsGroup.forEach((conditions) => {
        conditions.forEach((t) => {
          /* generates dynamic and unique UUID key for each node */
          if (!t.key) t.key = Node.getUUID()
          return t
        })
      })

      return {
        type: null,
        conditionRef: null,
        computedPickerVisible: false,
        positionVisible: false,
        form: {
          conditions: conditionsGroup
        },
        cloneConditions: deepCopy(nodeConditions)
      }
    },

    computed: {
      selectOptions() {
        return this.fields.map(({ fieldKey, fieldName }) => ({
          label: fieldName || '',
          value: fieldKey
        }))
      },

      originalTypes() {
        return this.fields.reduce((map, { fieldKey, fieldType } = {}) => {
          map[fieldKey] = fieldType
          return map
        }, {})
      },

      fieldTypes() {
        return this.fields.reduce((map, { fieldKey, fieldType } = {}) => {
          map[fieldKey] = CONDITION_FIELD_TYPES[fieldType]
          return map
        }, {})
      },

      fieldNames() {
        return this.fields.reduce((map, { fieldKey, fieldName } = {}) => {
          map[fieldKey] = fieldName
          return map
        }, {})
      },

      fieldOptions() {
        // fix: 单选 RADIO 类型无法显示 SELECT>OPTIONS 组件
        function isSelectable(type) {
          return (
            type === CONDITION_TYPES.COMBO || type === CONDITION_TYPES.RADIO
          )
        }

        return this.fields.reduce(
          (map, { fieldKey, fieldType, fieldOptions: options } = {}) => {
            if (isSelectable(fieldType) && options && options.length)
              map[fieldKey] = options
            return map
          },
          {}
        )
      },

      computedPickerTitle() {
        return '请选择' + PEOPLE_TYPES_TITLE[this.type]
      },

      computedPickerValue() {
        if (
          this.conditionRef &&
          typeof this.conditionRef === 'object' &&
          Array.isArray(this.conditionRef.value)
        ) {
          return this.conditionRef.value.map(({ name, sysNo, nodeType }) => ({
            sysNo: sysNo,
            nodeName: name,
            nodeType,
            key: this.isSubmitterPicker
              ? `${sysNo}-${PEOPLE_TYPES_KEY_MAP[this.type || 'user']}`
              : this.isTabTreePicker
              ? `${this.type}-${sysNo}-${nodeType ||
                  getDefaultNodeType(this.type)}`
              : ''
          }))
        } else {
          return []
        }
      },

      computedPositionPickerValue() {
        if (
          this.conditionRef &&
          typeof this.conditionRef === 'object' &&
          Array.isArray(this.conditionRef.value)
        ) {
          return this.conditionRef.value.map(({ name, sysNo }) => ({
            positionName: name,
            sysNo: sysNo,
            key: sysNo
          }))
        } else {
          return []
        }
      },

      computedConditions() {
        return groupToCondition(this.form.conditions)
      },

      isSubmitterPicker() {
        return (
          this.type === PEOPLE_TYPES.USER ||
          this.type === PEOPLE_TYPES.DEPARTMENT ||
          this.type === PEOPLE_TYPES.DEPARTMENT ||
          this.type === PEOPLE_TYPES.POSITION_LABEL
        )
      },

      isSubmitterPickerVisible: {
        get() {
          return this.isSubmitterPicker && this.computedPickerVisible
        },
        set(val) {
          if (!val) {
            this.type = null
            this.computedPickerVisible = false
          }

          return val
        }
      },

      isTabTreePicker() {
        return (
          this.type === PEOPLE_TYPES.PROJECT ||
          this.type === PEOPLE_TYPES.COMPANY
        )
      },

      isTabTreePickerVisible: {
        get() {
          return this.isTabTreePicker && this.computedPickerVisible
        },
        set(val) {
          if (!val) {
            this.type = null
            this.computedPickerVisible = false
          }

          return val
        }
      }
    },

    created() {
      this.AND = AND
      this.OR = OR
      this.LOGIC_SIGNS = LOGIC_SIGN_NAME
      this.OrgNodeType = OrgNodeType
    },

    methods: {
      /**
       * @description 如果 node 节点的 props 中已存在该值，则取它的值，否则取 defaultSettings 的默认值
       * @param {string} key key name
       * @returns {any*}
       */
      getValue(key) {
        if (
          this.node &&
          this.node.props &&
          this.node.props[key] !== undefined
        ) {
          return deepCopy(this.node.props[key])
        } else {
          return [deepCopy(defaultConditionItem)]
        }
      },

      getConditionTypes(condition) {
        const conditionCode = this.fieldTypes[condition.fieldKey]
        let conditionTypes = CONDITION_CODE_TYPES[condition.conditionCode]

        if (conditionCode && condition.conditionCode !== conditionCode) {
          condition.conditionCode = conditionCode
          conditionTypes = CONDITION_CODE_TYPES[condition.conditionCode]

          // 重置 条件类型
          if (
            condition.conditionType &&
            !conditionTypes[condition.conditionType]
          ) {
            condition.conditionType = ''
          }

          // 重置 条件value
          if (condition.value) {
            condition.value = ''
          }
        }

        return conditionTypes
      },

      getPickerType(condition) {
        return condition.fieldKey
          ? PEOPLE_PICKER_TYPES[this.originalTypes[condition.fieldKey]]
          : ''
      },

      isPosition(condition) {
        if (condition) {
          return condition.fieldKey === START_USER_POST_LABEL
        }
        return false
      },

      isMultipleType(condition) {
        return (
          condition &&
          condition.conditionType &&
          (condition.conditionType === SELECTION_MAP.EQUAL_ANY_ONE ||
            condition.conditionType === SELECTION_MAP.NE_ANY_ONE)
        )
      },

      handleConditionPickerRef(condition, ref) {
        if (!this.conditionValPickerRefMap) {
          this.conditionValPickerRefMap = new WeakMap()
        }

        if (ref) {
          if (
            !this.conditionValPickerRefMap.has(condition) ||
            this.conditionValPickerRefMap.get(condition) !== ref
          ) {
            this.conditionValPickerRefMap.set(condition, ref)
          }
        } else {
          this.conditionValPickerRefMap.delete(condition)
        }
      },

      handleConditionTypeChange(condition, value) {
        if (
          !this.isMultipleType({ conditionType: value }) &&
          Array.isArray(condition.value) &&
          condition.value.length > 1
        ) {
          condition.value = condition.value.slice(0, 1)
        }

        if (
          this.conditionValPickerRefMap &&
          this.conditionValPickerRefMap.has(condition)
        ) {
          const conditionValPickerRef = this.conditionValPickerRefMap.get(
            condition
          )

          if (conditionValPickerRef) {
            conditionValPickerRef.resetInputHeight()
          }
        }
      },

      handleConitionValueChange(condition, value) {
        if (Array.isArray(value)) {
          condition.value = value
        } else {
          condition.value = [value]
        }
      },

      getFieldOptions(condition) {
        if (this.getPickerType(condition) || this.isPosition(condition)) {
          return (condition.value || [])
            .map(
              ({ name, parentFullName }) =>
                `${name}${parentFullName ? '(' + parentFullName + ')' : ''}`
            )
            .join('、')
        } else {
          return this.fieldOptions[condition.fieldKey]
        }
      },

      /* update node model */
      handleUpdate(opts) {
        this.node && this.node.update(opts)
      },

      /* update node props */
      handleUpdateProps(optsOrkey) {
        this.node &&
          this.node.updateProps(
            typeof optsOrkey !== 'string'
              ? optsOrkey
              : {
                  [optsOrkey]: this[optsOrkey]
                }
          )
      },

      handleAddCondition(groupIndex, opts = {}) {
        this.form.conditions[groupIndex].push({
          ...defaultConditionItem,
          ...opts,
          key: Node.getUUID()
        })
      },

      handleAddConditionGroup(opts) {
        this.form.conditions.push([
          {
            ...defaultConditionItem,
            ...opts,
            key: Node.getUUID()
          }
        ])
      },

      handleRemoveCondition(groupIndex, index) {
        const group = this.form.conditions[groupIndex]
        group.splice(index, 1)

        if (!group.length) {
          this.handleRemoveConditionGroup(groupIndex)
        }

        this.checkConditionSymbol()
      },

      handleRemoveConditionGroup(index) {
        this.form.conditions.splice(index, 1)
        this.checkConditionSymbol()
      },

      checkConditionSymbol() {
        const group1st = this.form.conditions[0]
        const condition1st = group1st && group1st[0]

        // 检查首个条件组的首个条件是否存在 logic symbol
        if (condition1st.unionLogic !== null) {
          condition1st.unionLogic = null
        }
      },

      getGroupLogicSymbol(groupIndex) {
        const conditions = (this.form.conditions || [])[groupIndex] || []
        const firstCondition = conditions[0]

        if (firstCondition && firstCondition.unionLogic) {
          return firstCondition.unionLogic
        }

        return null
      },

      handleClickConfirm() {
        const conditions = this.computedConditions

        this.submitForm(() => {
          try {
            checkBracketPairs(conditions)
            this.handleUpdateProps({
              conditions: conditions.filter(
                ({ conditionCode, conditionType, fieldKey, value }) =>
                  conditionCode && conditionType && fieldKey && value
              )
            })
            this.node && this.node.read({ conditions, fields: this.fields })
            this.calcUsingConditionNumber()

            this.$emit('update:visible', false)
          } catch (e) {
            this.$message.warning(e.message)
            console.error(e)
          }
        })
      },

      calcUsingConditionNumber() {
        const oldConditionFields = this.cloneConditions.map((i) => i.fieldKey)
        const newConditionFields = this.computedConditions.map(
          (i) => i.fieldKey
        )

        oldConditionFields.forEach((i) => {
          this.usingConditionFields[i]--
        })

        newConditionFields.forEach((i) => {
          if (Reflect.has(this.usingConditionFields, i)) {
            this.usingConditionFields[i]++
          } else {
            this.$set(this.usingConditionFields, i, 1)
          }
        })

        Object.keys(this.usingConditionFields).forEach((i) => {
          if (this.usingConditionFields[i] === 0) {
            Reflect.deleteProperty(this.usingConditionFields, i)
          }
        })
      },

      handleClickCancel() {
        // this.resetForm()
        this.$emit('update:visible', false)
      },

      handleClickPickerInput(condition) {
        this.conditionRef = condition

        if (condition.fieldKey === START_USER_POST_LABEL) {
          this.positionVisible = true
        } else {
          this.type = this.getPickerType(condition)
          this.computedPickerVisible = true
        }
      },

      handleConfirmPicker(values) {
        if (this.conditionRef) {
          this.conditionRef.value = values.map(
            ({ sysNo, nodeName: name, nodeType }) => ({
              name,
              sysNo,
              nodeType,
              level: getConditionLevelByNodeType(nodeType)
            })
          )
        }
      },

      handleCallBack(values) {
        if (this.conditionRef) {
          this.conditionRef.value = values.map((i) => ({
            name: `${i.positionName}${
              i.parentFullName ? '(' + i.parentFullName + ')' : ''
            }`,
            sysNo: i.sysNo
          }))
        }
      },

      submitForm(resolve, reject) {
        this.$refs['conditionsForm'].validate((valid) => {
          if (valid) {
            resolve && resolve()
          } else {
            reject && reject()
            return false
          }
        })
      },

      resetForm() {
        this.$refs['conditionsForm'].resetFields()
      },

      handleChange(condition) {
        condition.value = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .flow-condition {
    /deep/.el-form-item--mini {
      margin-bottom: 0;
      height: 30px;
    }

    /deep/.el-form-item__content {
      height: 30px;
      line-height: 30px;
    }

    & + & {
      margin-top: 20px;
    }

    &-group {
      border: 1px dashed rgba(187, 187, 187, 1);
      border-top: 0;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;

      &__title {
        display: flex;
        flex: 1;
        align-items: center;
        min-height: 50px;
        padding: 10px 0 10px 15px;
        color: #101010;
        background-color: #f4f6f8;

        &-text {
          flex: 1;
        }

        &-del {
          /deep/.el-button {
            color: rgba(128, 128, 128, 1);

            &:hover {
              color: #2185f8;
            }
          }
        }
      }

      &__content {
        padding: 15px;
      }

      &__logic {
        margin: 10px 0;
      }
    }

    & + &-action {
      margin-top: 20px;
    }

    &-item {
      margin-bottom: 15px;

      &__logic {
        margin-bottom: 10px;
      }
    }

    &-remove {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-button {
        color: #f16e6e;
        font-size: 14px;

        &:hover {
          color: darken($color: #f16e6e, $amount: 10);
        }
      }
    }
  }
</style>
