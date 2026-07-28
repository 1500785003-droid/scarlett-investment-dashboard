// ========== DATA ==========
const data = {
  "updateTime": "2026-07-28T01:30:00.000Z",
  "portfolio": {
    "totalValue": 120949,
    "totalCost": 147037,
    "totalPnL": -26088,
    "totalReturn": -0.177,
    "goldValue": 94177,
    "fundValue": 26772,
    "todayFundPnl": -920,
    "todayGoldPnl": 1020,
    "todayGoldPnL": 1020
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
      "value": 122549
    },
    {
      "date": "07-28",
      "value": 120949
    }
  ],
  "goldHistory": [
    {
      "date": "07-20",
      "price": 873
    },
    {
      "date": "07-21",
      "price": 887
    },
    {
      "date": "07-22",
      "price": 899
    },
    {
      "date": "07-23",
      "price": 896
    },
    {
      "date": "07-24",
      "price": 884
    },
    {
      "date": "07-27",
      "price": 894
    },
    {
      "date": "07-28",
      "price": 889.68
    }
  ],
  "allocation": [
    {
      "name": "黄金",
      "value": 94177,
      "color": "#f59e0b"
    },
    {
      "name": "偏股基金",
      "value": 9682.82,
      "color": "#ef4444"
    },
    {
      "name": "资源基金",
      "value": 3568.15,
      "color": "#3b82f6"
    },
    {
      "name": "指数基金",
      "value": 1139.01,
      "color": "#8b5cf6"
    }
  ],
  "funds": [
    {
      "code": "018957",
      "name": "中航机遇领航混合C",
      "category": "科技成长",
      "value": 6629.77,
      "cost": 9554.98,
      "pnl": -2925.21,
      "return": -0.3061,
      "suggestion": "持有观望，等待反弹减仓60%",
      "suggestClass": "suggest-sell",
      "priority": "high",
      "today": {
        "trend": "大跌",
        "change": "-7.00%",
        "changeAmount": -499,
        "sectorChange": "+3.99%",
        "sector": "CPO",
        "signal": "🔴 超跌",
        "action": "持有观察",
        "actionClass": "suggest-hold",
        "shortTerm": "今日大涨3.46%，板块领涨。亏损幅度仍较大，继续持有等待反弹。",
        "strategy": "今日大涨3.46%，板块反弹力度强。亏损22.81%，仍处于深度套牢状态。趁反弹评估是否减仓换宽基。"
      }
    },
    {
      "code": "025209",
      "name": "永赢先锋半导体智选混合C",
      "category": "半导体行业",
      "value": 3053.05,
      "cost": 4582.08,
      "pnl": -1529.03,
      "return": -0.3337,
      "suggestion": "持有观望，等待反弹减仓70%",
      "suggestClass": "suggest-sell",
      "priority": "high",
      "today": {
        "trend": "大跌",
        "change": "-7.50%",
        "changeAmount": -248,
        "sectorChange": "+0.29%",
        "sector": "存储芯片",
        "signal": "🔴 超跌",
        "action": "持有观察",
        "actionClass": "suggest-hold",
        "shortTerm": "今日微涨0.42%，跑输大盘。半导体板块分化，等待明确方向。",
        "strategy": "今日微涨0.42%，表现弱于大盘。亏损27.67%，深度套牢。半导体周期下行，等待反弹减仓。"
      }
    },
    {
      "code": "008327",
      "name": "东财中证通信技术主题指数C",
      "category": "通信行业",
      "value": 1139.01,
      "cost": 1676.35,
      "pnl": -537.34,
      "return": -0.3205,
      "suggestion": "持有观望，反弹清仓",
      "suggestClass": "suggest-sell",
      "priority": "medium",
      "today": {
        "trend": "大跌",
        "change": "-6.50%",
        "changeAmount": -79,
        "sectorChange": "+4.18%",
        "sector": "通信技术",
        "signal": "🔴 超跌",
        "action": "反弹减仓",
        "actionClass": "suggest-sell",
        "shortTerm": "今日大涨3.97%，通信板块领涨。仓位不重，趁反弹减仓。",
        "strategy": "今日大涨3.97%，板块强势反弹。亏损24.45%，仓位不大。行业主题基金波动大，趁反弹减仓换宽基。"
      }
    },
    {
      "code": "023037",
      "name": "中欧资源精选混合C",
      "category": "周期资源",
      "value": 3568.15,
      "cost": 3981.14,
      "pnl": -412.99,
      "return": -0.1037,
      "suggestion": "持有观察",
      "suggestClass": "suggest-hold",
      "priority": "medium",
      "today": {
        "trend": "小幅下跌",
        "change": "-1.50%",
        "changeAmount": -54,
        "sectorChange": "+2.34%",
        "sector": "有色金属",
        "signal": "🟡 观望",
        "action": "持有观察",
        "actionClass": "suggest-hold",
        "shortTerm": "今日上涨1.81%，有色板块表现不错。亏损幅度可控，继续持有观察。",
        "strategy": "今日上涨1.81%，资源股反弹。亏损7.37%，幅度不大。周期资源股不适合长期持有，等反弹后逐步减仓。"
      }
    },
    {
      "code": "006479",
      "name": "广发纳斯达克100ETF联接C",
      "category": "海外宽基",
      "value": 12381.71,
      "cost": 10190,
      "pnl": 2191.71,
      "return": 0.2151,
      "suggestion": "继续定投，逢低可加仓",
      "suggestClass": "suggest-buy",
      "priority": "high",
      "today": {
        "trend": "小幅下跌",
        "change": "-0.32%",
        "changeAmount": -40,
        "sectorChange": "-0.71%",
        "sector": "纳斯达克100",
        "signal": "🟡 观望",
        "action": "继续定投",
        "actionClass": "suggest-buy",
        "shortTerm": "今日下跌1.13%，纳指正常回调。长期向上趋势未变，定投继续。",
        "strategy": "今日下跌1.13%，属于正常回调。盈利20.52%，表现优秀。纳指100是核心资产，长期持有+定投不动摇。"
      }
    }
  ],
  "suggestions": [
    {
      "icon": "⚠️",
      "title": "A股暴跌，保持冷静",
      "content": "今日A股大跌，创业板指跌超7%，市场情绪极度恐慌。不要在恐慌中割肉，等待技术性反弹再执行减仓计划。保留现金，等待企稳信号。",
      "level": "high"
    },
    {
      "icon": "🥇",
      "title": "黄金避险属性凸显",
      "content": "股市暴跌背景下，黄金避险属性凸显。金价889.68元/克，接近900压力位。京东波段账户：到900可减仓5克，回调到880接回。",
      "level": "medium"
    },
    {
      "icon": "📉",
      "title": "弱势基金等反弹减仓",
      "content": "科技成长基金今日重挫，但暴跌日不是减仓时机。等待技术性反弹（通常5-10%）后坚决减仓，腾出来的钱换纳指100等优质宽基。",
      "level": "high"
    },
    {
      "icon": "📈",
      "title": "纳指100定投继续",
      "content": "纳指100是组合中唯一盈利的核心资产。继续定投。若美股跟随A股大跌是加仓良机。",
      "level": "low"
    }
  ],
  "transactions": [],
  "market": {
    "date": "07-28",
    "indices": [
      {
        "name": "科创50",
        "code": "000688.SH",
        "value": 1807.951,
        "change": 1.1613,
        "up": 43,
        "down": 7
      },
      {
        "name": "北证50",
        "code": "899050.BJ",
        "value": 1055.9161,
        "change": 2.3453,
        "up": 48,
        "down": 2
      },
      {
        "name": "深证成指",
        "code": "399001.SZ",
        "value": 14148.7307,
        "change": 2.7155,
        "up": 470,
        "down": 28
      },
      {
        "name": "创业板指",
        "code": "399006.SZ",
        "value": 3590.7872,
        "change": 3.1577,
        "up": 92,
        "down": 8
      },
      {
        "name": "上证指数",
        "code": "000001.SH",
        "value": 3858.245,
        "change": 1.1548,
        "up": 2031,
        "down": 165
      },
      {
        "name": "沪深300",
        "code": "399300.SZ",
        "value": 4702.4272,
        "change": 1.145,
        "up": 220,
        "down": 72
      }
    ],
    "upCount": 2904,
    "downCount": 282,
    "limitUp": 28,
    "limitDown": 65,
    "sentiment": "极寒",
    "northbound": {
      "total": -0.12,
      "shanghai": -0.12,
      "shenzhen": 0
    },
    "mainFlow": -1286,
    "uptrendSectors": [
      {
        "name": "00103320",
        "change": 4.4578,
        "strength": "强"
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
          "value": 91,
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
          "value": 91,
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
          "value": 9,
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
    "strategy": "07-27A股市场表现强势，上证指数上涨1.15%，市场情绪高涨。北向资金净流入-0.1亿，外资持续加仓。上涨家数2904家，赚钱效应良好。\n\n技术面分析：市场趋势向好，量能配合，可积极参与。\n\n操作策略：当前处于\"积极入场\"阶段。加仓 / 持有。建议仓位控制在70% - 90%。等待信号：关注量能能否持续放大。"
  }
};
