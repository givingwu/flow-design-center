/** @typedef {{
  fieldKey: string,
  conditionType: string,
  conditionCode: string,
  value: string|object|boolean,
  key: string,
  order?: number,
  leftBracket: boolean,
  rightBracket: boolean,
  unionLogic?: null|'and'|'or',
}} Condition */

/**
 * To converts all conditions to be an array of group,
 * and it does not support the nested conditions array.
 * @param {Condition[]} conditions
 * @returns {Condition[][]}
 */
export function conditionToGroup(conditions = []) {
  let foundLeftBracketFlag = false
  let cacheItems = []
  const group = []

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i]

    if (condition) {
      if (condition.leftBracket && condition.rightBracket) {
        group.push([condition])
        cacheItems = []
      } else if (condition.leftBracket) {
        cacheItems.push(condition)

        if (!foundLeftBracketFlag) {
          foundLeftBracketFlag = true
        }
      } else if (condition.rightBracket) {
        cacheItems.push(condition)

        if (foundLeftBracketFlag) {
          foundLeftBracketFlag = false
        }

        group.push(cacheItems.slice())
        cacheItems = []
      } else {
        cacheItems.push(condition)
      }
    }
  }

  if (!group.length && cacheItems.length) {
    return [cacheItems]
  }

  return group
}

/**
 * To converts the group of conditions to be a flattened array
 * @param {Condition[][]} groups
 * @returns {Condition[]}
 */
export function groupToCondition(groups) {
  let order = 0
  const conditions = []

  for (const group of groups) {
    const lastIndex = group.length - 1

    for (let index = 0; index < group.length; index++) {
      const condition = { ...(group[index] || {}) }

      if (index === 0) {
        condition.leftBracket = true
      }

      if (index === lastIndex) {
        condition.rightBracket = true
      } else {
        condition.rightBracket = false
      }

      condition.order = order++
      conditions.push(condition)
    }
  }

  return conditions
}
