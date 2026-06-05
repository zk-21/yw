(() => {
  const WRITING_GRADES = [
    {
      grade: 3,
      label: '三年级',
      cards: [
        {
          title: '🏆 三年级重点：把句子写具体',
          items: [
            { label: '训练目标', text: '写清时间、地点、人物、事情' },
            { label: '基础题', text: '妈妈做饭。' },
            { label: '提优题', text: '晚上，妈妈在厨房里做饭。' },
            { label: '拔高题', text: '晚上，勤劳的妈妈在厨房里认真地做饭。' }
          ]
        },
        {
          title: '📝 三年级重点：把事情写完整',
          accent: true,
          items: [
            { label: '训练目标', text: '学会六要素（时间、地点、人物、起因、经过、结果）' },
            { label: '例文', text: '今天（时间），我和小明（人物）在公园里（地点）玩。因为我们比赛跑步（起因），结果我赢了（结果）。' },
            { label: '技巧', text: '问自己“什么时候？谁？在哪里？为什么？做了什么？结果怎样？”' }
          ]
        },
        {
          title: '✏️ 片段扩写训练',
          items: [
            { label: '原句', text: '小鸟飞。' },
            { label: '扩写1（基础）', text: '一只小鸟在天上飞。' },
            { label: '扩写2（提高）', text: '一只美丽的小鸟在蓝天上快乐地飞。' },
            { label: '扩写3（拔高）', text: '早上，一只美丽的小鸟在蓝天上快乐地飞来飞去，唱着动听的歌。' }
          ]
        },
        {
          title: '📖 写作小课堂',
          accent: true,
          items: [
            { label: '技巧1', text: '加上形容词，让事物更具体' },
            { label: '技巧2', text: '加上时间、地点，让场景更清晰' },
            { label: '技巧3', text: '加上动作、表情，让人物更生动' }
          ]
        }
      ]
    },
    {
      grade: 4,
      label: '四年级',
      cards: [
        {
          title: '🏆 四年级重点：把过程写生动',
          items: [
            { label: '训练目标', text: '加入动作、语言、心理描写' },
            { label: '原句', text: '我很着急。' },
            { label: '改写后', text: '我急得直跺脚，嘴里念叨着：“怎么办？怎么办？”心里像揣了只小兔子，怦怦直跳。' }
          ]
        },
        {
          title: '🎭 细节描写训练',
          accent: true,
          items: [
            { label: '动作描写', text: '他迅速地跑过去，一把抓住了快要掉下来的杯子。' },
            { label: '语言描写', text: '“小心！”他大声喊道，“别碰那个！”' },
            { label: '心理描写', text: '我心想：要是能考一百分，妈妈一定会很高兴的。' }
          ]
        },
        {
          title: '🌿 环境描写训练',
          items: [
            { label: '描写心情的环境', text: '阳光明媚，小鸟在枝头唱歌，我的心情也格外好。' },
            { label: '渲染气氛的环境', text: '天空阴沉沉的，冷风呼呼地吹，让人感到有些害怕。' }
          ]
        },
        {
          title: '📝 句子润色训练',
          accent: true,
          items: [
            { label: '原句', text: '我很开心。' },
            { label: '润色后', text: '我的心里像吃了蜜一样甜，嘴角忍不住向上扬。' },
            { label: '技巧', text: '用比喻和动作描写代替直接表达心情' }
          ]
        }
      ]
    },
    {
      grade: 5,
      label: '五年级',
      cards: [
        {
          title: '🏆 五年级重点：围绕中心选材',
          items: [
            { label: '训练目标', text: '围绕一个中心，选择合适的材料，详略得当' },
            { label: '题目示例', text: '一件难忘的事' },
            { label: '立意选择', text: '通过这件事，我学会了勇敢/友情/坚持' }
          ]
        },
        {
          title: '⚖️ 详略安排技巧',
          accent: true,
          items: [
            { label: '详写（重点部分）', text: '事情的经过、人物的动作和对话' },
            { label: '略写（次要部分）', text: '事情的起因、结果、一般的环境描写' },
            { label: '原则', text: '与中心有关的详写，与中心关系不大的略写' }
          ]
        },
        {
          title: '🔄 开头结尾训练',
          items: [
            { label: '精彩开头', text: '往事像一颗颗珍珠，串起了我美好的童年，其中最闪亮的一颗，让我至今难忘。' },
            { label: '精彩结尾', text: '这件事虽然过去很久了，但它深深印在我的脑海里，时刻提醒着我……' }
          ]
        },
        {
          title: '💡 立意提升训练',
          accent: true,
          items: [
            { label: '题目', text: '蚂蚁搬食物' },
            { label: '立意1（基础）', text: '蚂蚁真勤劳' },
            { label: '立意2（提高）', text: '团结就是力量' },
            { label: '立意3（拔高）', text: '小小的蚂蚁让我明白了，只要坚持，就能成功' }
          ]
        }
      ]
    }
  ];

  const FLOW_PACK_LIBRARY = [
    {
      id: 'pack-b1',
      title: 'B1 字词拼音训练包',
      routine: [
        { label: '题1', text: '拼读 h-uā、l-ǜ、q-ún，并说出声调。' },
        { label: '题2', text: '清、晴、睛填空：雨后天空放（ ），小河很（ ），妹妹的眼（ ）亮亮的。' },
        { label: '题3', text: '用“书、花、水”各说一句完整话。' },
        { label: '答案', text: 'huā、lǜ、qún；晴、清、睛；句子要有谁、在哪里、做什么。' }
      ],
      rows: [
        ['基础', '拼读 j-ǔ、x-üé、n-ǚ', 'jǔ、xué、nǚ', 'j、x 遇 ü 去两点，n 遇 ü 不去点。'],
        ['提升', '选字：公（园/圆）里有一个（园/圆）形花坛。', '园、圆', '看语境和字义。'],
        ['拔尖', '用“清、晴、睛”各写一句话', '湖水很清。今天很晴朗。她的眼睛亮亮的。', '每句词义准确。']
      ]
    },
    {
      id: 'pack-r1',
      title: 'R1 概括训练包',
      accent: true,
      routine: [
        { label: '材料', text: '星期天，小雨和爸爸去图书馆借书。她选了一本科普书，还把看完的绘本放回书架。回家后，她把书里的有趣知识讲给妈妈听。' },
        { label: '题1', text: '圈人物、事情、结果。' },
        { label: '题2', text: '用一句话概括材料。' },
        { label: '答案', text: '小雨和爸爸去图书馆借书，小雨整理书架，回家后分享书中知识。' }
      ],
      rows: [
        ['基础', '圈出“谁、做什么、结果”', '小雨；去图书馆借书、整理书架；分享知识。', '三项都圈到。'],
        ['提升', '删掉次要细节后概括', '小雨去图书馆借书并整理书架，回家分享知识。', '不抄“科普书、绘本”等细节。'],
        ['拔尖', '用 25 字内概括', '小雨借书、整理书架，并分享书中知识。', '短而完整。']
      ]
    },
    {
      id: 'pack-r2',
      title: 'R2 原文依据训练包',
      routine: [
        { label: '材料', text: '雨越来越大，林老师把自己的伞递给没带伞的同学，自己站在屋檐下等雨小一些再走。' },
        { label: '题1', text: '林老师是怎样的人？' },
        { label: '题2', text: '从哪里看出来？' },
        { label: '答案', text: '林老师关心学生、愿意为学生着想。从她把伞递给同学、自己留下等雨小可以看出。' }
      ],
      rows: [
        ['基础', '圈出能证明老师关心学生的动作', '把伞递给同学，自己站在屋檐下等。', '证据必须来自材料。'],
        ['提升', '用“特点 + 依据”回答', '林老师关心学生，从她把伞递给没带伞的同学可以看出。', '特点和依据对应。'],
        ['拔尖', '加一句分析', '这说明她把学生的需要放在自己前面。', '从细节推到品质。']
      ]
    },
    {
      id: 'pack-r3',
      title: 'R3 赏析和说明文训练包',
      accent: true,
      routine: [
        { label: '题1', text: '“大约 50 米”中的“大约”能删吗？为什么？' },
        { label: '题2', text: '赏析“树叶像一只只小船漂在水面上”。' },
        { label: '答案', text: '不能删，“大约”表示估计，删后变成完全确定，体现语言准确；比喻把树叶比作小船，写出树叶轻轻漂浮的样子，画面更生动。' }
      ],
      rows: [
        ['基础', '“可能”能删吗？', '不能，表示不确定，删后说法绝对。', '先解释词义。'],
        ['提升', '“约 80%”体现什么？', '体现说明文语言准确、严谨。', '联系数字和限制。'],
        ['拔尖', '赏析“雨点像小鼓点”', '用了比喻，写出雨声清脆、有节奏，画面更生动。', '方法、特点、效果齐全。']
      ]
    },
    {
      id: 'pack-r4',
      title: 'R4 非连续文本训练包',
      routine: [
        { label: '材料', text: '每天阅读 30 分钟以上的学生，作文按时完成率为 78%；每周只阅读 1 次的学生，作文按时完成率为 46%。' },
        { label: '题1', text: '比较两组数据。' },
        { label: '题2', text: '给同学提一条建议。' },
        { label: '答案', text: '每天阅读 30 分钟以上的学生作文按时完成率更高。建议同学每天固定阅读 30 分钟以上，因为材料显示稳定阅读和作文完成情况有关。' }
      ],
      rows: [
        ['基础', '找出最高数据', '每天阅读 30 分钟以上，作文按时完成率 78%。', '数据和对象都写。'],
        ['提升', '比较两组数据', '78% 高于 46%，稳定阅读的学生作文完成情况更好。', '必须比较。'],
        ['拔尖', '写一条建议并说明依据', '建议每天阅读 30 分钟以上，因为材料中这类学生作文按时完成率更高。', '建议有材料支撑。']
      ]
    },
    {
      id: 'pack-w1',
      title: 'W1 写话和观察训练包',
      accent: true,
      routine: [
        { label: '低分句', text: '小鸟飞来了。' },
        { label: '升格', text: '清晨，一只黄色的小鸟扑扇着翅膀，轻轻飞到窗台上，叽叽喳喳地叫着。' },
        { label: '二次练习', text: '把“小狗跑来了”扩成 3 句，再补一句心情。' },
        { label: '检查', text: '是否有样子、动作、声音或心情。' }
      ],
      rows: [
        ['基础', '把“小狗跑来了”补成一句具体话', '一只黄色的小狗摇着尾巴跑来了。', '补样子和动作。'],
        ['提升', '扩成 3 句话', '一只黄色的小狗摇着尾巴跑来了。它围着我转了一圈。我的心里高兴极了。', '动作连续。'],
        ['拔尖', '写观察变化：花苞开了', '早上，花苞还是紧紧合着。中午，花瓣慢慢展开，露出嫩黄的花心。我惊喜地凑近看了又看。', '有时间、变化、感受。']
      ]
    },
    {
      id: 'pack-w2',
      title: 'W2 重点段升格训练包',
      routine: [
        { label: '低分段', text: '我参加比赛，很紧张。后来我成功了，很开心。' },
        { label: '升格', text: '轮到我上场时，我的手紧紧抓着号码牌，耳边的加油声忽远忽近。发令枪一响，我咬紧牙关冲了出去。冲过终点那一刻，我忽然明白，勇敢就是害怕时也往前一步。' },
        { label: '二次练习', text: '把“第一次上台”写出害怕到开口的变化。' }
      ],
      rows: [
        ['基础', '给“我很紧张”补动作', '我攥着衣角，手心里全是汗。', '不用空泛心情词。'],
        ['提升', '写“害怕到开口”的变化', '我低头盯着稿纸，声音卡在喉咙里。听见老师鼓励，我深吸一口气，说出了第一句话。', '有前后变化。'],
        ['拔尖', '给重点段补中心句', '那一刻我明白，勇敢不是不害怕，而是害怕时仍愿意尝试。', '结尾有认识提升。']
      ]
    },
    {
      id: 'pack-w3',
      title: 'W3 审题扣题训练包',
      accent: true,
      routine: [
        { label: '题目', text: '这一次，我做对了。' },
        { label: '审题', text: '题眼是“这一次”和“做对了”，必须写一次具体选择。' },
        { label: '提纲', text: '中心：从犹豫到主动承担；重点段：关键选择时的心理变化；结尾：点明“做对”的认识。' },
        { label: '二次练习', text: '给《这一次，我没有逃避》列同样的四项提纲。' }
      ],
      rows: [
        ['基础', '圈题眼：《这一次，我没有逃避》', '这一次、没有逃避。', '必须写一次具体经历。'],
        ['提升', '定中心', '从想躲开到主动面对，明白责任不能逃避。', '有变化和认识。'],
        ['拔尖', '列重点段', '详写想推脱、犹豫、最后主动承担的心理和动作。', '重点段服务题眼。']
      ]
    },
    {
      id: 'pack-c1',
      title: 'C1 综合题型训练包',
      routine: [
        { label: '题1', text: '“这句话在文中有什么作用？”先判断题型。' },
        { label: '题2', text: '“根据材料提出建议”先找什么？' },
        { label: '题3', text: '5 分题至少答几层？' },
        { label: '答案', text: '句段作用题；先找材料依据、数字或关键词；至少 2-3 层，按结论、依据、分析组织。' }
      ],
      rows: [
        ['基础', '判断题型：“这句话有什么作用？”', '句段作用题。', '先判断题型。'],
        ['提升', '作用题至少答哪几层？', '内容、结构、中心或情感。', '不只写“承上启下”。'],
        ['拔尖', '5 分综合题怎么分层？', '先写结论，再写材料依据，最后补分析或中心。', '按分值组织答案。']
      ]
    }
  ];

  let activeWritingGrade = 3;

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function chunk(items, size) {
    const result = [];
    for (let index = 0; index < items.length; index += size) {
      result.push(items.slice(index, index + size));
    }
    return result;
  }

  function renderRoutine(items) {
    return `
      <div class="routine">
        ${items.map((item) => `
          <p><strong>${escapeHTML(item.label)}：</strong>${escapeHTML(item.text)}</p>
        `).join('')}
      </div>
    `;
  }

  function renderTable(rows) {
    return `
      <div class="responsive-table">
        <table>
          <thead><tr><th>层级</th><th>题目</th><th>答案</th><th>检查点</th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderWritingFilters() {
    return WRITING_GRADES.map((group) => `
      <button
        class="grade-filter-btn${group.grade === activeWritingGrade ? ' active' : ''}"
        data-grade="${group.grade}"
        onclick="filterWriting(${group.grade}, this)"
      >${escapeHTML(group.label)}</button>
    `).join('');
  }

  function renderWritingContent() {
    return WRITING_GRADES.map((group) => `
      <div id="writing-grade-${group.grade}" class="writing-content${group.grade === activeWritingGrade ? '' : ' is-hidden'}">
        ${chunk(group.cards, 2).map((row, rowIndex) => `
          <div class="content-grid${rowIndex > 0 ? ' content-grid-spaced-top' : ''}">
            ${row.map((card) => `
              <article class="study-block${card.accent ? ' accent' : ''}">
                <h3>${escapeHTML(card.title)}</h3>
                ${renderRoutine(card.items)}
              </article>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function renderFlowPackLibrary() {
    return `
      <div class="content-grid flow-pack-library-grid">
        ${FLOW_PACK_LIBRARY.map((pack) => `
          <article class="study-block${pack.accent ? ' accent' : ''}" id="${pack.id}">
            <h2>${escapeHTML(pack.title)}</h2>
            ${renderRoutine(pack.routine)}
            ${renderTable(pack.rows)}
          </article>
        `).join('')}
      </div>
    `;
  }

  function setActiveWritingGrade(grade) {
    const normalizedGrade = Number(grade);
    if (WRITING_GRADES.some((item) => item.grade === normalizedGrade)) {
      activeWritingGrade = normalizedGrade;
    }
  }

  function renderPracticePageContent() {
    const writingFilterBar = document.getElementById('writingFilterBar');
    const writingContentContainer = document.getElementById('writingContentContainer');
    const flowPackLibrary = document.getElementById('flow-pack-library');

    if (writingFilterBar) {
      writingFilterBar.innerHTML = renderWritingFilters();
    }

    if (writingContentContainer) {
      writingContentContainer.innerHTML = renderWritingContent();
    }

    if (flowPackLibrary) {
      flowPackLibrary.innerHTML = renderFlowPackLibrary();
    }
  }

  window.PracticePageContent = {
    renderPracticePageContent,
    setActiveWritingGrade
  };
  window.renderPracticePageContent = renderPracticePageContent;
  renderPracticePageContent();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPracticePageContent, { once: true });
  }
})();
