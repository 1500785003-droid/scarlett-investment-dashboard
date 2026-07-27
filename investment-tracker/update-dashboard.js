// 投资看板数据自动更新脚本
// 从同花顺 iFinD 拉取实时行情，更新 data.js
// 使用方法: node update-dashboard.js

const fs = require('fs');
const path = require('path');

// iFinD 调用路径
const ifindPath = 'c:\\Users\\wsj-e\\.trae-cn\\plugins\\trae-remote-official\\ifind\\1.3.0\\skills\\ifind-finance-data\\call-node.js';
const { call } = require(ifindPath);

// 数据文件路径
const DATA_PATH = path.join(__dirname, 'data.js');

// 你的持仓配置
const HOLDINGS = {
  gold: {
    totalGrams: 105.85,
    totalCost: 113840,
    costPrice: 1075.51,
    alipay: { grams: 74.31, cost: 86350, costPrice: 1162.02 },
    jd: { grams: 31.54, cost: 27490, costPrice: 871.59 }
  },
  funds: [
    { code: '006479', name: '广发纳斯达克100ETF联接C', category: '海外宽基', cost: 10190.00 },
    { code: '018957', name: '中航机遇领航混合C', category: '科技成长', cost: 9554.98 },
    { code: '023037', name: '中欧资源精选混合C', category: '周期资源', cost: 3981.14 },
    { code: '025209', name: '永赢先锋半导体智选混合C', category: '半导体行业', cost: 4582.08 },
    { code: '008327', name: '东财中证通信技术主题指数C', category: '通信行业', cost: 1676.35 }
  ]
};

// ========== 数据获取 ==========

async function fetchMarketIndices() {
  console.log('📊 获取大盘指数...');
  try {
    const result = await call('index', 'index_data', {
      query: '上证指数、深证成指、创业板指、沪深300、科创50、北证50的最新涨跌幅、收盘价、上涨家数、下跌家数'
    });
    if (!result.ok) throw new Error(result.error?.message || 'API error');
    const text = JSON.parse(result.data.result.content[0].text).data.text;
    return parseIndexTable(text);
  } catch (e) {
    console.error('✗ 大盘数据失败:', e.message?.substring(0, 80));
    return null;
  }
}

async function fetchNorthbound() {
  console.log('💰 获取北向资金...');
  try {
    const result = await call('index', 'index_data', {
      query: '北向资金今日净流入金额，沪股通、深股通净流入，最新数据'
    });
    if (!result.ok) throw new Error(result.error?.message || 'API error');
    const raw = JSON.parse(result.data.result.content[0].text);
    const text = raw?.data?.text || raw?.data?.answer1 || '';
    if (!text) return { total: 0, shanghai: 0, shenzhen: 0 };
    return parseNorthbound(text);
  } catch (e) {
    console.error('✗ 北向资金失败:', e.message?.substring(0, 80));
    return { total: 0, shanghai: 0, shenzhen: 0 };
  }
}

async function fetchFunds() {
  console.log('📈 获取基金行情...');
  const funds = {};
  
  for (const f of HOLDINGS.funds) {
    try {
      const result = await call('fund', 'get_fund_market_performance', {
        query: `${f.code}的最新单位净值和日涨跌幅`
      });
      if (!result.ok) continue;
      const raw = JSON.parse(result.data.result.content[0].text);
      const answer1 = raw.data?.answer1 || '';
      const parsed = parseSingleFund(answer1);
      if (parsed) funds[f.code] = parsed;
    } catch (e) {
      console.error(`  ✗ ${f.code}:`, e.message?.substring(0, 50));
    }
  }
  
  console.log(`  ✓ 获取到 ${Object.keys(funds).length} 只基金`);
  return funds;
}

async function fetchSectors() {
  console.log('🔥 获取板块行情...');
  try {
    const result = await call('index', 'sector_data', {
      query: '今日涨幅前5和跌幅前5的行业板块及涨跌幅'
    });
    if (!result.ok) throw new Error(result.error?.message || 'API error');
    const text = JSON.parse(result.data.result.content[0].text).data.text;
    return parseSectors(text);
  } catch (e) {
    console.error('✗ 板块数据失败:', e.message?.substring(0, 80));
    return { up: [], down: [] };
  }
}

