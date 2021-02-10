/**
 * @readonly
 * @description 节点类型常量
 */
export const FLOW_NODE_TYPES = {
  /**
   * 经办节点
   */
  OPERATION: 'operation', // "经办"

  /**
   * 审批节点
   */
  AUDIT: 'audit', // "审批"

  /**
   * 抄送节点
   */
  CC: 'cc', // "抄送"

  /**
   * 开始
   */
  START: 'start', // "开始"

  /**
   * 结束
   */
  END: 'end', // "结束"

  /**
   * 条件开始
   */
  START_EXCLUSIVE_GATEWAY: 'start_exclusive_gateway', // "条件开始"

  /**
   * 条件结束
   */
  END_EXCLUSIVE_GATEWAY: 'end_exclusive_gateway', // "条件结束"

  /**
   * 开始并行网关
   */
  START_PARALLEL_GATEWAY: 'start_parallel_gateway', // "开始并行网关"

  /**
   * 结束并行网关
   */
  END_PARALLEL_GATEWAY: 'end_parallel_gateway', // "结束并行网关"
}

/**
 * @readonly
 * @enum
 * @description 节点 Map 枚举 => { [key: string] => string }
 */
/* export const FLOW_NODE_TYPES_NAME = {
  [FLOW_NODE_TYPES.OPERATION]: '经办',
  [FLOW_NODE_TYPES.AUDIT]: '审批',
  [FLOW_NODE_TYPES.CC]: '抄送',
  [FLOW_NODE_TYPES.START]: '开始',
  [FLOW_NODE_TYPES.END]: '结束',
  [FLOW_NODE_TYPES.EXCLUSIVE_GATEWAY]: '条件分支',
  [FLOW_NODE_TYPES.START_PARALLEL_GATEWAY]: '开始并行网关',
  [FLOW_NODE_TYPES.END_PARALLEL_GATEWAY]: '结束并行网关',
} */

/**
 * @readonly
 * @enum
 * @description 参与人类型枚举 => { [key: string] => string }
 */
export const PARTICIPANT_TYPES = {
  /**
   * 任务参与人-角色
   */
  POSITION: 'position', // "角色" role

  /**
   * 任务参与人-部门
   */
  DEPARTMENT: 'department', // "部门" department

  /**
   * 任务参与人-指定人
   */
  ASSIGN: 'assign', // "指定人员" user

  /**
   * 任务参与人-发起人自选
   */
  OPTIONAL_PERSONNEL: 'optional_personnel', // "发起人自选"

  /**
   * 任务参与人-角色标签
   */
  POSITION_LABEL: 'position_label', // "角色标签"

  /**
   * 任务参与人-部门标签
   */
  DEPARTMENT_LABEL: 'department_label', // "部门标签"

  /**
   * 任务参与人-发起人自己
   */
  INITIATOR: 'initiator', // "发起人自己" // 不选，直接勾选

  /**
   * 任务参与人-表单里的角色
   */
  POSITION_OF_FORM: 'position_of_form', // "表单里的角色"

  /**
   * 任务参与人-表单里的部门
   */
  DEPARTMENT_OF_FORM: 'department_of_form', // "表单里的部门"

  /**
   * 任务参与人-表单部门中的角色
   */
  DEPARTMENT_POSITION_OF_FORM: 'department_position_of_form', // "表单部门中的角色"

  /**
   * 任务参与人-表单公司中的角色
   */
  ORGANIZATION_POSITION_OF_FORM: 'organization_position_of_form', // "表单公司中的角色"
}

/**
 * @readonly
 * @enum
 * @description 选择审批人弹层 picker 的类型枚举
 */
export const SUBMIT_PICKER_TYPES = {
  ROLE: 'role',
  USER: 'user',
  PROJECT: 'project',
  DEPARTMENT: 'department',
  ORGANIZATION: 'company',
}

/**
 * @readonly
 * @enum
 * @description 选择审批人弹层 picker 的 key 枚举
 */
export const SUBMIT_PICKER_KEYS = {
  [PARTICIPANT_TYPES.POSITION]: 'positionList',
  [PARTICIPANT_TYPES.POSITION_LABEL]: '',
  [PARTICIPANT_TYPES.POSITION_OF_FORM]: '',
  [PARTICIPANT_TYPES.DEPARTMENT]: 'departmentList',
  [PARTICIPANT_TYPES.DEPARTMENT_LABEL]: '',
  [PARTICIPANT_TYPES.DEPARTMENT_OF_FORM]: '',
  [PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM]: '',
  [PARTICIPANT_TYPES.INITIATOR]: '',
  [PARTICIPANT_TYPES.ASSIGN]: 'userList',
  [PARTICIPANT_TYPES.OPTIONAL_PERSONNEL]: '',
}

