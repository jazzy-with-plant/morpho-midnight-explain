# Morpho Midnight Explain

一个面向 DeFi 初学者的中英双语互动教学网站。右上角可随时切换中文 / English，选择会保存在当前浏览器中。网站用动画和可操作实验解释：

- variable-rate lending 的利率为什么会变化；
- fixed-rate lending 如何通过成交价格锁定期限成本；
- maturity 对债务状态和清算规则的影响；
- liquidity、refinancing、liquidation 与 oracle 风险；
- Morpho Midnight 为什么不是“普通借贷 + 固定利率”。

## 本地运行

项目是无构建依赖的静态网站：

```bash
python3 -m http.server 4173 --directory dist
```

然后访问 `http://127.0.0.1:4173`。

## 资料来源

- [Morpho Midnight](https://docs.morpho.org/learn/concepts/midnight/)
- [Morpho Midnight Liquidations](https://docs.morpho.org/learn/concepts/midnight/liquidations/)
- [Morpho Blue](https://docs.morpho.org/learn/concepts/blue/)
- [Morpho Interest Rate Model](https://docs.morpho.org/learn/concepts/irm/)

网站中的数字是教学示例，不是实时报价，也不是投资建议。
