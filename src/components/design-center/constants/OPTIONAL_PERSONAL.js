export const OPTIONAL_SCOPE_KEYS = {
  TENANT_ORGANIZATION: 'tenant_organization',
  UPPER_LEVEL_ORGANIZATION: 'upper_level_organization',
  LOWER_LEVEL_ORGANIZATION: 'lower_level_organization',
  THIS_LEVEL_ORGANIZATION: 'this_level_organization',
  DEPARTMENT: 'department',
  ASSIGN_POSITION_LABEL: 'assign_position_label',
  ASSIGN_POSITION: 'assign_position',
  ASSIGN_USER: 'assign_user'
}

export const OPTIONAL_SCOPE_TYPE_PICKER_KEYS = {
  [OPTIONAL_SCOPE_KEYS.TENANT_ORGANIZATION]: 0,
  [OPTIONAL_SCOPE_KEYS.LOWER_LEVEL_ORGANIZATION]: 1,
  [OPTIONAL_SCOPE_KEYS.THIS_LEVEL_ORGANIZATION]: 2,
  [OPTIONAL_SCOPE_KEYS.UPPER_LEVEL_ORGANIZATION]: 3,
  [OPTIONAL_SCOPE_KEYS.DEPARTMENT]: 4  
}

export const OPTIONAL_TYPE_ENUM = [
  { label: '自选单人', value: 'single' },
  { label: '自选多人', value: 'multiple' }
]

export const OPTIONAL_SCOPE_ENUM = [
  { label: '全公司', value: OPTIONAL_SCOPE_KEYS.TENANT_ORGANIZATION },
  { label: '当前组织本上级', value: OPTIONAL_SCOPE_KEYS.UPPER_LEVEL_ORGANIZATION },
  { label: '当前组织本下级', value: OPTIONAL_SCOPE_KEYS.LOWER_LEVEL_ORGANIZATION },
  { label: '当前组织本级', value: OPTIONAL_SCOPE_KEYS.THIS_LEVEL_ORGANIZATION },
  { label: '当前部门', value: OPTIONAL_SCOPE_KEYS.DEPARTMENT },
  { label: '指定岗位标签', value: OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION_LABEL },
  { label: '指定岗位', value: OPTIONAL_SCOPE_KEYS.ASSIGN_POSITION },
  { label: '指定成员', value: OPTIONAL_SCOPE_KEYS.ASSIGN_USER },
]