export const TRANSFER_TYPE = SUBMIT_PICKER_TYPES.USER

/**
 * @readonly
 * @enum
 * @description 参与人对应的各个弹层 picker 的类型枚举
 */
export const PARTICIPANT_PICKER_TYPES = {
  [PARTICIPANT_TYPES.POSITION]: SUBMIT_PICKER_TYPES.ROLE,
  [PARTICIPANT_TYPES.DEPARTMENT]: SUBMIT_PICKER_TYPES.DEPARTMENT,
  [PARTICIPANT_TYPES.ASSIGN]: SUBMIT_PICKER_TYPES.USER,
  [TRANSFER_TYPE]: SUBMIT_PICKER_TYPES.USER,
}

const USER_KEYS = {
  name: 'userName',
  value: 'userSysNo',
  type: SUBMIT_PICKER_TYPES.USER,
}

/**
 * @readonly
 * @enum
 * @description 参与人对应的各个弹层 picker 不同 type 的不同 key 枚举
 */
export const PARTICIPANT_PICKER_KEYS = {
  [PARTICIPANT_TYPES.POSITION]: {
    name: 'positionName',
    value: 'positionSysNo',
    type: SUBMIT_PICKER_TYPES.ROLE,
  },
  [PARTICIPANT_TYPES.DEPARTMENT]: {
    name: 'departmentName',
    value: 'departmentSysNo',
    type: SUBMIT_PICKER_TYPES.DEPARTMENT,
  },
  [PARTICIPANT_TYPES.ASSIGN]: USER_KEYS,
  [TRANSFER_TYPE]: USER_KEYS,
  [SUBMIT_PICKER_TYPES.ORGANIZATION]: {
    name: 'organizationName',
    value: 'organizationSysNo',
    type: SUBMIT_PICKER_TYPES.ORGANIZATION,
  },
  [PARTICIPANT_TYPES.POSITION_LABEL]: {
    name: 'positionLabelName',
    value: 'positionLabelSysNo',
    parentName: 'parentFullName',
    organizationType: 'organizationType',
    type: PARTICIPANT_TYPES.POSITION_LABEL,
  },
}

/**
 * @readonly
 * @description 表单字段类 key
 * @from 贺双双
 */
export const FORM_FIELDS_KEYS = {
  USER: 'user', // 选择人员
  DEPT: 'dept', // "选择部门"
  DEPARTMENT: 'department', // "选择部门"
  PROJECT: 'project', // "选择项目"
  COMPANY: 'company', // "选择公司"
  JOB: 'job', // "选择角色"
}

/**
 * @readonly
 * @enum
 * @description 表单字段类型 枚举
 * @from 贺双双
 */
export const FORM_FIELDS_TYPES = {
  // 表单里的角色
  [PARTICIPANT_TYPES.POSITION_OF_FORM]: FORM_FIELDS_KEYS.JOB,
  // 表单里的部门
  [PARTICIPANT_TYPES.DEPARTMENT_OF_FORM]: FORM_FIELDS_KEYS.DEPARTMENT,
  // 表单部门中的角色
  [PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM]: FORM_FIELDS_KEYS.DEPT,
  // 表单公司中的角色
  [PARTICIPANT_TYPES.ORGANIZATION_POSITION_OF_FORM]: FORM_FIELDS_KEYS.JOB,
}

/**
 * @readonly
 * @enum
 * @description 参与人 Map 枚举 => { [key: string] => string }
 */
export const PARTICIPANT_TYPES_NAME = {
  [PARTICIPANT_TYPES.POSITION_LABEL]: '岗位标签',
  [PARTICIPANT_TYPES.POSITION]: '岗位',
  // [PARTICIPANT_TYPES.DEPARTMENT]: '部门',
  [PARTICIPANT_TYPES.ASSIGN]: '指定人员',
  /* TODO: 暂时禁用 */
  [PARTICIPANT_TYPES.OPTIONAL_PERSONNEL]: '发起人自选',
  // [PARTICIPANT_TYPES.DEPARTMENT_LABEL]: '部门标签',
  [PARTICIPANT_TYPES.INITIATOR]: '发起人自己',
  // [PARTICIPANT_TYPES.POSITION_OF_FORM]: '表单里的角色',
  // [PARTICIPANT_TYPES.DEPARTMENT_OF_FORM]: '表单里的部门',
  // [PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM]: '表单部门中的角色',
  // [PARTICIPANT_TYPES.ORGANIZATION_POSITION_OF_FORM]: '表单公司中的角色',
}

