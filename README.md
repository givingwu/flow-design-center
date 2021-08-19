# flow-design-center

一个简单的流程图绘制工具。

![flow-design-center](./src/assets/images/flow-design-center.jpg)

## Features

- 内置发起人、审批人、并行分支、条件分支、抄送人等节点
- 支持自定义节点、扩展节点
- 内置两种数据结构(`LinkedList<Node>`, `FlowGraph<Node>`)
- 支持自定义数据转换，内置 [toJSON](./src/components/design-center/adapters/toJSON.js), [toModel](./src/components/design-center/adapters/toModel.js)

## Example

```bash
npm install
npm run serve
```

## Q & A

- Q: 是否可以在公司生产环境使用？
- A: 你可以大胆的投入生产环境使用，我司已使用此项目两年有余，而且接入到了其他 BU。（期间绘图及数据方面从没有跟我提过 bug, 欢迎来自社区的你提 issue）

## License

MIT

## Thanks

If it has any help, just give me a star to lights up my days.
