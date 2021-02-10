/**
 * @readonly
 * @enum
 */
export default {
  // 发起人: Sponsor node => type: 'sponsor'
  SPONSOR_NODE: 'sponsor',

  // 审批人: Approver node => type: 'approver'
  APPROVER_NODE: 'approver',

  // 条件分支: Condition Branch node => type: 'condition-branch'
  CONDITION_BRANCH: 'cbs',
  CONDITION_NODE: 'condition',
  CONDITION_BRANCH_END: 'cbe',

  // 并行分支: ParallelBranch node => type: 'parallel-branch'
  PARALLEL_BRANCH: 'pbs',
  PARALLEL_NODE: 'parallel',
  PARALLEL_BRANCH_END: 'pbe',

  // 抄送/通知人: Carbon copy node => type: 'notifier'
  NOTIFIER_NODE: 'notifier',

  // 结束: End node => type: 'node'
  END_NODE: 'end',
}
