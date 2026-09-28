const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let currentLanguage = 'zh';
try {
  currentLanguage = localStorage.getItem('midnight-explain-language') === 'en' ? 'en' : 'zh';
} catch (_) {
  currentLanguage = 'zh';
}

const englishText = new Map(Object.entries({
  '两种利率': 'Two rate models',
  '到期日': 'Maturity',
  '风险实验': 'Risk lab',
  'Morpho 官方资料 ↗': 'Morpho official docs ↗',
  '借钱的价格，': 'The price of borrowing:',
  '会漂': 'floating',
  '，还是': ', or ',
  '会到期': 'fixed to a date',
  '？': '?',
  '浮动利率像打车计价器：市场越拥挤，价格可能越高。固定利率像提前买好的车票：价格锁定，但你必须记住到站时间。': 'A variable rate works like a taxi meter: when the market gets crowded, the price can rise. A fixed rate is like a ticket bought in advance: the price is locked, but the arrival time matters.',
  '开始 3 分钟实验': 'Start the 3-minute lab',
  '▶ 播放 45 秒速懂': '▶ Play the 45-second tour',
  '无需钱包 · 不连接主网 · 所有金额仅用于教学': 'No wallet · No mainnet connection · All amounts are illustrative',
  '同样借 10,000 USDC': 'Borrow the same 10,000 USDC',
  'Variable 浮动': 'Variable rate',
  'Fixed 固定': 'Fixed rate',
  '可借资金池': 'Available liquidity',
  '资金利用率 Utilization': 'Pool utilization',
  '当前借款年化': 'Current borrow APY',
  '一年后预计利息*': 'Estimated 1-year interest*',
  '资金池越接近借满，IRM 通常会把利率推高。它会继续变化，并非今天看到多少就锁定多少。': 'As the pool gets closer to fully borrowed, the IRM usually pushes the rate higher. The rate keeps moving; today’s number is not locked.',
  '现在收到': 'receive now',
  '到期偿还': 'repay at maturity',
  '单位成交价格 P': 'Unit trade price P',
  '距离到期': 'Time to maturity',
  '锁定的期限成本': 'Locked term cost',
  '隐含简单年化*': 'Implied simple APR*',
  '成交那一刻，单位价格就把这段期限的成本锁住。示例未计费用；真实成交成本来自订单报价。': 'At execution, the unit price locks the cost for this term. Fees are excluded here; real borrowing cost comes from executable order-book quotes.',
  '借多久不预设，但利率一路变化。': 'No preset end date, but the rate keeps changing.',
  '利率先锁定，但债务有明确终点。': 'The rate is locked, but the debt has a clear end date.',
  '它不是提醒日期，而是风险规则切换点。': 'Not just a reminder—the risk rules switch here.',
  '一条会弯的河，': 'A river that bends,',
  '一张有日期的票': 'a ticket with a date',
  '拖动上面的控件，你已经看到了最核心的区别。现在把它们拆开。': 'The controls above reveal the key difference. Now let’s unpack it.',
  '浮动利率：市场实时定价': 'Variable rate: repriced by the market',
  '在 Morpho Blue 这类市场里，利率由 IRM 计算，最重要的输入通常是资金利用率。': 'In markets such as Morpho Blue, an IRM computes the rate, with pool utilization usually being its most important input.',
  '利率': 'Rate',
  '利用率 →': 'Utilization →',
  '借款人多、可用流动性少，利率通常上升。': 'More borrowing and less available liquidity usually push rates up.',
  '还款或新增存款释放流动性，利率可能下降。': 'Repayments or new supply release liquidity, so rates may fall.',
  '没有固定到期日，但利息持续累积。': 'There is no fixed maturity, but interest keeps accruing.',
  '固定利率：成交价锁住期限成本': 'Fixed rate: the trade price locks term cost',
  '在 Morpho Midnight，借贷像交易一张到期支付 1 单位贷款资产的票据。': 'In Morpho Midnight, lending resembles trading a note that pays 1 unit of the loan asset at maturity.',
  '今天的单位价格': 'Unit price today',
  '到期偿还': 'Repay at maturity',
  '期限简单利率 = 1 / P − 1 = 5.26%': 'Simple term rate = 1 / P − 1 = 5.26%',
  '报价成交后，这一笔期限成本不再随资金池利用率漂移。': 'Once the quote executes, this position’s term cost no longer floats with pool utilization.',
  '剩余期限不同，同一个 5.26% 期限收益对应的年化并不同。': 'With a different time remaining, the same 5.26% term return implies a different annualized rate.',
  '锁住利率 ≠ 消除风险；你换来了明确的还款截止日。': 'Locking the rate does not remove risk; it gives you a firm repayment deadline.',
  'Maturity 是一扇门。': 'Maturity is a doorway.',
  '跨过去，规则会变。': 'Cross it, and the rules change.',
  '健康的抵押仓位，也不能把到期日当成普通日历提醒。': 'Even a well-collateralized position cannot treat maturity as an ordinary calendar reminder.',
  '当前位置': 'Current position',
  '到期前': 'Before maturity',
  '到期时刻': 'At maturity',
  '到期后': 'After maturity',
  '借款': 'Borrow',
  '到期门': 'deadline',
  '到期前 / 正好到期': 'Before / exactly at maturity',
  '先看抵押健康度': 'Check collateral health first',
  '债务 ≤ maxDebt：健康。': 'Debt ≤ maxDebt: healthy.',
  '债务 > maxDebt：可按健康路径清算。': 'Debt > maxDebt: health-based liquidation is available.',
  '严格晚于到期': 'Strictly after maturity',
  '未还债务本身就是触发条件': 'Outstanding debt becomes the trigger',
  '只要 debt > 0，即使抵押仍健康，也可走 post-maturity liquidation。': 'If debt > 0, post-maturity liquidation is available even when the collateral remains healthy.',
  '跟着一笔债务，走完它的一生': 'Follow one debt through its full life',
  '▶ 自动播放': '▶ Auto-play',
  '借款人': 'Borrower',
  '抵押品': 'Collateral',
  '市场': 'Market',
  '报价中': 'Quoting',
  '出借人': 'Lender',
  '资金': 'Funds',
  '按下冲击按钮，': 'Press a shock button',
  '看看风险从哪里冒出来': 'and watch risk surface',
  '本金 10,000 USDC，抵押品价值 15,000 USDC，LLTV 80%。': 'Debt: 10,000 USDC. Collateral value: 15,000 USDC. LLTV: 80%.',
  'USDC 等值': 'USDC value',
  '清算线 80%': 'Liquidation line 80%',
  '仓位健康': 'Position healthy',
  '，但风险不是零。': ', but risk is not zero.',
  'Oracle 报价下跌 20%': 'Oracle price falls 20%',
  '抵押品缩水，LTV 被动上升': 'Collateral shrinks; LTV rises',
  '市场流动性变薄': 'Market liquidity thins',
  '想退出或展期，却找不到好报价': 'Exit or refinance quotes deteriorate',
  '到期仍未还款': 'Debt remains after maturity',
  '健康仓位也进入到期后清算路径': 'Even a healthy position enters the post-maturity path',
  '↻ 重置实验': '↻ Reset lab',
  '固定利率解决的是“价格会不会变”，不是“到期时有没有钱还”。订单簿变薄时，提前退出和展期都可能更贵，甚至暂时无法成交。': 'A fixed rate answers “will the price change?”, not “will I have cash to repay?”. When the order book thins, early exit or refinancing can become expensive—or temporarily impossible.',
  '关键问题：到期前，新的资金从哪里来？': 'Key question: where will the repayment funds come from?',
  '两类路径并存：抵押不足会触发 health-based liquidation；严格晚于 maturity，未还债务又会触发 post-maturity liquidation。': 'Two paths coexist: insufficient collateral can trigger health-based liquidation; strictly after maturity, outstanding debt can trigger post-maturity liquidation.',
  '同一笔债，在到期前后面对不同规则。': 'The same debt faces different rules before and after maturity.',
  '协议用 oracle 把抵押品折算成贷款资产价值。报价错误、延迟或失效，会扭曲 maxDebt、健康度和清算判断。': 'The protocol uses an oracle to express collateral in loan-asset value. Bad, delayed, or unavailable prices can distort maxDebt, health, and liquidation decisions.',
  '价格源不是装饰，它是风险引擎的输入。': 'The price feed is an input to the risk engine—not decoration.',
  '为什么 fixed maturity': 'Why fixed maturity is',
  '不是“普通借贷 + 固定利率”？': 'not “ordinary lending + a fixed rate”',
  '日期悬崖': 'A date cliff',
  '风险不是平滑延续；跨过 maturity，未偿债务的法律般“状态”改变。': 'Risk does not continue smoothly: after maturity, outstanding debt changes state in a rule-level sense.',
  '流动性被期限切片': 'Liquidity is split by tenor',
  '12 月到期与明年 3 月到期，是不同市场、不同订单和不同深度。': 'A December maturity and a March maturity have different markets, orders, and depth.',
  '利率风险换成再融资风险': 'Rate risk becomes refinancing risk',
  '你不再担心每天涨息，却必须担心到期能否还款或滚到下一期。': 'You stop worrying about daily rate hikes, but must ask whether you can repay or roll the debt at maturity.',
  '两套清算时钟': 'Two liquidation clocks',
  '抵押价格是一只钟，到期日是另一只钟；任何一只响，都可能进入清算。': 'Collateral price is one clock and maturity is another; either can open a liquidation path.',
  '最后，只记住这张表': 'If you remember one thing, make it this table',
  '问题': 'Question',
  'Variable-rate（Aave / Morpho Blue 类）': 'Variable-rate (Aave / Morpho Blue style)',
  'Fixed maturity（Morpho Midnight）': 'Fixed maturity (Morpho Midnight)',
  '借款成本': 'Borrowing cost',
  'IRM 根据利用率持续更新': 'IRM continuously updates it from utilization',
  '成交 unit price 锁定期限成本': 'Trade unit price locks the term cost',
  '债务期限': 'Debt term',
  '通常开放式，无固定到期日': 'Usually open-ended, without a fixed maturity',
  '有明确 maturity': 'Has an explicit maturity',
  '没有“到期后”这一规则切换': 'No “after maturity” rule switch',
  '未还 debt 可被到期后清算': 'Outstanding debt can be liquidated after maturity',
  '主要流动性风险': 'Main liquidity risk',
  '提款/借款受池内可用流动性影响': 'Withdrawals and borrowing depend on pool liquidity',
  '退出、成交和展期依赖对应期限订单': 'Exit, execution, and refinancing depend on matching-tenor orders',
  '共同风险': 'Shared risks',
  '抵押价格下跌、oracle 异常、清算执行与坏账风险': 'Collateral price declines, oracle failures, liquidation execution, and bad debt',
  '一个面向 DeFi 初学者的互动教学实验。不是投资建议。': 'An interactive learning lab for DeFi beginners. Not investment advice.',
}));

