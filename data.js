// ========== DATA ==========
const data = {
  "updateTime": "2026-07-29T13:42:46.631Z",
  "portfolio": {
    "totalValue": 124509,
    "totalCost": 143825,
    "totalPnL": -19316,
    "totalReturn": -0.134,
    "goldValue": 94630,
    "fundValue": 29879
  },
  "history": [
    {
      "date": "07-20",
      "value": 125000
    },
    {
      "date": "07-21",
      "value": 124500
    },
    {
      "date": "07-22",
      "value": 123800
    },
    {
      "date": "07-23",
      "value": 122500
    },
    {
      "date": "07-24",
      "value": 121453
    },
    {
      "date": "07-27",
      "value": 122318
    },
    {
      "date": "07-28",
      "value": 120949
    },
    {
      "date": "07-29",
      "value": 121102
    }
  ],
  "goldHistory": [
    {
      "date": "07-20",
      "price": 876.12
    },
    {
      "date": "07-21",
      "price": 884.45
    },
    {
      "date": "07-22",
      "price": 893.24
    },
    {
      "date": "07-23",
      "price": 893.45
    },
    {
      "date": "07-24",
      "price": 880.04
    },
    {
      "date": "07-27",
      "price": 889.68
    },
    {
      "date": "07-28",
      "price": 889.68
    },
    {
      "date": "07-29",
      "price": 889.68
    }
  ],
  "allocation": [
    {
      "name": "黄金",
      "value": 94630,
      "color": "#f59e0b"
    },
    {
      "name": "纳指100",
      "value": 10090.4,
      "color": "#10b981"
    },
    {
      "name": "偏股基金",
      "value": 9473.97,
      "color": "#ef4444"
    },
    {
      "name": "资源基金",
      "value": 4031.27,
      "color": "#3b82f6"
    },
    {
      "name": "指数基金",
      "value": 1671.57,
      "color": "#8b5cf6"
    }
  ],
  "funds": [
    {
      "code": "006479",
      "name": "广发纳斯达克100ETF联接C",
      "category": "海外宽基",
      "value": 10090.4,
      "cost": 10190,
      "pnl": -99.6,
      "return": -0.0098,
      "suggestion": "继续定投",
      "suggestClass": "suggest-buy",
      "priority": "high",
      "today": {
        "trend": "震荡整理",
        "change": "-0.98%",
        "signal": "🟡 定投日执行",
        "action": "按计划定投",
        "actionClass": "suggest-buy",
        "shortTerm": "未来2-3个交易日预计震荡为主，纳指受美股科技股走势影响，关注美联储政策动向。长期向上趋势未变。",
        "strategy": "今日下跌0.98%，纳指100长期向上趋势未破。定投日按计划执行，不要因为涨跌改变定投节奏。若单日跌超3%可考虑额外加仓。这是组合里的核心持仓，坚定长期持有。"
      }
    },
    {
      "code": "018957",
      "name": "中航机遇领航混合C",
      "category": "科技成长",
      "value": 9473.97,
      "cost": 9554.98,
      "pnl": -81.01,
      "return": -0.0085,
      "suggestion": "持有观察",
      "suggestClass": "suggest-hold",
      "priority": "high",
      "today": {
        "trend": "震荡整理",
        "change": "-0.85%",
        "signal": "🔴 逢高减仓",
        "action": "反弹减仓",
        "actionClass": "suggest-sell",
        "shortTerm": "未来2-3个交易日预计震荡为主，关注大盘成交量和北向资金流向，等待方向明朗。",
        "strategy": "今日下跌0.85%，弱势格局明显。下跌趋势中不要补仓摊低成本！等待反弹3-5%时坚决减仓，腾出来的钱换纳指100或沪深300等宽基指数。行业主题基金不适合长期死扛。"
      }
    },
    {
      "code": "023037",
      "name": "中欧资源精选混合C",
      "category": "周期资源",
      "value": 4031.27,
      "cost": 3981.14,
      "pnl": 50.13,
      "return": 0.0126,
      "suggestion": "持有观察",
      "suggestClass": "suggest-hold",
      "priority": "medium",
      "today": {
        "trend": "小幅上涨",
        "change": "+1.26%",
        "signal": "🟢 持有",
        "action": "持有",
        "actionClass": "suggest-buy",
        "shortTerm": "未来2-3个交易日预计震荡偏弱，周期股受大宗商品价格影响，不建议长期持有。",
        "strategy": "今日上涨1.26%，周期资源股波动大。亏损幅度不大的话先持有观察，等反弹减仓换稳健品种。周期股不适合长期持有，只适合波段操作。"
      }
    },
    {
      "code": "025209",
      "name": "永赢先锋半导体智选混合C",
      "category": "半导体行业",
      "value": 4611.3,
      "cost": 4582.08,
      "pnl": 29.22,
      "return": 0.0064,
      "suggestion": "持有观察",
      "suggestClass": "suggest-hold",
      "priority": "high",
      "today": {
        "trend": "震荡整理",
        "change": "+0.64%",
        "signal": "🔴 逢高减仓",
        "action": "反弹减仓",
        "actionClass": "suggest-sell",
        "shortTerm": "未来2-3个交易日预计震荡为主，关注大盘成交量和北向资金流向，等待方向明朗。",
        "strategy": "今日上涨0.64%，弱势格局明显。下跌趋势中不要补仓摊低成本！等待反弹3-5%时坚决减仓，腾出来的钱换纳指100或沪深300等宽基指数。行业主题基金不适合长期死扛。"
      }
    },
    {
      "code": "008327",
      "name": "东财中证通信技术主题指数C",
      "category": "通信行业",
      "value": 1671.57,
      "cost": 1676.35,
      "pnl": -4.78,
      "return": -0.0029,
      "suggestion": "反弹清仓",
      "suggestClass": "suggest-sell",
      "priority": "medium",
      "today": {
        "trend": "震荡整理",
        "change": "-0.28%",
        "signal": "🔴 逢高减仓",
        "action": "反弹减仓",
        "actionClass": "suggest-sell",
        "shortTerm": "未来2-3个交易日预计震荡为主，关注大盘成交量和北向资金流向，等待方向明朗。",
        "strategy": "今日下跌0.28%，弱势格局明显。下跌趋势中不要补仓摊低成本！等待反弹3-5%时坚决减仓，腾出来的钱换纳指100或沪深300等宽基指数。行业主题基金不适合长期死扛。"
      }
    }
  ],
  "suggestions": [
    {
      "icon": "🥇",
      "title": "黄金震荡观望",
      "content": "金价处于震荡区间，京东波段账户按网格策略操作，不到价格不操作。支付宝长期持有账户不动。",
      "level": "medium"
    },
    {
      "icon": "📈",
      "title": "纳指100定投继续",
      "content": "广发纳指100今日-0.98%，长期向上趋势未变。定投日按计划执行，这是组合里的优质核心资产。",
      "level": "low"
    }
  ],
  "transactions": [],
  "market": {
    "date": "07-29",
    "indices": [
      {
        "name": "科创50",
        "code": "000688.SH",
        "value": 1678.7376,
        "change": -0.8705,
        "up": 36,
        "down": 0
      },
      {
        "name": "深证成指",
        "code": "399001.SZ",
        "value": 13658.4438,
        "change": 1.1012,
        "up": 400,
        "down": 0
      },
      {
        "name": "北证50",
        "code": "899050.BJ",
        "value": 1064.2886,
        "change": 0.855,
        "up": 40,
        "down": 0
      },
      {
        "name": "创业板指",
        "code": "399006.SZ",
        "value": 3378.6964,
        "change": 1.5529,
        "up": 62,
        "down": 0
      },
      {
        "name": "上证指数",
        "code": "000001.SH",
        "value": 3828.469,
        "change": 0.3974,
        "up": 1726,
        "down": 0
      },
      {
        "name": "沪深300",
        "code": "399300.SZ",
        "value": 4600.2624,
        "change": 0.6727,
        "up": 230,
        "down": 0
      }
    ],
    "upCount": 2494,
    "downCount": 0,
    "limitUp": 28,
    "limitDown": 65,
    "sentiment": "火热",
    "northbound": {
      "total": -7.6,
      "shanghai": -7.6,
      "shenzhen": 0
    },
    "mainFlow": -1286,
    "uptrendSectors": [
      {
        "name": "00103320",
        "change": 0.4598,
        "strength": "弱"
      }
    ],
    "downtrendSectors": [
      {
        "name": "电力",
        "change": -3.87,
        "strength": "强"
      },
      {
        "name": "医药",
        "change": -3.56,
        "strength": "强"
      }
    ],
    "timing": {
      "signal": "bullish",
      "title": "积极入场",
      "subtitle": "市场环境良好，可以逐步加仓",
      "icon": "🟢",
      "action": "加仓 / 持有",
      "position": "70% - 90%",
      "waitSignal": "关注量能能否持续放大",
      "riskLevel": "中低风险（2/5）",
      "riskType": "success",
      "indicators": [
        {
          "name": "趋势强度",
          "value": 100,
          "label": "偏强",
          "type": "bullish"
        },
        {
          "name": "资金面",
          "value": 30,
          "label": "流出",
          "type": "bearish"
        },
        {
          "name": "赚钱效应",
          "value": 100,
          "label": "良好",
          "type": "bullish"
        },
        {
          "name": "估值水平",
          "value": 45,
          "label": "合理",
          "type": "neutral"
        },
        {
          "name": "情绪恐慌",
          "value": 0,
          "label": "乐观",
          "type": "bullish"
        },
        {
          "name": "量能水平",
          "value": 50,
          "label": "正常",
          "type": "neutral"
        }
      ]
    },
    "strategy": "07-29A股市场表现强势，上证指数上涨0.40%，市场情绪高涨。北向资金净流入-7.6亿，外资持续加仓。上涨家数2494家，赚钱效应良好。\n\n技术面分析：市场趋势向好，量能配合，可积极参与。\n\n操作策略：当前处于\"积极入场\"阶段。加仓 / 持有。建议仓位控制在70% - 90%。等待信号：关注量能能否持续放大。"
  }
};