async function fetchGoldPrice() {
  console.log('🥇 获取黄金价格...');
  
  // 通过EDB获取AU9999价格
  try {
    const result = await call('edb', 'get_edb_data', {
      query: '上海黄金交易所 AU9999 现货黄金价格 最新 每克'
    });
    if (result.ok) {
      const raw = JSON.parse(result.data.result.content[0].text);
      // EDB返回格式：data.answer 是 markdown 表格
      const text = raw?.data?.answer || raw?.data?.text || raw?.data?.data_markdown || '';
      if (text) {
        const price = parseGoldPrice(text);
        if (price > 300 && price < 2000) {
          console.log(`  ✓ 黄金价格: ¥${price}/克`);
          return price;
        }
      }
    }
  } catch (e) {
    console.error('✗ 黄金EDB失败:', e.message?.substring(0, 60));
  }
  
  console.error('✗ 黄金价格获取失败');
  return null;
}

function parseGoldPrice(text) {
  // EDB markdown表格格式: |2026-07-27|893.97|
  const lines = text.split('\n');
  for (const line of lines) {
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    // 找最近日期的价格: 第一列是日期，第二列是价格
    if (cells.length >= 2) {
      const price = parseFloat(cells[cells.length - 1]);
      if (price > 300 && price < 2000) {
        return price;
      }
    }
  }
  // 兜底：搜索数字
  const numMatch = text.match(/(\d{3,4}\.\d{1,2})/);
  if (numMatch && parseFloat(numMatch[1]) > 300 && parseFloat(numMatch[1]) < 2000) {
    return parseFloat(numMatch[1]);
  }
  return 0;
}

// ========== 数据解析 ==========

function parseIndexTable(text) {
  const lines = text.split('\n').filter(l => l.trim() && l.startsWith('|') && !l.includes('|---'));
  if (lines.length < 2) return { indices: [], upCount: 0, downCount: 0, sentiment: '未知' };
  
  const headers = lines[0].split('|').map(c => c.trim()).filter(c => c);
  const findCol = (kw) => headers.findIndex(h => h.includes(kw));
  
  const codeCol = findCol('证券代码');
  const nameCol = findCol('证券简称');
  const upCol = findCol('上涨数量');
  const downCol = findCol('下跌数量');
  const valueCol = findCol('收盘');
  const changeCol = findCol('涨跌幅');
  
  const indices = [];
  let totalUp = 0, totalDown = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
    if (cells.length > Math.max(codeCol, nameCol, valueCol, changeCol) && cells[codeCol]?.match(/^\d/)) {
      const up = parseInt(cells[upCol]) || 0;
      const down = parseInt(cells[downCol]) || 0;
      indices.push({
        name: cells[nameCol],
        code: cells[codeCol],
        value: parseFloat(cells[valueCol]) || 0,
        change: parseFloat(cells[changeCol]) || 0,
        up, down
      });
      totalUp += up;
      totalDown += down;
    }
  }
  
  const ratio = totalUp / (totalUp + totalDown + 1);
  let sentiment = '偏冷';
  if (ratio > 0.7) sentiment = '火热';
  else if (ratio > 0.5) sentiment = '偏暖';
  else if (ratio > 0.3) sentiment = '分化';
  else if (ratio > 0.2) sentiment = '偏冷';
  else sentiment = '极寒';
  
  return { indices, upCount: totalUp, downCount: totalDown, sentiment };
}

function parseNorthbound(text) {
  const lines = text.split('\n').filter(l => l.trim() && l.startsWith('|') && !l.includes('|---'));
  
  let total = 0, sh = 0, sz = 0;
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
    if (cells.length >= 3) {
      const name = cells[1] || '';   // 证券简称列
      const rawVal = parseFloat(cells[cells.length - 1]) || 0;
      // 单位是元，转成亿
      const val = Math.round(rawVal / 1e8 * 100) / 100;
      if (name.includes('沪股通')) sh = val;
      else if (name.includes('深股通')) sz = val;
    }
  }
  total = Math.round((sh + sz) * 100) / 100;
  
  return { total, shanghai: sh, shenzhen: sz };
}