const dynamicCopy = {
  zh: {
    month: '个月', before: (days) => `到期前 ${days} 天`, after: (days) => `到期后 ${days} 天`, at: '正好到期时刻',
    beforeBadge: '健康，可主动还款', atBadge: '仍按健康度判断', afterBadge: '未还 debt → 可清算',
    storyPlay: '▶ 自动播放', storyPause: 'Ⅱ 暂停', heroPlay: '▶ 播放 45 秒速懂', heroStop: 'Ⅱ 停止播放', heroReplay: '↻ 再看一次',
    healthy: '<i></i><span><strong>仓位健康</strong>，但风险不是零。</span>',
    oracle: '<i></i><span><strong>抵押不足：</strong> debt 已超过 maxDebt，可触发健康路径清算。</span>',
    liquidity: '<i></i><span><strong>偿付能力仍健康，</strong>但退出或展期报价可能很差——这是流动性风险。</span>',
    maturity: '<i></i><span><strong>到期未还：</strong>即使 HF 仍为 1.20，也可走 post-maturity liquidation。</span>',
  },
  en: {
    month: 'months', before: (days) => `${days} days before maturity`, after: (days) => `${days} days after maturity`, at: 'Exactly at maturity',
    beforeBadge: 'Healthy; repayment is voluntary', atBadge: 'Health rules still apply', afterBadge: 'Debt remains → liquidatable',
    storyPlay: '▶ Auto-play', storyPause: 'Ⅱ Pause', heroPlay: '▶ Play the 45-second tour', heroStop: 'Ⅱ Stop tour', heroReplay: '↻ Watch again',
    healthy: '<i></i><span><strong>Position healthy,</strong> but risk is not zero.</span>',
    oracle: '<i></i><span><strong>Undercollateralized:</strong> debt exceeds maxDebt, enabling health-based liquidation.</span>',
    liquidity: '<i></i><span><strong>Still solvent,</strong> but exit or refinancing quotes may be poor—this is liquidity risk.</span>',
    maturity: '<i></i><span><strong>Unpaid after maturity:</strong> post-maturity liquidation is available even with HF at 1.20.</span>',
  },
};

