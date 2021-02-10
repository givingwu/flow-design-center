/**
 * 组织节点类型
 * 0平台；1公司；2子公司；3项目；4参建单位；5部门；
 * 70岗位；80用户；
 * 200子公司分组 300项目分组 400参建单位分组 500部门分组；
 */

/**
 * 平台
 */
export const Platform = 0

/**
 * 公司
 */
export const Company = 1

/**
 * 子公司
 */
export const SubCompany = 2

/**
 * 项目
 */
export const Project = 3

/**
 * 参建单位
 */
export const ConstructUnit = 4

/**
 * 部门
 */
export const Department = 5

export const Role = 70
export const User = 80

/**
 * 子公司分组
 */
export const SubCompanyGroup = 200

/**
 * 项目分组
 */
export const ProjectGroup = 300

/**
 * 参建单位分组
 */
export const ConstructUnitGroup = 400

/**
 * 部门分组
 */
export const DepartmentGroup = 500

/**
 * 总部机关
 */
export const CompanyDepartmentGroup = 501

/**
 * 直属项目
 */
export const CompanyProjectGroup = 301

export function toString(type) {
  switch (type) {
    case Company:
      return '公司'

    case SubCompany:
      return '子公司'

    case Project:
      return '项目'

    case ConstructUnit:
      return '参建单位'

    case Department:
      return '部门'

    case Role:
      return '岗位'

    case User:
      return '用户'
  }
}

export default {
  Platform,
  Company,
  SubCompany,
  Project,
  ConstructUnit,
  Department,

  Role,
  User,

  SubCompanyGroup,
  ProjectGroup,
  ConstructUnitGroup,
  DepartmentGroup,

  CompanyDepartmentGroup,
  CompanyProjectGroup,

  toString,
}
