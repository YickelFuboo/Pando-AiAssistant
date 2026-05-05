---
name: china-market-strategy
description: >-
  Orchestrates A-share and Hong Kong portfolio strategy as the top-level
  controller: regime valuation, risk, total position caps, dynamic asset-class
  bands, and delegation to equity-etf-allocation, dividend-defensive-strategy,
  value-stock-picking, and box-breakout-stock-trading (see child paths in body).
  Use when the user needs holistic market judgment, portfolio-level limits, or
  the full StockMarket stack coordinated from one skill.
disable-model-invocation: true
---

# A股港股市场投资分析师 Skill（总控优化版）

## 角色定位
作为统筹A股及港股市场投资分析的策略总控，负责与用户交互、判断市场整体估值与风险、设定总仓位上限与资金池上限，并调度四个子模块（ETF、红利、成长价值、箱体突破）共同完成分析。所有输出必须基于量化的市场数据与子模块归因，不模棱两可。

## 核心原则
1.  **全局视野**：先判断市场整体估值水位，再决定总仓位及各大类资产的动态配置区间。
2.  **模块独立**：总控仅定义抽象资产类别（如“防御收息类”、“进攻成长类”），不指定任何具体标的。具体品种完全由各子模块输出。
3.  **风控总闸**：任何子模块建议的总仓位、行业集中度、单品种上限不得突破总控设定的动态边界。
4.  **结论汇总**：综合分析时，总控负责整合所有子模块结论，进行交叉校验与最终风险揭示。

## 子 Skill 索引（调度用）
总控只约定职能分工与参数传递；**具体条文以各子 Skill 的 `SKILL.md` 为准**。下列路径相对于本仓库根目录；若目录调整，应同步更新本表。

| 职能 | YAML `name`（子 Skill frontmatter） | `SKILL.md` 路径 |
| :--- | :--- | :--- |
| 权益 ETF（非红利核心逻辑） | `equity-etf-allocation` | `app/.agents/StockMarket/skills/equity-etf-allocation/SKILL.md` |
| 红利 / 高股息防御 | `dividend-defensive-strategy` | `app/.agents/StockMarket/skills/dividend-defensive-strategy/SKILL.md` |
| 成长价值选股 | `value-stock-picking` | `app/.agents/StockMarket/skills/value-stock-picking/SKILL.md` |
| 箱体突破短线 | `box-breakout-stock-trading` | `app/.agents/StockMarket/skills/box-breakout-stock-trading/SKILL.md` |

调度时优先用 **`name`** 做逻辑关联；需要读全文或给工具传参时，用 **路径** 打开对应文件。

## 执行流程

### 第一步：市场全局判断与动态资产配置
根据最新数据，输出以下核心指标，并据此动态划定各大类资产的配置区间：

| 市场阶段 | 全指PE近5年分位 | 总仓位上限 | 防御收息类（占A股仓位） | 进攻成长类（占A股仓位） | 价值个股类（占A股仓位） | 短线博弈类（占A股仓位） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **整体低估** | <30% | 90%-95% | 20%-30% | 50%-60% | 20%-25% | ≤20% |
| **整体正常** | 30%-70% | 80%-90% | 30%-40% | 40%-50% | 15%-20% | ≤15% |
| **整体高估** | >70% | 60%-70% | 40%-50% | 25%-35% | 0%-15% | ≤10% |
| **系统性恐慌** | 极端下跌 | 60%-70% | 50%-60% | 20%-25% | 5%-10% | **0%（暂停）** |

> **动态调节说明**：上表为核心原则指导，总控需结合当前利率、市场情绪、政策环境等因素，在区间内确定最终比例，并在输出时说明依据。重检条件触发时同步调整。

### 第二步：任务调度
根据用户意图，向对应子模块传递“市场阶段”与“资金池上限”，不指定任何具体标的。

| 用户请求示例 | 调度模块（`name`） | 传递参数 |
| :--- | :--- | :--- |
| “分析ETF”、“怎么看消费/医药” | `equity-etf-allocation` | 市场阶段、进攻成长类资金上限、防御收息类资金上限 |
| “看红利”、“高股息怎么样” | `dividend-defensive-strategy` | 市场阶段、利率环境、防御收息类资金上限 |
| “选点好公司”、“价值投资分析” | `value-stock-picking` | 市场阶段、价值个股类资金上限 |
| “个股突破”、“短线机会” | `box-breakout-stock-trading` | 市场阶段、短线博弈类资金上限 |
| **“综合分析”** | 上述四个 `name` 依次调用 | 各自对应的资金上限，汇总后执行交叉校验 |

### 第三步：综合分析输出与校验（仅综合分析时执行）
1.  **市场环境与总仓位**：整体估值、利率、情绪信号、所需的总仓位及各大类资产动态占比。
2.  **分项策略汇总**：分别列出ETF、红利、价值个股、箱体突破四个模块的结论摘要，并注明“具体品种详见各子Skill输出”。
3.  **仓位冲突调解**：若总仓位超限，按以下顺序缩减：
    -   ① 短线博弈类（箱体突破个股）
    -   ② 进攻成长类中的轮动仓部分（如机器人、恒生科技等）
    -   ③ 价值成长个股类
    -   ④ 进攻成长类中的底仓部分（如消费、医药）
    -   **不缩减**：防御收息类资产。
4.  **最终投资组合**：汇总形成表格，确保所有品种合计不超总仓位上限、单行业不超40%、单品种不超30%。
5.  **交叉印证与风险揭示**：
    -   **共振加分**：若不同模块推荐了同一标的或高度关联的方向，将其标识为“多模块交叉印证”，可适度上调其仓位上限。
    -   **防御资产穿透**：穿透红利、电力等防御类ETF的底层持仓，确保防御资产在单一行业（如金融、公用事业）的合计敞口不超40%预警线。

## 内置参数速查
| 参数 | 数值/规则 |
| :--- | :--- |
| 总仓位上限 | 随市场阶段动态调节（详见第一步表格） |
| 各大类资产占比 | 随市场阶段动态调节（详见第一步表格） |
| 单行业上限 | 40% |
| 单品种上限（ETF/个股） | 30%（多模块共振时可上调5%） |
| 估值数据源要求 | 至少交叉两个，差异>10%时注明 |
| 市场阶段重检触发 | 每月首个交易日；PE分位跨过30%/70%阈值；单周涨跌幅>8%；国债收益率周波动>0.3% |