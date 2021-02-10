/**
 * all
 */
const ALL = 'all'

/**
 * priority
 */
const PRIORITY = 'priority'

/**
 * 审批优先级枚举
 * @enum
 */
export const APPROVE_ORDER_TYPE = {
  /**
   * 全部审批
   */
  ALL,

  /**
   * 按优先级审批
   */
  PRIORITY
}

/**
 * 审批优先级枚举文字
 * @enum
 */
export const APPROVE_ORDER_ENUM = {
  /**
   * All
   */
  [ALL]: '全部审批',

  /**
   * Priority
   */
  [PRIORITY]: '按优先级审批'
}
