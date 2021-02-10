import {PEOPLE_TYPES} from './ENUM_DEFINITIONS'

/**
 * @type {string}
 * @description 发起人姓名
 */
export const START_INITIATOR = '_start_user_'

/**
 * @type {string}
 * @description 用户所属公司
 */
export const START_USER_ORG = '_start_user_org_'

/**
 * @type {string}
 * @description 用户所属部门
 */
export const START_USER_DEPARTMENT = '_start_user_department_'

/**
 * @type {string}
 * @description 用户所属角色
 */
export const START_USER_POST = '_start_user_post_'

/**
 * @type {string}
 * @description 用户所属项目
 */
export const START_USER_PROJECT = '_start_user_project_'

/**
 * @type {string}
 * @description 用户所属岗位标签
 */
export const START_USER_POST_LABEL = "_start_user_post_label_"

/**
 * @enum
 * SPONSOR_TYPE_ENUM
 * 发起人条件可选择类型枚举
 */
/* export const SPONSOR_TYPE_ENUM = {
  START_INITIATOR,
  START_USER_ORG,
  START_USER_DEPARTMENT,
  START_USER_POST,
  START_USER_PROJECT,
} */

/**
 * @constant
 * SPONSOR_TYPE_NAME
 * 发起人条件可选择类型名称
 */
export const SPONSOR_TYPE_NAME = {
  [START_INITIATOR]: '发起人姓名',
  [START_USER_ORG]: '发起人所属公司',
  [START_USER_DEPARTMENT]: '发起人所属部门',
  [START_USER_POST_LABEL]: '发起人所属岗位标签',
  // [START_USER_POST]: '发起人所属角色',
  [START_USER_PROJECT]: '发起人所属项目'
}

/**
 * @enum
 * SPONSOR_PICKER_TYPE
 * 发起人条件可选择类型的 picker type 枚举
 */
export const SPONSOR_PICKER_TYPE = {
  [START_INITIATOR]: PEOPLE_TYPES.USER,
  [START_USER_ORG]: PEOPLE_TYPES.COMPANY,
  [START_USER_DEPARTMENT]: PEOPLE_TYPES.DEPARTMENT,
  [START_USER_POST]: PEOPLE_TYPES.JOB,
  [START_USER_PROJECT]: PEOPLE_TYPES.PROJECT,
  [START_USER_POST_LABEL]: PEOPLE_TYPES.POSITION_LABEL
}
