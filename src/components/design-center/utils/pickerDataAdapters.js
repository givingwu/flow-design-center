import orgNodeType from '@/enums/orgNodeType'
import * as OrgNodeType from '@/enums/orgNodeType'
import * as CONDITION_LEVEL from '../constants/CONDITION_LEVEL'
import { SUBMIT_PICKER_TYPES } from '../constants/ENUM_DEFINITIONS'

export const getDefaultNodeType = (type) => {
  if (type === SUBMIT_PICKER_TYPES.ORGANIZATION) {
    return orgNodeType.Company
  } else if (type === SUBMIT_PICKER_TYPES.PROJECT) {
    return orgNodeType.Project
  }
}

export const getConditionLevelByNodeType = (type) => {
  if (type === OrgNodeType.Company) {
    return CONDITION_LEVEL.CURRENT_AND_SUBORDINATE
  } else if (type === OrgNodeType.SubCompany) {
    return CONDITION_LEVEL.CURRENT_AND_SUBORDINATE
  } else if (type === OrgNodeType.Project) {
    return CONDITION_LEVEL.CURRENT
  } else if (type === OrgNodeType.SubCompanyGroup) {
    return CONDITION_LEVEL.SUBORDINATE
  } else if (
    type === OrgNodeType.CompanyDepartmentGroup ||
    type === OrgNodeType.CompanyProjectGroup
  ) {
    return CONDITION_LEVEL.CURRENT
  }
}