/**
 * @readonly
 * @enum
 * @description 参与人数据模型 Map  => { [key: string] => Model<T> }
 */
export const PARTICIPANT_TYPES_MODEL = {
  /* 发起人自己： */
  [PARTICIPANT_TYPES.INITIATOR]: {
    type: PARTICIPANT_TYPES.INITIATOR,
  },
  /* 指定人员： */
  [PARTICIPANT_TYPES.ASSIGN]: {
    type: PARTICIPANT_TYPES.ASSIGN,
    /* [SUBMIT_PICKER_KEYS[PARTICIPANT_TYPES.ASSIGN]] */
    list: [
      {
        userName: '',
        userSysNo: 0,
      },
    ],
  },

  /* 角色： */
  [PARTICIPANT_TYPES.POSITION]: {
    /* [SUBMIT_PICKER_KEYS[PARTICIPANT_TYPES.POSITION]] */
    list: [
      {
        positionName: '', // roleName
        positionSysNo: 0, // roleSysNo
      },
    ],
    type: PARTICIPANT_TYPES.POSITION,
  },
  /* 表单中的角色： */
  [PARTICIPANT_TYPES.POSITION_OF_FORM]: {
    formFieldKey: 'required',
    type: PARTICIPANT_TYPES.POSITION_OF_FORM,
  },

  /* 部门： */
  [PARTICIPANT_TYPES.DEPARTMENT]: {
    /* [SUBMIT_PICKER_KEYS[PARTICIPANT_TYPES.DEPARTMENT]] */
    list: [
      {
        departmentName: '',
        departmentSysNo: 0,
      },
    ],
    type: PARTICIPANT_TYPES.DEPARTMENT,
  },
  /* 表单中的部门： */
  [PARTICIPANT_TYPES.DEPARTMENT_OF_FORM]: {
    formFieldKey: 'required' /* must be truly value */,
    type: PARTICIPANT_TYPES.DEPARTMENT_OF_FORM,
  },

  /* 表单部门中的角色： */
  [PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM]: {
    formFieldKey: 'required' /* must be truly value */,
    type: PARTICIPANT_TYPES.DEPARTMENT_POSITION_OF_FORM,
  },
  /* 表单公司中的角色： */
  [PARTICIPANT_TYPES.ORGANIZATION_POSITION_OF_FORM]: {
    formFieldKey: 'required' /* must be truly value */,
    type: PARTICIPANT_TYPES.ORGANIZATION_POSITION_OF_FORM,
  },
  /* 发起人自选： */
  [PARTICIPANT_TYPES.OPTIONAL_PERSONNEL]: {
    optionalScope: 'organization',
    optionalType: 'single',
    // specifiedList:
    list: [
      {
        name: 'string',
        sysNo: 0,
      },
    ],
    type: PARTICIPANT_TYPES.OPTIONAL_PERSONNEL,
  },
  /* 角色标签： */
  [PARTICIPANT_TYPES.POSITION_LABEL]: {
    // level: 'self_department',
    // positionLabelList
    list: [
      {
        positionLabelName: 'string',
        positionLabelSysNo: 0,
      },
    ],
    type: PARTICIPANT_TYPES.POSITION_LABEL,
  },
  /* 部门标签： */
  /* [PARTICIPANT_TYPES.DEPARTMENT_LABEL]: {
    list: [
      {
        departmentLabelName: 'string',
        departmentLabelSysNo: 0,
      },
    ],
    level: 'self',
    type: PARTICIPANT_TYPES.DEPARTMENT_LABEL,
  }, */
}

/**
 * @readonly
 * @description 等级类型常量
 */