const storyCopy = {
  zh: [
    { title: '成交：价格决定固定成本', text: '借款人卖出 debt units，今天拿到贷款资产；到期前需要偿还每个 debt unit 对应的 1 单位贷款资产。', market: '报价成交' },
    { title: '持有期：利率不再漂移', text: '这笔交易的期限成本已经锁定。市场后来涨息或降息，不会重写这笔债务的成交价格。', market: '成本已锁定' },
    { title: '临近到期：准备还款或展期', text: '借款人要准备贷款资产；如果选择 refinancing，需要在另一个到期市场找到新的成交对手和可接受报价。', market: '倒计时' },
    { title: '逾期：健康也不等于安全', text: '严格晚于 maturity，只要 debt 仍大于 0，就可走 post-maturity liquidation；这是固定期限独有的第二只风险时钟。', market: '到期未还' },
  ],
  en: [
    { title: 'Execution: price fixes the cost', text: 'The borrower sells debt units and receives the loan asset today. Before maturity, each debt unit must be repaid with 1 unit of the loan asset.', market: 'Trade executed' },
    { title: 'Holding period: the rate stops floating', text: 'This trade’s term cost is locked. Later market rate moves do not rewrite the execution price of this debt.', market: 'Cost locked' },
    { title: 'Near maturity: repay or refinance', text: 'The borrower needs the loan asset. Refinancing means finding a counterparty and acceptable quote in another maturity market.', market: 'Countdown' },
    { title: 'Overdue: healthy does not mean safe', text: 'Strictly after maturity, debt above 0 enables post-maturity liquidation—the second risk clock unique to fixed-term debt.', market: 'Overdue' },
  ],
};

