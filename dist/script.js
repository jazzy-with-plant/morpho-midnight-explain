const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const format = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });

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
  $("#variableCost").textContent = `${format.format(10_000 * rate / 100)} USDC`;
  setRangeFill($("#utilization"));
}

function updateFixed() {
  const price = Number($("#unitPrice").value) / 1000;
  const months = Number($("#termMonths").value);
  const receive = 10_000 * price;
  const termRate = 1 / price - 1;
  const simpleApr = termRate * 12 / months;
  $("#priceValue").textContent = price.toFixed(3);
  $("#termValue").textContent = `${months} 个月`;
  $("#fixedReceive").textContent = format.format(receive);
  $("#fixedCost").textContent = `${format.format(10_000 - receive)} USDC`;
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
    $('#timelineHeadline').textContent = `到期后 ${days} 天`;
    $('#timelineBadge').textContent = '未还 debt → 可清算';
  } else if (at) {
    $('#timelineHeadline').textContent = '正好到期时刻';
    $('#timelineBadge').textContent = '仍按健康度判断';
  } else {
    const days = Math.max(1, Math.round((72 - value) * 1.36));
    $('#timelineHeadline').textContent = `到期前 ${days} 天`;
    $('#timelineBadge').textContent = '健康，可主动还款';
  }
}
$('#timeSlider').addEventListener('input', updateTimeline);
updateTimeline();

const story = [
  {
    title: '成交：价格决定固定成本',
    text: '借款人卖出 debt units，今天拿到贷款资产；到期前需要偿还每个 debt unit 对应的 1 单位贷款资产。',
    market: '报价成交',
  },
  {
    title: '持有期：利率不再漂移',
    text: '这笔交易的期限成本已经锁定。市场后来涨息或降息，不会重写这笔债务的成交价格。',
    market: '成本已锁定',
  },
  {
    title: '临近到期：准备还款或展期',
    text: '借款人要准备贷款资产；如果选择 refinancing，需要在另一个到期市场找到新的成交对手和可接受报价。',
    market: '倒计时',
  },
  {
    title: '逾期：健康也不等于安全',
    text: '严格晚于 maturity，只要 debt 仍大于 0，就可走 post-maturity liquidation；这是固定期限独有的第二只风险时钟。',
    market: '到期未还',
  },
];
let storyIndex = 0;
let storyTimer = null;

function showStory(index) {
  storyIndex = index;
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
  $('#playStory').textContent = '▶ 自动播放';
}

function startStory() {
  stopStory();
  $('#playStory').textContent = 'Ⅱ 暂停';
  storyTimer = window.setInterval(() => showStory((storyIndex + 1) % story.length), 3700);
}

$$('.story-dot').forEach((dot) => dot.addEventListener('click', () => {
  stopStory();
  showStory(Number(dot.dataset.step));
}));
$('#playStory').addEventListener('click', () => storyTimer ? stopStory() : startStory());
showStory(0);

const shockButtons = $$('[data-shock]');
function applyShock(type) {
  const panel = $('.health-panel');
  shockButtons.forEach((button) => button.classList.toggle('active', button.dataset.shock === type && type !== 'reset'));
  panel.classList.remove('danger');
  $('#collateralValue').textContent = '15,000';
  $('#healthFactor').textContent = '1.20';
  $('#debtBar').style.width = '66.66%';
  $('#healthMessage').innerHTML = '<i></i><span><strong>仓位健康</strong>，但风险不是零。</span>';

  if (type === 'oracle') {
    panel.classList.add('danger');
    $('#collateralValue').textContent = '12,000';
    $('#healthFactor').textContent = '0.96';
    $('#debtBar').style.width = '83.33%';
    $('#healthMessage').innerHTML = '<i></i><span><strong>抵押不足：</strong> debt 已超过 maxDebt，可触发健康路径清算。</span>';
  }
  if (type === 'liquidity') {
    $('#healthMessage').innerHTML = '<i></i><span><strong>偿付能力仍健康，</strong>但退出或展期报价可能很差——这是流动性风险。</span>';
  }
  if (type === 'maturity') {
    panel.classList.add('danger');
    $('#healthMessage').innerHTML = '<i></i><span><strong>到期未还：</strong>即使 HF 仍为 1.20，也可走 post-maturity liquidation。</span>';
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
    $('#autoplayHero').textContent = '▶ 播放 45 秒速懂';
    return;
  }
  const scenes = [
    () => { $('.mode-button[data-mode="variable"]').click(); $('#utilization').value = '92'; updateVariable(); },
    () => { $('.mode-button[data-mode="fixed"]').click(); $('#unitPrice').value = '950'; $('#termMonths').value = '12'; updateFixed(); },
    () => { $('#maturity').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#timeSlider').value = '86'; updateTimeline(); },
    () => { $('#risk').scrollIntoView({ behavior: 'smooth', block: 'center' }); applyShock('maturity'); },
  ];
  let scene = 0;
  $('#autoplayHero').textContent = 'Ⅱ 停止播放';
  scenes[scene]();
  heroTimer = window.setInterval(() => {
    scene += 1;
    if (scene >= scenes.length) {
      window.clearInterval(heroTimer);
      heroTimer = null;
      $('#autoplayHero').textContent = '↻ 再看一次';
      return;
    }
    scenes[scene]();
  }, 5200);
});