export const LEVEL_TYPES = {
  /**
   * 标签层级-本部门
   */
  SELF_DEPARTMENT: 'self_department', // "本部门"
  /**
   * 标签层级-本级
   */
  SELF: 'self', // "本级"

  /**
   * 标签层级-上一级
   */
  UPPER_FIRST: 'upper_first', // "上一级"

  /**
   * 标签层级-上二级
   */
  UPPER_SECOND: 'upper_second', // "上二级"

  /**
   * 标签层级-公司级
   */
  ORGANIZATION: 'organization', // "公司级"

  /**
   * 标签层级-分公司级
   */
  BRANCH_ORGANIZATION: 'branch_organization', // "分公司级"
}

/**
 * @readonly
 * @enum
 * @description 等级 Map 枚举 => { [key: string]: string }
 */
export const LEVEL_TYPES_NAME = {
  [LEVEL_TYPES.SELF_DEPARTMENT]: '本部门',
  [LEVEL_TYPES.SELF]: '本级',
  [LEVEL_TYPES.UPPER_FIRST]: '上一级',
  [LEVEL_TYPES.UPPER_SECOND]: '上二级',
  [LEVEL_TYPES.ORGANIZATION]: '公司级',
  [LEVEL_TYPES.BRANCH_ORGANIZATION]: '分公司级',
}

/**
 * @readonly
 * @description 审批类型常量
 */
export const AUDIT_TYPES = {
  /**
   * 或签（一名审批人同意或拒绝即可）
   */
  CANDIDATE: 'candidate', // "或签"

  /**
   * 会签（须所有审批人同意）
   */
  COUNTERSIGN: 'countersign', // "会签"

  /**
   * 依次处理
   */
  // SEQUENTIAL: 'sequential', // "依次处理"
}

/**
 * @readonly
 * @enum
 * @description 审批 Map 枚举 => { [key: string]: string }
 */
export const AUDIT_TYPES_NAME = {
  /**
   * 依次处理
   */
  // [AUDIT_TYPES.SEQUENTIAL]: '依次处理（根据流程顺序）',

  /**
   * 会签（须所有审批人同意）
   */
  [AUDIT_TYPES.COUNTERSIGN]: '会签（须所有审批人同意）',

  /**
   * 或签（一名审批人同意或拒绝即可）
   */
  [AUDIT_TYPES.CANDIDATE]: '或签（一名审批人同意或拒绝即可）',
}

/**
 * @readonly
 * @description 无审批人时类型常量
 */
export const NO_AUDIT_TYPES = {
  /**
   * 自动通过
   */
  AUTO_COMPLETE: 'auto_complete', // "自动通过"),

  /**
   * 不允许提交
   */
  CANNOT_SUBMIT: 'cannot_submit', // "不允许提交");
}

/**
 * @readonly
 * @enum
 * @description 无审批人时 Map 枚举 => { [key: string]: string }
 */
export const NO_AUDIT_TYPES_NAME = {
  [NO_AUDIT_TYPES.AUTO_COMPLETE]: '自动通过',
  [NO_AUDIT_TYPES.CANNOT_SUBMIT]: '不允许提交',
}

/**
 * @readonly
 * @description 时间类型常量
 */
export const TIME_TYPES = {
  SECOND: 'S',
  MINUTE: 'M',
  HOUR: 'H',
  DAY: 'D',
}

/**
 * @readonly
 * @enum
 * @description 时间 Map 枚举 => { [key: string]: string }
 */
export const TIME_TYPES_NAME = {
  // [TIME_TYPES.SECOND]: '秒',
  [TIME_TYPES.MINUTE]: '分',
  [TIME_TYPES.HOUR]: '时',
  [TIME_TYPES.DAY]: '天',
}

/**
 * @readonly
 * @enum
 * @description 抄送 Map 枚举 => { [key: string]: string }
 */
export const CC_TYPES_NAME = {
  // [PARTICIPANT_TYPES.POSITION]:
  //   PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.POSITION],
  // [PARTICIPANT_TYPES.DEPARTMENT]:
  //   PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.DEPARTMENT],
  [PARTICIPANT_TYPES.POSITION_LABEL]:
    PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.POSITION_LABEL],
  [PARTICIPANT_TYPES.ASSIGN]: PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.ASSIGN],
  [PARTICIPANT_TYPES.INITIATOR]:
    PARTICIPANT_TYPES_NAME[PARTICIPANT_TYPES.INITIATOR],
}

/**
 * @readonly
 * @enum
 * @description 选人类型
 */
