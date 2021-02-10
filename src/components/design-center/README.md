# Flow

## API

```js
import Flow from './components/flow/helpers/Flow'
import Node from './components/flow/helpers/Node'

Flow.createNode(Node.Type)
```


## FEATURE

+ [ ] 增加项目级设置功能 **delay**
  1. [ ] 弹窗只能从项目选择
  2. [ ] 没有条件并行分支
  3. [ ] 审批人节点只有 角色 部门 指定人员 发起人自己
+ [x] 删除两个分支其中的一个分支时，将剩下的删除分支插入到 分支原先的 起始 和 结束 节点
+ [x] 创建新的条件分支，将当前节点的子节点插入到条件节点的第一分支
+ [x] 条件节点可以选择所有表单字段，如果被选择字段默认设置为 true

+ [x] 条件节点加上结束节点
+ [ ] 发布的时候提供一个公共校验 流程设计 的方法到 vuex
+ [x] 增加 选择多成员/项目/公司/部门/角色
+ [x] 单选下拉 只留 等于/不等于 作为选项


## TODO

+ [x] 分支节点正序列化 toModel 算法
+ [x] 分支节点反序列化 toJSON 算法
+ [x] 保存时候不校验节点状态，发布时候才校验
+ [x] **条件节点**表单字段 选择项 如果是 select ，则值的选择也需要是 select 状态


## FIXME

+ [x] 起始点的子节点无法被删除
+ [x] 分支节点反填充存在问题
+ [x] 分支节点下面再添加分支节点无效
+ [x] 表单操作字段未保存后跳到设计流程界面，审批节点在提交的时候未提交formFieldList字段的数据
+ [x] 条件节点子节点的 move 不工作
+ [x] 设计流程中审批节点默认属性为不可编辑
+ [x] 设计流程界面刷新，表单字段权限状态被全部勾选
+ [ ] 节点错误提示警示 ⚠️ reactive 未实时
+ [x] **条件节点**所有子节点会连接旧有的子节点
+ [x] **条件节点**必须校验其是否存在子节点
+ [x] **条件节点**的条件需要被校验是否有效并过滤
+ [x] 流程设计 需要返回原先存在的 `version`, `canCancel`, `remindTimeType`, `remindTimeValue` & `taskNodeApprovalDataType` 字段


### 节点字段权限

#### 支持节点
+ 发起人
  + `canView: true` 可见
  + `canWrite: true` 可见
+ 审批人
  + `canView: true` 可见
  + `canWrite: false` 可见
+ 抄送人
  + `canView: true` 可见
  + `canWrite: false` 不可见