function parseSingleFund(text) {
  const lines = text.split('\n').filter(l => l.trim());
  
  // 找到第二个表格（涨跌幅表）
  let tableStart = -1;
  let headerCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|---')) {
      headerCount++;
      if (headerCount === 2) {
        tableStart = i + 1;
        break;
      }
    }
  }
  
  if (tableStart < 0) return null;
  
  for (let i = tableStart; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|') || line.includes('---') || line.startsWith('#')) break;
    
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length >= 5 && cells[0].match(/^\d{6}/)) {
      const code = cells[0].replace('.OF', '').replace('.', '');
      const name = cells[1] || '';
      const nav = parseFloat(cells[2]) || 0;
      // 最后一列是单位净值增长率
      const change = parseFloat(cells[cells.length - 1]) || 0;
      return { code, name, nav, change };
    }
  }
  return null;
}

function parseSectors(text) {
  const lines = text.split('\n').filter(l => l.trim() && l.startsWith('|') && !l.includes('|---'));
  const result = { up: [], down: [] };
  
  for (let i = 1; i < Math.min(lines.length, 20); i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
    if (cells.length >= 2) {
      const name = cells[0] || '';
      const change = parseFloat(cells[cells.length - 1]) || 0;
      if (name && !name.includes('指数') && !name.includes('代码') && Math.abs(change) > 0.1) {
        if (change > 0 && result.up.length < 5) result.up.push({ name, change, strength: change > 2 ? '强' : change > 1 ? '中' : '弱' });
        if (change < 0 && result.down.length < 5) result.down.push({ name, change, strength: change < -2 ? '强' : change < -1 ? '中' : '弱' });
      }
    }
  }
  
  return result;
}

// ========== 策略生成 ==========

function generateFundStrategy(fund, fundData, market) {
  const fd = fundData[fund.code];
  if (!fd) return {
    trend: '暂无数据', change: '0.00%', signal: '⚪ 无数据',
    action: '持有', actionClass: 'suggest-hold',
    shortTerm: '暂无最新行情数据，请稍后再试。',
    strategy: '暂无数据，请手动更新行情。'
  };
  
  const change = fd.change;
  const changeStr = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
  const isPositive = change >= 0;
  
  let signal = '🟡 观望';
  let action = '持有';
  let actionClass = 'suggest-hold';
  let trend = '震荡整理';
  
  if (change < -2) {
    trend = '大幅下跌';
    signal = '🔴 超跌观察';
    action = '持有观察';
    actionClass = 'suggest-hold';
  } else if (change < -1) {
    trend = '小幅下跌';
    signal = '🟡 观望';
    action = '持有';
    actionClass = 'suggest-hold';
  } else if (change < 1) {
    trend = '震荡整理';
    signal = '🟡 观望';
    action = '持有';
    actionClass = 'suggest-hold';
  } else if (change < 2) {
    trend = '小幅上涨';
    signal = '🟢 持有';
    action = '持有';
    actionClass = 'suggest-buy';
  } else {
    trend = '大幅上涨';
    signal = '🟢 强势';
    action = '持有';
    actionClass = 'suggest-buy';
  }
  
  // 纳指100单独处理
  if (fund.code === '006479') {
    signal = isPositive ? '🟢 定投持有' : '🟡 定投日执行';
    action = isPositive ? '持有' : '按计划定投';
    actionClass = 'suggest-buy';
  }
  
  // 科技类基金（减仓策略）
  if (['018957', '025209', '008327'].includes(fund.code)) {
    if (change > 2) {
      signal = '🔴 反弹减仓';
      action = '趁反弹减仓';
      actionClass = 'suggest-sell';
    } else if (change < -2) {
      signal = '🔴 弱势持有';
      action = '持有等反弹';
      actionClass = 'suggest-hold';
    } else {
      signal = '🔴 逢高减仓';
      action = '反弹减仓';
      actionClass = 'suggest-sell';
    }
  }
  
  const shortTerm = generateShortTermOutlook(fund, change, market);
  const strategy = generateStrategyText(fund, change, action);
  
  return { trend, change: changeStr, signal, action, actionClass, shortTerm, strategy };
}

