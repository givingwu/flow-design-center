import Node from '../components/flow/helpers/Node'
import { needMergeFields } from '../components/flow/helpers/NodeUtils'
import { CONDITION_TYPES } from '../constants/ENUM_DEFINITIONS'
import { getNodeType } from './adapterHelpers'
import { deepMerge, flatten } from './index'

export const updateFieldsWithMerge = (newFields, nodeFields, nodeType) => {
  return needMergeFields(nodeType)
    ? mergeFields(newFields, nodeFields).map(
        ({ type, canWrite, canView, require, ...field }) => ({
          ...field,
          type,
          require: require || false,
          canView: canView !== undefined ? canView : true,
          canWrite:
            canWrite !== undefined
              ? canWrite
              : nodeCanWrite(nodeType) && fieldCanWrite(type)
        })
      )
    : []
}

export const updateFieldsWhenCreate = (fields) => (nodeType) => {
  return needMergeFields(nodeType)
    ? fields.map(({ type, require, ...item }) => ({
        ...item,
        type,
        require: require || false,
        canView: true,
        canWrite: nodeCanWrite(nodeType) && fieldCanWrite(type)
      }))
    : []
}

export const updateNodeProps = (flowModel, newFields) => {
  const { taskList = [] } = flowModel

  if (taskList && taskList.length) {
    taskList.forEach((taskNode) => {
      const nodeType = getNodeType(taskNode.taskType)

      if (
        taskNode.formFieldList &&
        taskNode.formFieldList.length &&
        nodeType !== Node.TYPE.END_NODE
      ) {
        taskNode.formFieldList = updateFieldsWithMerge(
          updateFieldsWhenCreate(convertToFlowFields(newFields))(nodeType),
          taskNode.formFieldList,
          nodeType === Node.TYPE.PARALLEL_NODE
            ? Node.TYPE.APPROVER_NODE
            : nodeType
        )
      }
    })
  }

  return flowModel
}

export const convertToFlowFields = (formFields) => {
  return formFields.map(({ type, name, model, options: { required } }) => ({
    type,
    fieldKey: model,
    fieldName: name,
    canView: true,
    canWrite: fieldCanWrite(type),
    require: required || false
  }))
}

/**
 * does field can be write by field.type
 * @param {string} type
 */
export const fieldCanWrite = (type) => type !== CONDITION_TYPES.SERIAL

/**
 * does node can be write by node.type
 * @param {string} type
 */
export const nodeCanWrite = (type) => type === Node.TYPE.SPONSOR_NODE

export const isSameFields = (newFields, oldFields) => {
  // 不处理其他情况
  if (newFields.length > oldFields.length) {
    return false
  }

  return getDiffFields(newFields, oldFields).length === 0
}

export const getDiffFields = (newFields, oldFields) => {
  const newFieldsMap = geneFieldsKeyMap(newFields)
  const oldFieldsMap = geneFieldsKeyMap(oldFields)
  const newKeys = Object.keys(newFieldsMap)
  const diffFields = []

  for (let i = 0; i < newKeys.length; i++) {
    const key = newKeys[i]
    const old = oldFieldsMap[key]

    if (!old) {
      diffFields.push(newFieldsMap[key])
    }
  }

  return diffFields
}

export const mergeFields = (newFields = [], nodeFields = []) => {
  const newFieldsMap = geneFieldsKeyMap(newFields)
  const nodeFieldsMap = geneFieldsKeyMap(nodeFields)
  const newKeys = Object.keys(newFieldsMap)

  for (let i = 0, l = newKeys.length; i < l; i++) {
    const key = newKeys[i]
    const field = nodeFieldsMap[key]

    if (field) {
      // // fix: 合并属性的顺序， 必须以 newFieldsMap[key] 为准- 2019.08.27
      newFieldsMap[key] = deepMerge(
        {},
        newFieldsMap[key], // new fields from formDesign page
        field, // old fields from node.props.fieldsList
        // fix: 合并属性的顺序， 以 node.props 为准。但是 require 属性
        // 需要以最新的 newFieldsMap[key] 为准 - 2019.08.28
        {
          require: (newFieldsMap[key] || {}).require
        }
      )
    }
  }

  return Object.values(newFieldsMap)
}

export const getStateFields = (state) => {
  const content =
    state.formContentObject || // for update mutation
    (state.approvalDatas.flowFormInfo || {}).formContentObject // for all state

  if (content && typeof content === 'object' && Array.isArray(content.fields)) {
    return content.fields
  }

  return []
}

export const geneFieldsKeyMap = (fields = []) => {
  return fields.reduce((map, curr) => {
    map[curr.key || curr.fieldKey] = curr
    return map
  }, {})
}

export const updateFormConditions = (flowConditions, formConditions) => {
  const flowConditionsMap = geneFieldsKeyMap(flatten(flowConditions))
  const formConditionsMap = geneFieldsKeyMap(formConditions)

  Object.keys(flowConditionsMap).forEach((key) => {
    if (formConditionsMap[key]) {
      const opts =
        formConditionsMap[key]['options'] ||
        (formConditionsMap[key]['options'] = {})

      if (!opts.required) {
        opts.required = true
      }
    }
  })
}