const originalTextNodes = new WeakMap();
let activeShock = 'reset';

function formatNumber(value) {
  return new Intl.NumberFormat(currentLanguage === 'en' ? 'en-US' : 'zh-CN', { maximumFractionDigits: 2 }).format(value);
}

function setRangeFill(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const value = Number(input.value);
  input.style.setProperty("--range", `${((value - min) / (max - min)) * 100}%`);
}

function updateVariable() {
  const utilization = Number($("#utilization").value);
  // A teaching curve, not a quote: slow below 80%, steep above it.
  const rate = utilization <= 80
    ? 2.2 + 0.076 * utilization
    : 8.28 + 0.045 * Math.pow(utilization - 80, 2);
  $("#utilizationValue").textContent = `${utilization}%`;
  $("#poolLiquidity").textContent = `${100 - utilization}%`;
  $("#poolFill").style.width = `${100 - utilization}%`;
  $("#variableRate").textContent = `${rate.toFixed(1)}%`;
  $("#variableCost").textContent = `${formatNumber(10_000 * rate / 100)} USDC`;
  setRangeFill($("#utilization"));
}

function updateFixed() {
  const price = Number($("#unitPrice").value) / 1000;
  const months = Number($("#termMonths").value);
  const receive = 10_000 * price;
  const termRate = 1 / price - 1;
  const simpleApr = termRate * 12 / months;
  $("#priceValue").textContent = price.toFixed(3);
  $("#termValue").textContent = `${months} ${dynamicCopy[currentLanguage].month}`;
  $("#fixedReceive").textContent = formatNumber(receive);
  $("#fixedCost").textContent = `${formatNumber(10_000 - receive)} USDC`;
  $("#fixedApr").textContent = `${(simpleApr * 100).toFixed(2)}%`;
  setRangeFill($("#unitPrice"));
  setRangeFill($("#termMonths"));
}