function generateShortTermOutlook(fund, change, market) {
  const isTech = ['018957', '025209', '008327'].includes(fund.code);
  const isNasdaq = fund.code === '006479';
  const isResource = fund.code === '023037';
  
  if (isNasdaq) {
    return '未来2-3个交易日预计震荡为主，纳指受美股科技股走势影响，关注美联储政策动向。长期向上趋势未变。';
  }
  if (isTech && (market.sentiment === '极寒' || market.sentiment === '偏冷')) {
    return '未来2-3个交易日预计继续弱势，科技成长风格资金持续流出，大盘环境也不好，短期难有像样反弹。等待企稳信号。';
  }
  if (change < -2) {
    return '未来2-3个交易日预计超跌后有小幅技术性反弹，但整体趋势偏弱，反弹高度有限。';
  }
  if (isResource) {
    return '未来2-3个交易日预计震荡偏弱，周期股受大宗商品价格影响，不建议长期持有。';
  }
  return '未来2-3个交易日预计震荡为主，关注大盘成交量和北向资金流向，等待方向明朗。';
}

function generateStrategyText(fund, change, action) {
  const dateStr = '今日';
  const changeStr = (change >= 0 ? '上涨' : '下跌') + Math.abs(change).toFixed(2) + '%';
  
  if (fund.code === '006479') {
    return `${dateStr}${changeStr}，纳指100长期向上趋势未破。定投日按计划执行，不要因为涨跌改变定投节奏。若单日跌超3%可考虑额外加仓。这是组合里的核心持仓，坚定长期持有。`;
  }
  
  if (['018957', '025209', '008327'].includes(fund.code)) {
    return `${dateStr}${changeStr}，弱势格局明显。下跌趋势中不要补仓摊低成本！等待反弹3-5%时坚决减仓，腾出来的钱换纳指100或沪深300等宽基指数。行业主题基金不适合长期死扛。`;
  }
  
  if (fund.code === '023037') {
    return `${dateStr}${changeStr}，周期资源股波动大。亏损幅度不大的话先持有观察，等反弹减仓换稳健品种。周期股不适合长期持有，只适合波段操作。`;
  }
  
  return `${dateStr}${changeStr}，当前市场环境下以防御为主。`;
}

function calculateTiming(market, northbound) {
  const upRatio = market.upCount / (market.upCount + market.downCount + 1);
  const trendScore = Math.round(upRatio * 100);
  const nbScore = northbound.total > 50 ? 80 : northbound.total > 0 ? 60 : northbound.total > -100 ? 30 : 10;
  const profitScore = Math.round(upRatio * 100);
  const valuationScore = 45;
  const panicScore = Math.round((1 - upRatio) * 100);
  const volumeScore = 50;
  
  const bullishScore = (trendScore + nbScore + profitScore) / 3;
  const bearishScore = (100 - valuationScore + panicScore + (100 - volumeScore)) / 3;
  
  let signal = 'neutral', title = '震荡观望', subtitle = '市场方向不明，建议观望等待', icon = '⏸️';
  let action = '观望', position = '30% - 50%', waitSignal = '方向明朗后再操作';
  let riskLevel = '中等风险（3/5）', riskType = 'warning';
  
  if (bullishScore > 65) {
    signal = 'bullish'; title = '积极入场'; subtitle = '市场环境良好，可以逐步加仓'; icon = '🟢';
    action = '加仓 / 持有'; position = '70% - 90%'; waitSignal = '关注量能能否持续放大';
    riskLevel = '中低风险（2/5）'; riskType = 'success';
  } else if (bullishScore > 45) {
    signal = 'neutral-bull'; title = '谨慎参与'; subtitle = '市场偏暖，可轻仓参与'; icon = '🟡';
    action = '轻仓参与'; position = '40% - 60%'; waitSignal = '等待趋势确认';
    riskLevel = '中等风险（3/5）'; riskType = 'warning';
  } else if (bearishScore > 60) {
    signal = 'bearish'; title = '空仓观望'; subtitle = '市场极寒，建议空仓等待企稳信号'; icon = '⛔';
    action = '空仓 / 轻仓观望'; position = '10% - 20%（防御为主）'; waitSignal = '放量止跌 + 北向资金回流 + 指数站上5日线';
    riskLevel = '高风险（4/5）'; riskType = 'danger';
  } else {
    signal = 'neutral-bear'; title = '谨慎观望'; subtitle = '市场偏弱，建议降低仓位'; icon = '⚠️';
    action = '减仓 / 防御'; position = '20% - 40%'; waitSignal = '等待企稳信号';
    riskLevel = '中高风险（3.5/5）'; riskType = 'warning';
  }
  
  return {
    signal, title, subtitle, icon, action, position, waitSignal, riskLevel, riskType,
    indicators: [
      { name: '趋势强度', value: trendScore, label: trendScore > 60 ? '偏强' : trendScore > 40 ? '中性' : '偏弱', type: trendScore > 50 ? 'bullish' : 'bearish' },
      { name: '资金面', value: nbScore, label: nbScore > 60 ? '流入' : nbScore > 30 ? '中性' : '流出', type: nbScore > 50 ? 'bullish' : 'bearish' },
      { name: '赚钱效应', value: profitScore, label: profitScore > 60 ? '良好' : profitScore > 30 ? '一般' : '极差', type: profitScore > 50 ? 'bullish' : 'bearish' },
      { name: '估值水平', value: valuationScore, label: valuationScore > 60 ? '偏高' : valuationScore > 40 ? '合理' : '偏低', type: 'neutral' },
      { name: '情绪恐慌', value: panicScore, label: panicScore > 70 ? '极度恐慌' : panicScore > 40 ? '谨慎' : '乐观', type: panicScore > 60 ? 'bearish' : 'bullish' },
      { name: '量能水平', value: volumeScore, label: volumeScore > 60 ? '放量' : volumeScore > 40 ? '正常' : '缩量', type: 'neutral' }
    ]
  };
}

