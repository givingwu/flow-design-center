import {
  PEOPLE_TYPES,
  PEOPLE_PICKER_TYPES,
} from '../constants/ENUM_DEFINITIONS'

/**
 * toPeopleModel
 * @param {{}[]} values
 * @param {string} type
 */
export const toPeopleModel = (values, type) => {
  switch (type) {
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.USER]:
      return values.map(({ userName, userSysNo }) => ({
        name: userName,
        sysNo: userSysNo,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.DEPARTMENT]:
      return values.map(({ departmentName, departmentSysNo }) => ({
        name: departmentName,
        sysNo: departmentSysNo,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.PROJECT]:
      return values.map(({ projectName, projectSysNo }) => ({
        name: projectName,
        sysNo: projectSysNo,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.COMPANY]:
      return values.map(({ organizationName, organizationSysNo }) => ({
        name: organizationName,
        sysNo: organizationSysNo,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.JOB]:
      return values.map(({ roleName, roleSysNo }) => ({
        name: roleName,
        sysNo: roleSysNo,
      }))
    default:
      break
  }
}

/**
 * toPeopleJSON
 * @param {{}[]} values
 * @param {string} type
 */
export const toPeopleJSON = (values, type) => {
  switch (type) {
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.USER]:
      return values.map(({ name, sysNo }) => ({
        userName: name,
        userSysNo: sysNo,
        unitType: type,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.DEPARTMENT]:
      return values.map(({ name, sysNo }) => ({
        departmentName: name,
        departmentSysNo: sysNo,
        unitType: type,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.PROJECT]:
      return values.map(({ name, sysNo }) => ({
        projectName: name,
        projectSysNo: sysNo,
        unitType: type,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.COMPANY]:
      return values.map(({ name, sysNo }) => ({
        organizationName: name,
        organizationSysNo: sysNo,
        unitType: type,
      }))
    case PEOPLE_PICKER_TYPES[PEOPLE_TYPES.JOB]:
      return values.map(({ name, sysNo }) => ({
        roleName: name,
        roleSysNo: sysNo,
        unitType: type,
      }))
    default:
      break
  }
}