$$('.mode-button').forEach((button) => {
  button.addEventListener('click', () => {
    $$('.mode-button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    $$('.machine-body').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== button.dataset.mode));
  });
});

$('#utilization').addEventListener('input', updateVariable);
$('#unitPrice').addEventListener('input', updateFixed);
$('#termMonths').addEventListener('input', updateFixed);
updateVariable();
updateFixed();

function updateTimeline() {
  const value = Number($('#timeSlider').value);
  const after = value > 72;
  const at = value === 72;
  const lab = $('.timeline-lab');
  $('#timeCursor').style.left = `${value}%`;
  $('#timeProgress').style.width = `${value}%`;
  lab.classList.toggle('after', after);
  $('#beforeRule').classList.toggle('active', !after);
  $('#afterRule').classList.toggle('active', after);

  if (after) {
    const days = Math.max(1, Math.round((value - 72) / 5));
    $('#timelineHeadline').textContent = dynamicCopy[currentLanguage].after(days);
    $('#timelineBadge').textContent = dynamicCopy[currentLanguage].afterBadge;
  } else if (at) {
    $('#timelineHeadline').textContent = dynamicCopy[currentLanguage].at;
    $('#timelineBadge').textContent = dynamicCopy[currentLanguage].atBadge;
  } else {
    const days = Math.max(1, Math.round((72 - value) * 1.36));
    $('#timelineHeadline').textContent = dynamicCopy[currentLanguage].before(days);
    $('#timelineBadge').textContent = dynamicCopy[currentLanguage].beforeBadge;
  }
}
$('#timeSlider').addEventListener('input', updateTimeline);
updateTimeline();

let storyIndex = 0;
let storyTimer = null;

function showStory(index) {
  storyIndex = index;
  const story = storyCopy[currentLanguage];
  const item = story[index];
  $('#storyStage').dataset.step = String(index);
  $('#storyStepLabel').textContent = `STEP ${index + 1} / ${story.length}`;
  $('#storyTitle').textContent = item.title;
  $('#storyText').textContent = item.text;
  $('#marketStateLabel').textContent = item.market;
  $$('.story-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function stopStory() {
  if (storyTimer) window.clearInterval(storyTimer);
  storyTimer = null;
  $('#playStory').textContent = dynamicCopy[currentLanguage].storyPlay;
}

function startStory() {
  stopStory();
  $('#playStory').textContent = dynamicCopy[currentLanguage].storyPause;
  storyTimer = window.setInterval(() => showStory((storyIndex + 1) % storyCopy[currentLanguage].length), 3700);
}

$$('.story-dot').forEach((dot) => dot.addEventListener('click', () => {
  stopStory();
  showStory(Number(dot.dataset.step));
}));
$('#playStory').addEventListener('click', () => storyTimer ? stopStory() : startStory());
showStory(0);

const shockButtons = $$('[data-shock]');
function applyShock(type) {
  activeShock = type;
  const panel = $('.health-panel');
  shockButtons.forEach((button) => button.classList.toggle('active', button.dataset.shock === type && type !== 'reset'));
  panel.classList.remove('danger');
  $('#collateralValue').textContent = '15,000';
  $('#healthFactor').textContent = '1.20';
  $('#debtBar').style.width = '66.66%';
  $('#healthMessage').innerHTML = dynamicCopy[currentLanguage].healthy;

  if (type === 'oracle') {
    panel.classList.add('danger');
    $('#collateralValue').textContent = '12,000';
    $('#healthFactor').textContent = '0.96';
    $('#debtBar').style.width = '83.33%';
    $('#healthMessage').innerHTML = dynamicCopy[currentLanguage].oracle;
  }
  if (type === 'liquidity') {
    $('#healthMessage').innerHTML = dynamicCopy[currentLanguage].liquidity;
  }
  if (type === 'maturity') {
    panel.classList.add('danger');
    $('#healthMessage').innerHTML = dynamicCopy[currentLanguage].maturity;
  }
}
shockButtons.forEach((button) => button.addEventListener('click', () => applyShock(button.dataset.shock)));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((element) => revealObserver.observe(element));

let heroTimer = null;
$('#autoplayHero').addEventListener('click', () => {
  if (heroTimer) {
    window.clearInterval(heroTimer);
    heroTimer = null;
    $('#autoplayHero').textContent = dynamicCopy[currentLanguage].heroPlay;
    return;
  }
  const scenes = [
    () => { $('.mode-button[data-mode="variable"]').click(); $('#utilization').value = '92'; updateVariable(); },
    () => { $('.mode-button[data-mode="fixed"]').click(); $('#unitPrice').value = '950'; $('#termMonths').value = '12'; updateFixed(); },
    () => { $('#maturity').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#timeSlider').value = '86'; updateTimeline(); },
    () => { $('#risk').scrollIntoView({ behavior: 'smooth', block: 'center' }); applyShock('maturity'); },
  ];
  let scene = 0;
  $('#autoplayHero').textContent = dynamicCopy[currentLanguage].heroStop;
  scenes[scene]();
  heroTimer = window.setInterval(() => {
    scene += 1;
    if (scene >= scenes.length) {
      window.clearInterval(heroTimer);
      heroTimer = null;
      $('#autoplayHero').textContent = dynamicCopy[currentLanguage].heroReplay;
      return;
    }
    scenes[scene]();
  }, 5200);
});

function renderStaticLanguage(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
    const original = originalTextNodes.get(node);
    const trimmed = original.trim();
    const translated = language === 'en' ? englishText.get(trimmed) : null;
    node.nodeValue = translated ? original.replace(trimmed, translated) : original;
    node = walker.nextNode();
  }
}

function applyLanguage(language) {
  currentLanguage = language;
  try {
    localStorage.setItem('midnight-explain-language', language);
  } catch (_) {
    // The language switch still works when storage is unavailable.
  }

  renderStaticLanguage(language);
  const english = language === 'en';
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  document.body.classList.toggle('english', english);
  document.title = english
    ? 'Fixed or Floating? | Lending rates and maturity risk lab'
    : 'Fixed or Floating?｜借贷利率与到期风险实验室';
  $('meta[name="description"]').content = english
    ? 'An interactive guide to variable-rate lending, fixed rates, fixed maturity, and Morpho Midnight risk.'
    : '用交互动效理解浮动利率借贷、固定利率与固定到期日，以及 Morpho Midnight 的风险结构。';

  $('.brand').setAttribute('aria-label', english ? 'Back to top' : '返回顶部');
  $('.topbar nav').setAttribute('aria-label', english ? 'Page navigation' : '页面导航');
  $('.mode-switch').setAttribute('aria-label', english ? 'Choose a lending model' : '选择借贷模式');
  $('.lesson-strip').setAttribute('aria-label', english ? 'The idea in one sentence' : '一句话理解');
  $('.mini-chart').setAttribute('aria-label', english ? 'Rates usually accelerate as utilization rises' : '利用率上升时利率通常加速上升');
  $('#timeSlider').setAttribute('aria-label', english ? 'Move through time before and after maturity' : '调整到期前后时间');
  $('.story-nav').setAttribute('aria-label', english ? 'Animation steps' : '教学动画步骤');
  $$('.story-dot').forEach((dot, index) => dot.setAttribute('aria-label', english ? `Step ${index + 1}` : `步骤 ${index + 1}`));
  $('#languageToggle').setAttribute('aria-label', english ? '切换为中文' : 'Switch to English');
  $('.lang-zh').classList.toggle('active', !english);
  $('.lang-en').classList.toggle('active', english);

  updateVariable();
  updateFixed();
  updateTimeline();
  showStory(storyIndex);
  applyShock(activeShock);
  $('#playStory').textContent = storyTimer ? dynamicCopy[language].storyPause : dynamicCopy[language].storyPlay;
  $('#autoplayHero').textContent = heroTimer ? dynamicCopy[language].heroStop : dynamicCopy[language].heroPlay;
}

$('#languageToggle').addEventListener('click', () => applyLanguage(currentLanguage === 'zh' ? 'en' : 'zh'));
applyLanguage(currentLanguage);