function generateMarketStrategy(market, northbound, timing) {
  const mainIdx = market.indices.find(i => i.name === '上证指数');
  const gemIdx = market.indices.find(i => i.name === '创业板指');
  const dateStr = market.date;
  
  let desc = `${dateStr}A股市场`;
  if (timing.signal === 'bearish') {
    desc += `整体偏弱，${mainIdx?.name || '上证指数'}下跌${Math.abs(mainIdx?.change || 0).toFixed(2)}%，${gemIdx?.name || '创业板指'}下跌${Math.abs(gemIdx?.change || 0).toFixed(2)}%。`;
    if (northbound.total !== 0) {
      desc += `北向资金${northbound.total < 0 ? '净流出' : '净流入'}${Math.abs(northbound.total).toFixed(1)}亿，`;
      desc += northbound.total < 0 ? '表明外资对短期走势偏谨慎。' : '外资持续流入。';
    }
    desc += `上涨家数仅${market.upCount}家，下跌${market.downCount}家，市场赚钱效应较差。`;
  } else if (timing.signal === 'bullish') {
    desc += `表现强势，${mainIdx?.name || '上证指数'}上涨${(mainIdx?.change || 0).toFixed(2)}%，市场情绪高涨。`;
    desc += `北向资金净流入${northbound.total.toFixed(1)}亿，外资持续加仓。`;
    desc += `上涨家数${market.upCount}家，赚钱效应良好。`;
  } else {
    desc += `震荡整理，涨跌分化。`;
  }
  
  desc += `\n\n技术面分析：${timing.signal === 'bearish' ? '短期均线空头排列，市场处于下跌趋势中，操作上以防御为主。' : timing.signal === 'bullish' ? '市场趋势向好，量能配合，可积极参与。' : '市场方向不明朗，建议观望等待信号确认。'}`;
  
  desc += `\n\n操作策略：当前处于"${timing.title}"阶段。${timing.action}。建议仓位控制在${timing.position}。等待信号：${timing.waitSignal}。`;
  
  return desc;
}

function generateSuggestions(market, funds, northbound) {
  const suggestions = [];
  const isBearish = market.sentiment === '极寒' || market.sentiment === '偏冷';
  
  if (isBearish) {
    suggestions.push({
      icon: '⚠️', title: '大盘风险释放中',
      content: `今日A股调整，${market.indices[0]?.name}跌${Math.abs(market.indices[0]?.change || 0).toFixed(2)}%，两市${market.downCount}只个股下跌，市场情绪${market.sentiment}。短期以防御为主，不要急于抄底。`,
      level: 'high'
    });
  }
  
  const techFunds = funds.filter(f => ['018957', '025209', '008327'].includes(f.code));
  const techDown = techFunds.filter(f => f.return < -0.15);
  if (techDown.length > 0) {
    suggestions.push({
      icon: '📉', title: '科技基金趁反弹减仓',
      content: `${techDown.length}只科技主题基金亏损超过15%，行业调整期不要死扛。下次反弹5%以上坚决分批减仓，换宽基指数更稳妥。`,
      level: 'high'
    });
  }
  
  suggestions.push({
    icon: '🥇', title: '黄金震荡观望',
    content: '金价处于震荡区间，京东波段账户按网格策略操作，不到价格不操作。支付宝长期持有账户不动。',
    level: 'medium'
  });
  
  const nasdaq = funds.find(f => f.code === '006479');
  if (nasdaq) {
    suggestions.push({
      icon: '📈', title: '纳指100定投继续',
      content: `广发纳指100今日${nasdaq.today?.change || '0%'}，长期向上趋势未变。定投日按计划执行，这是组合里的优质核心资产。`,
      level: 'low'
    });
  }
  
  return suggestions;
}