export const PEOPLE_TYPES = {
  USER: 'user',
  PROJECT: 'project',
  DEPARTMENT: PARTICIPANT_TYPES.DEPARTMENT,
  COMPANY: 'company',
  JOB: 'job',
  POSITION_LABEL: PARTICIPANT_TYPES.POSITION_LABEL,
}

// submitter-picker组件key值
export const PEOPLE_TYPES_KEY_MAP = {
  [SUBMIT_PICKER_TYPES.USER]: 80,
  [SUBMIT_PICKER_TYPES.PROJECT]: 3,
  [SUBMIT_PICKER_TYPES.DEPARTMENT]: 5,
  [SUBMIT_PICKER_TYPES.ORGANIZATION]: 2,
  [SUBMIT_PICKER_TYPES.ROLE]: 70,
}

/**
 * @readonly
 * @enum
 * @description 审批人弹层 picker 的类型枚举
 */
export const PEOPLE_PICKER_TYPES = {
  [PEOPLE_TYPES.USER]: SUBMIT_PICKER_TYPES.USER,
  [PEOPLE_TYPES.PROJECT]: SUBMIT_PICKER_TYPES.PROJECT,
  [PEOPLE_TYPES.DEPARTMENT]: SUBMIT_PICKER_TYPES.DEPARTMENT,
  [PEOPLE_TYPES.COMPANY]: SUBMIT_PICKER_TYPES.ORGANIZATION,
  [PEOPLE_TYPES.JOB]: SUBMIT_PICKER_TYPES.ROLE,
  [PEOPLE_TYPES.POSITION_LABEL]: PARTICIPANT_TYPES.POSITION_LABEL,
}

/**
 * @readonly
 * @enum
 * @description 审批人弹层 picker 的类型枚举
 */
export const PEOPLE_TYPES_TITLE = {
  [PEOPLE_PICKER_TYPES[PEOPLE_TYPES.USER]]: '成员',
  [PEOPLE_PICKER_TYPES[PEOPLE_TYPES.PROJECT]]: '项目',
  [PEOPLE_PICKER_TYPES[PEOPLE_TYPES.DEPARTMENT]]: '部门',
  [PEOPLE_PICKER_TYPES[PEOPLE_TYPES.COMPANY]]: '公司',
  [PEOPLE_PICKER_TYPES[PEOPLE_TYPES.JOB]]: '角色',
}

/**
 * @readonly
 * @description 条件字段类型常量
 */
export const CONDITION_TYPES = {
  STRING: 'string', // 文本
  TEXT: 'input', // 输入框
  TEXTAREA: 'textarea', // 输入区域
  RADIO: 'radio', // 单选
  COMBO: 'combo', // 多选
  LIST: 'system_list', // 单选/多选下拉框
  NUMBER: 'number', // 数字
  MONEY: 'amount', // 金额
  SERIAL: 'serial', // 流水号
  ...PEOPLE_TYPES,
}

/**
 * @readonly
 * @enum
 * @description 条件支持的选择人的类型 `system-list`
 */
export const CONDITION_PEOPLE_TYPES = {
  [PEOPLE_TYPES.USER]: CONDITION_TYPES.LIST,
  [PEOPLE_TYPES.PROJECT]: CONDITION_TYPES.LIST,
  [PEOPLE_TYPES.DEPARTMENT]: CONDITION_TYPES.LIST,
  [PEOPLE_TYPES.COMPANY]: CONDITION_TYPES.LIST,
  [PEOPLE_TYPES.JOB]: CONDITION_TYPES.LIST,
  [PEOPLE_TYPES.POSITION_LABEL]: CONDITION_TYPES.LIST,
}

/**
 * @readonly
 * @enum
 * @description 条件字段类型枚举
 */
export const CONDITION_FIELD_TYPES = {
  [CONDITION_TYPES.TEXT]: 'string',
  [CONDITION_TYPES.TEXTAREA]: 'string',
  [CONDITION_TYPES.RADIO]: 'radio',
  [CONDITION_TYPES.COMBO]: 'combo',
  [CONDITION_TYPES.NUMBER]: 'number',
  [CONDITION_TYPES.MONEY]: 'number',
  ...CONDITION_PEOPLE_TYPES,
}

/**
 * @readonly
 * @enum
 * @description 条件字段 key Map 枚举 => { [key: string]: string }
 */
