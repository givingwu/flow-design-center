<template>
  <SubmitterPicker
    v-bind="$attrs"
    multiple
    :title="computedTitle"
    :modal="false"
    :append-to-body="true"
    :modal-append-to-body="false"
    :select-lock="type"
    v-on="$listeners"
    @onConfirm="handlePickerConfirm"
  ></SubmitterPicker>
</template>

<script>
  import VueMfe from 'vue-mfe'
  import PropTypes from 'vue-types'
  import {
    PARTICIPANT_PICKER_KEYS,
    PARTICIPANT_TYPES,
    PARTICIPANT_TYPES_NAME,
    SUBMIT_PICKER_TYPES,
    TRANSFER_TYPE
  } from '../../constants/ENUM_DEFINITIONS'

  export default {
    name: 'BaseSubmitPicker',
    components: {
      SubmitterPicker: () => VueMfe.Lazy('auth2.components.SubmitterPicker')
    },
    inheritAttrs: false,
    props: {
      participantType: PropTypes.oneOf(
        Object.values(PARTICIPANT_TYPES).concat(TRANSFER_TYPE)
      ),
      type: PropTypes.oneOf(Object.values(SUBMIT_PICKER_TYPES)).def(
        SUBMIT_PICKER_TYPES.ROLE
      )
    },
    computed: {
      computedTitle() {
        return (
          '选择' +
          (PARTICIPANT_TYPES_NAME[this.participantType] || '转交候选人')
        )
      }
    },
    methods: {
      handlePickerConfirm(values) {
        const participantType = this.participantType
        const valuesList = values.map(({ nodeName, sysNo }) => {
          const { name, value, type } =
            participantType === PARTICIPANT_TYPES.OPTIONAL_PERSONNEL
              ? {}
              : PARTICIPANT_PICKER_KEYS[participantType]
          switch (participantType) {
            case TRANSFER_TYPE:
              return {
                name: nodeName,
                value: sysNo,
                hasUser: true,
                model: {
                  [name]: nodeName,
                  [value]: sysNo,
                  unitType: type
                }
              }

            case PARTICIPANT_TYPES.POSITION:
              return {
                name: nodeName,
                value: sysNo,
                hasUser: undefined,
                model: {
                  [name]: nodeName,
                  [value]: sysNo,
                  unitType: type
                }
              }

            case PARTICIPANT_TYPES.ASSIGN:
              return {
                name: nodeName,
                value: sysNo,
                hasUser: undefined,
                model: {
                  [name]: nodeName,
                  [value]: sysNo,
                  unitType: type
                }
              }

            case PARTICIPANT_TYPES.DEPARTMENT:
              return {
                name: nodeName,
                value: sysNo,
                hasUser: undefined,
                model: {
                  departmentName: nodeName,
                  departmentSysNo: sysNo,
                  unitType: this.type
                }
              }

            default:
              return {
                name: nodeName,
                sysNo: sysNo,
                model: {
                  name: nodeName,
                  sysNo: nodeName,
                  unitType: this.type
                }
              }
          }
        })

        this.$emit('update:show', false)
        this.$emit('confirm', valuesList)
      }
    }
  }
</script>