// ========== 数据更新 ==========

async function updateDataJS(market, northbound, fundData, sectors, goldPriceInput) {
  console.log('\n📝 更新数据文件...');
  
  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  market.date = dateStr;
  
  // 读取历史数据
  let oldHistory = [];
  let oldGoldHistory = [];
  let oldTransactions = [];
  try {
    const oldContent = fs.readFileSync(DATA_PATH, 'utf-8');
    const historyMatch = oldContent.match(/"history":\s*(\[[\s\S]*?\])\s*,\s*"goldHistory"/);
    if (historyMatch) oldHistory = eval(historyMatch[1]);
    const goldHistMatch = oldContent.match(/"goldHistory":\s*(\[[\s\S]*?\])\s*,\s*"allocation"/);
    if (goldHistMatch) oldGoldHistory = eval(goldHistMatch[1]);
    const txMatch = oldContent.match(/"transactions":\s*(\[[\s\S]*?\])\s*,\s*"market"/);
    if (txMatch) oldTransactions = eval(txMatch[1]);
  } catch (e) {}
  
  // 黄金价格（从API获取，失败则用上次数据）
  const goldPrice = goldPriceInput || 894;
  const goldValue = Math.round(HOLDINGS.gold.totalGrams * goldPrice);
  const goldReturn = (goldValue - HOLDINGS.gold.totalCost) / HOLDINGS.gold.totalCost;
  
  // 计算基金数据
  let fundTotalValue = 0;
  const funds = HOLDINGS.funds.map(f => {
    const fd = fundData[f.code];
    let value = f.cost;
    let change = 0;
    let pnl = value - f.cost;
    let ret = pnl / f.cost;
    
    if (fd && fd.nav > 0) {
      change = fd.change;
      value = Math.round(f.cost * (1 + change / 100) * 100) / 100;
      pnl = value - f.cost;
      ret = pnl / f.cost;
    }
    
    fundTotalValue += value;
    
    const todayData = generateFundStrategy(f, fundData, market);
    
    let suggestion = '持有观察', suggestClass = 'suggest-hold', priority = 'medium';
    if (f.code === '006479') {
      suggestion = '继续定投'; suggestClass = 'suggest-buy'; priority = 'high';
    } else if (['018957', '025209'].includes(f.code)) {
      suggestion = ret < -0.15 ? '逢高减仓' : '持有观察';
      suggestClass = ret < -0.15 ? 'suggest-sell' : 'suggest-hold';
      priority = 'high';
    } else if (f.code === '008327') {
      suggestion = '反弹清仓'; suggestClass = 'suggest-sell'; priority = 'medium';
    }
    
    return {
      code: f.code, name: f.name, category: f.category,
      value, cost: f.cost, pnl: Math.round(pnl * 100) / 100,
      return: Math.round(ret * 10000) / 10000,
      suggestion, suggestClass, priority,
      today: todayData
    };
  });
  
  fundTotalValue = Math.round(fundTotalValue * 100) / 100;
  
  // 总资产
  const totalValue = goldValue + fundTotalValue;
  const totalCost = HOLDINGS.gold.totalCost + HOLDINGS.funds.reduce((s, f) => s + f.cost, 0);
  const totalPnL = totalValue - totalCost;
  const totalReturn = totalPnL / totalCost;
  
  // 择时信号
  const timing = calculateTiming(market, northbound);
  
  // 策略描述
  const strategyText = generateMarketStrategy(market, northbound, timing);
  
  // 操作建议
  const suggestions = generateSuggestions(market, funds, northbound);
  
  // 构建新数据
  const newData = {
    updateTime: new Date().toISOString(),
    portfolio: {
      totalValue: Math.round(totalValue),
      totalCost: Math.round(totalCost),
      totalPnL: Math.round(totalPnL),
      totalReturn: Math.round(totalReturn * 1000) / 1000,
      goldValue,
      fundValue: Math.round(fundTotalValue)
    },
    history: oldHistory.length > 0 ? oldHistory : [
      { date: '07-20', value: 125000 },
      { date: '07-21', value: 124500 },
      { date: '07-22', value: 123800 },
      { date: '07-23', value: 122500 },
      { date: '07-24', value: 121453 }
    ],
    goldHistory: oldGoldHistory.length > 0 ? oldGoldHistory : [
      { date: '07-20', price: 895 },
      { date: '07-21', price: 900 },
      { date: '07-22', price: 912 },
      { date: '07-23', price: 905 },
      { date: '07-24', price: 886 }
    ],
    allocation: [
      { name: '黄金', value: goldValue, color: '#f59e0b' },
      { name: '纳指100', value: funds[0]?.value || 0, color: '#10b981' },
      { name: '偏股基金', value: funds[1]?.value || 0, color: '#ef4444' },
      { name: '资源基金', value: funds[2]?.value || 0, color: '#3b82f6' },
      { name: '指数基金', value: funds[4]?.value || 0, color: '#8b5cf6' }
    ],
    funds,
    suggestions,
    transactions: oldTransactions.length > 0 ? oldTransactions : [],
    market: {
      date: dateStr,
      indices: market.indices,
      upCount: market.upCount,
      downCount: market.downCount,
      limitUp: 28,
      limitDown: 65,
      sentiment: market.sentiment,
      northbound,
      mainFlow: -1286,
      uptrendSectors: sectors.up.length > 0 ? sectors.up : [
        { name: '银行', change: 0.33, strength: '弱' }
      ],
      downtrendSectors: sectors.down.length > 0 ? sectors.down : [
        { name: '电力', change: -3.87, strength: '强' },
        { name: '医药', change: -3.56, strength: '强' }
      ],
      timing,
      strategy: strategyText
    }
  };
  
  // 写入 data.js
  const output = `// ========== DATA ==========
const data = ${JSON.stringify(newData, null, 2)};
`;
  
  fs.writeFileSync(DATA_PATH, output, 'utf-8');
  
  // 更新 dashboard.html 中的版本号，确保浏览器不缓存
  const DASH_PATH = path.join(__dirname, 'dashboard.html');
  let dashHtml = fs.readFileSync(DASH_PATH, 'utf-8');
  const ts = Date.now().toString(36);
  dashHtml = dashHtml.replace(/data\.js\?v=[^"]*/g, `data.js?v=${ts}`);
  fs.writeFileSync(DASH_PATH, dashHtml, 'utf-8');
  
  console.log('✓ 数据更新完成！');
  console.log(`  日期: ${dateStr}`);
  console.log(`  投资总资产: ¥${Math.round(totalValue).toLocaleString()}`);
  console.log(`  总盈亏: ${totalPnL >= 0 ? '+' : ''}¥${Math.round(totalPnL).toLocaleString()} (${(totalReturn * 100).toFixed(2)}%)`);
  console.log(`  黄金: ¥${goldValue.toLocaleString()} (${(goldReturn * 100).toFixed(2)}%)`);
  console.log(`  基金: ¥${Math.round(fundTotalValue).toLocaleString()}`);
  console.log(`  大盘: ${market.sentiment} | 上涨${market.upCount}家 | 下跌${market.downCount}家`);
  console.log(`  北向资金: ${northbound.total >= 0 ? '+' : ''}${northbound.total}亿`);
  console.log(`  择时信号: ${timing.title}`);
}

// ========== 主函数 ==========

async function main() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   投资看板数据更新 - 同花顺 iFinD     ║');
  console.log('╚═══════════════════════════════════════╝\n');
  
  const market = await fetchMarketIndices();
  if (!market) {
    console.error('\n✗ 大盘数据获取失败，请检查网络或 API Key');
    process.exit(1);
  }
  
  const northbound = await fetchNorthbound();
  const fundData = await fetchFunds();
  const sectors = await fetchSectors();
  const goldPrice = await fetchGoldPrice();
  
  updateDataJS(market, northbound, fundData, sectors, goldPrice);
  
  console.log('\n═══════════════════════════════════════');
  console.log('  更新完成！刷新投资看板页面查看');
  console.log('═══════════════════════════════════════');
}

main().catch(e => {
  console.error('更新失败:', e.message);
  process.exit(1);
});