export const CONDITION_FIELDS_NAME = {
  [CONDITION_TYPES.TEXT]: '单行文本',
  [CONDITION_TYPES.TEXTAREA]: '多行文本',
  [CONDITION_TYPES.RADIO]: '单选按钮组',
  [CONDITION_TYPES.COMBO]: '单选下拉框',
  [CONDITION_TYPES.NUMBER]: '数字',
  [CONDITION_TYPES.MONEY]: '金额',
}

/**
 * @readonly
 * @description 数字条件选项常量
 * 数字：
 */
export const NUMBER_CONDITION = {
  /**
   * 等于
   */
  EQUAL: 'equal',

  /**
   * 不等于
   */
  NE: 'not_equal',

  /**
   * 小于
   */
  LT: 'less_than',

  /**
   * 小于等于
   */
  LTE: 'less_than_equal',

  /**
   * 大于
   */
  GT: 'greater_than',

  /**
   * 大于等于
   */
  GTE: 'greater_than_equal',

  /**
   * 大于等于同时小于等于范围
   */
  // RANGE: 'range',
}

/**
 * @readonly
 * @enum
 * @description 数字条件选项 key map
 */
export const NUMBER_CONDITION_NAME = {
  [NUMBER_CONDITION.EQUAL]: '=',
  [NUMBER_CONDITION.NE]: '!=',
  [NUMBER_CONDITION.LT]: '<',
  [NUMBER_CONDITION.LTE]: '<=',
  [NUMBER_CONDITION.GT]: '>',
  [NUMBER_CONDITION.GTE]: '>=',
  // [NUMBER_CONDITION.RANGE]: '<= & >=',
}

/**
 * @readonly
 * @enum
 * @description 数字条件选项 key map
 */
export const NUMBER_SELECTION_MAP = {
  [NUMBER_CONDITION.EQUAL]: '等于',
  [NUMBER_CONDITION.NE]: '不等于',
  [NUMBER_CONDITION.LT]: '小于',
  [NUMBER_CONDITION.LTE]: '小于等于',
  [NUMBER_CONDITION.GT]: '大于',
  [NUMBER_CONDITION.GTE]: '大于等于',
  // [NUMBER_CONDITION.RANGE]: '范围',
}

/**
 * @readonly
 * @description 字符串条件选项常量
 * 字符串：：
 */
export const STRING_CONDITION = {
  /**
   * 等于
   */
  EQUAL: 'equal',
  /**
   * 不等于
   */
  NE: 'not_equal',
  /**
   * 包含
   */
  CONTAINS: 'contains',
  /**
   * 不包含
   */
  NOT_CONTAINS: 'not_contains',
}

/**
 * @readonly
 * @enum
 * @description 字符串条件选项 key map
 */
export const STRING_SELECTION_MAP = {
  [STRING_CONDITION.EQUAL]: '等于',
  [STRING_CONDITION.NE]: '不等于',
  [STRING_CONDITION.CONTAINS]: '包含',
  [STRING_CONDITION.NOT_CONTAINS]: '不包含',
}

export const SELECTION_MAP = {
  /**
   * 等于任意一个
   */
  EQUAL_ANY_ONE: 'equal_any_one',

  /**
   * 不等于任何一个
   */
  NE_ANY_ONE: 'not_equal_any_one',
}

/**
 * @readonly
 * @enum {Object<string, string>}
 * @description 组合选项下拉框提示文本
 */
export const COMBO_SELECTION_MAP = {
  [SELECTION_MAP.EQUAL_ANY_ONE]: '等于任意一个',
  [SELECTION_MAP.NE_ANY_ONE]: '不等于任意一个',
}

/**
 * @readonly
 * @enum {Object<string, string>}
 * @description 单个选项下拉框提示文本
 */
export const RADIO_SELECTION_MAP = {
  [STRING_CONDITION.EQUAL]: '等于',
  [STRING_CONDITION.NE]: '不等于',
  ...COMBO_SELECTION_MAP,
}

/**
 * @readonly
 * @enum {Object<string, any>}
 * @description condition code 类型枚举
 */
export const CONDITION_CODE_TYPES = {
  [CONDITION_TYPES.STRING]: STRING_SELECTION_MAP,
  [CONDITION_TYPES.NUMBER]: NUMBER_SELECTION_MAP,
  [CONDITION_TYPES.RADIO]: RADIO_SELECTION_MAP,
  [CONDITION_TYPES.COMBO]: RADIO_SELECTION_MAP, // 下拉框包含多选
  [CONDITION_TYPES.LIST]: COMBO_SELECTION_MAP,
}
