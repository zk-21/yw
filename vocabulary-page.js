(function () {
  'use strict';

  const vocabularies = [
    { word: "春暖花开", pinyin: "chūn nuǎn huā kāi", meaning: "春天暖和，花儿开放，形容春天美丽的景色", example: "春天到了，公园里春暖花开。", category: "nature" },
    { word: "秋高气爽", pinyin: "qiū gāo qì shuǎng", meaning: "秋天天气晴朗，空气清爽", example: "秋高气爽的早晨，我们去爬山。", category: "nature" },
    { word: "鸟语花香", pinyin: "niǎo yǔ huā xiāng", meaning: "鸟儿鸣叫，花儿飘香，形容春天美好的景象", example: "走进森林，到处鸟语花香。", category: "nature" },
    { word: "山清水秀", pinyin: "shān qīng shuǐ xiù", meaning: "山美水美，风景优美", example: "我的家乡山清水秀，真美！", category: "nature" },
    { word: "花红柳绿", pinyin: "huā hóng liǔ lǜ", meaning: "红花绿柳，形容春天美丽的景色", example: "春天来了，花红柳绿，美不胜收。", category: "nature" },
    { word: "层林尽染", pinyin: "céng lín jìn rǎn", meaning: "一层层树林被染上颜色，形容秋天山林色彩丰富", example: "秋天到了，香山层林尽染。", category: "nature" },
    { word: "冰天雪地", pinyin: "bīng tiān xuě dì", meaning: "到处是冰和雪，形容非常寒冷的冬天", example: "北方的冬天，到处都是冰天雪地。", category: "nature" },
    { word: "风和日丽", pinyin: "fēng hé rì lì", meaning: "微风和煦，阳光明亮，形容天气晴朗", example: "今天风和日丽，适合出去游玩。", category: "nature" },
    { word: "姹紫嫣红", pinyin: "chà zǐ yān hóng", meaning: "形容各种颜色的花朵，非常好看", example: "花园里姹紫嫣红，漂亮极了。", category: "nature" },
    { word: "银装素裹", pinyin: "yín zhuāng sù guǒ", meaning: "形容雪后的白色世界", example: "大雪过后，大地银装素裹。", category: "nature" },
    { word: "蒙蒙细雨", pinyin: "méng méng xì yǔ", meaning: "细密的小雨", example: "春天里，蒙蒙细雨滋润着大地。", category: "nature" },
    { word: "心花怒放", pinyin: "xīn huā nù fàng", meaning: "心里高兴得像花一样开放，形容非常开心", example: "听到这个消息，我心花怒放。", category: "emotion" },
    { word: "迫不及待", pinyin: "pò bù jí dài", meaning: "急得不能等待，形容非常着急", example: "我迫不及待地想见到爷爷。", category: "emotion" },
    { word: "兴致勃勃", pinyin: "xìng zhì bó bó", meaning: "兴趣很高的样子", example: "同学们兴致勃勃地参观博物馆。", category: "emotion" },
    { word: "闷闷不乐", pinyin: "mèn mèn bù lè", meaning: "心里不高兴，愁眉苦脸的样子", example: "小华没考好，整天闷闷不乐。", category: "emotion" },
    { word: "眉开眼笑", pinyin: "méi kāi yǎn xiào", meaning: "眉头舒展，眼含笑意，形容高兴的样子", example: "奶奶看到我们回来，眉开眼笑。", category: "emotion" },
    { word: "兴高采烈", pinyin: "xìng gāo cǎi liè", meaning: "非常高兴，很兴奋的样子", example: "同学们兴高采烈地去春游。", category: "emotion" },
    { word: "垂头丧气", pinyin: "chuí tóu sàng qì", meaning: "低着头，无精打采，形容失望沮丧", example: "比赛输了，他垂头丧气地回到家。", category: "emotion" },
    { word: "提心吊胆", pinyin: "tí xīn diào dǎn", meaning: "形容非常担心、害怕", example: "他提心吊胆地等着考试成绩。", category: "emotion" },
    { word: "惊慌失措", pinyin: "jīng huāng shī cuò", meaning: "惊慌害怕，不知道怎么办才好", example: "突然停电了，大家惊慌失措。", category: "emotion" },
    { word: "欣喜若狂", pinyin: "xīn xǐ ruò kuáng", meaning: "高兴到了极点，像发了狂一样", example: "听到获奖的消息，他欣喜若狂。", category: "emotion" },
    { word: "助人为乐", pinyin: "zhù rén wéi lè", meaning: "把帮助别人当作快乐的事", example: "小明是个助人为乐的好孩子。", category: "character" },
    { word: "拾金不昧", pinyin: "shí jīn bú mèi", meaning: "捡到东西不藏起来，归还失主", example: "小红拾金不昧，值得大家学习。", category: "character" },
    { word: "勤学好问", pinyin: "qín xué hào wèn", meaning: "勤奋学习，不懂就问", example: "小华勤学好问，成绩很好。", category: "character" },
    { word: "坚持不懈", pinyin: "jiān chí bú xiè", meaning: "坚持下去，从不松懈", example: "他坚持不懈地练习，终于成功了。", category: "character" },
    { word: "自强不息", pinyin: "zì qiáng bù xī", meaning: "自己努力向上，永不停止", example: "我们要做自强不息的人。", category: "character" },
    { word: "勇敢无畏", pinyin: "yǒng gǎn wú wèi", meaning: "非常勇敢，不害怕任何困难", example: "消防员勇敢无畏地冲进火场。", category: "character" },
    { word: "诚实守信", pinyin: "chéng shí shǒu xìn", meaning: "说话诚实，守信用", example: "我们要做一个诚实守信的人。", category: "character" },
    { word: "谦虚谨慎", pinyin: "qiān xū jǐn shèn", meaning: "虚心、慎重，不骄傲自满", example: "即使考了第一名，也要谦虚谨慎。", category: "character" },
    { word: "坚韧不拔", pinyin: "jiān rèn bù bá", meaning: "意志坚定，不可动摇", example: "他以坚韧不拔的毅力登上了山顶。", category: "character" },
    { word: "专心致志", pinyin: "zhuān xīn zhì zhì", meaning: "一心一意，集中精神", example: "他专心致志地写作业。", category: "study" },
    { word: "废寝忘食", pinyin: "fèi qǐn wàng shí", meaning: "顾不上吃饭和睡觉，形容非常专心", example: "他废寝忘食地研究科学问题。", category: "study" },
    { word: "持之以恒", pinyin: "chí zhī yǐ héng", meaning: "坚持做某事，一直不放弃", example: "学习任何本领都要持之以恒。", category: "study" },
    { word: "博览群书", pinyin: "bó lǎn qún shū", meaning: "广泛阅读各种书籍", example: "多读书、博览群书，能增长见识。", category: "study" },
    { word: "学以致用", pinyin: "xué yǐ zhì yòng", meaning: "学到了知识就要用到实践中", example: "学习要学以致用，不能只背不做。", category: "study" },
    { word: "温故知新", pinyin: "wēn gù zhī xīn", meaning: "复习旧知识能获得新理解", example: "温故知新是个好学习方法。", category: "study" },
    { word: "举一反三", pinyin: "jǔ yī fǎn sān", meaning: "从一件事类推而知道其他很多事", example: "学习要会举一反三，灵活运用。", category: "study" },
    { word: "水滴石穿", pinyin: "shuǐ dī shí chuān", meaning: "水不断滴落能穿透石头，比喻坚持就能成功", example: "只要坚持，水滴石穿，你一定能学会。", category: "study" },
    { word: "守株待兔", pinyin: "shǒu zhū dài tù", meaning: "比喻不努力，存侥幸心理，坐等意外收获", example: "我们要主动学习，不能守株待兔。", category: "fable" },
    { word: "画蛇添足", pinyin: "huà shé tiān zú", meaning: "比喻做了多余的事情，反而不好", example: "这已经写得很好了，不要再画蛇添足了。", category: "fable" },
    { word: "亡羊补牢", pinyin: "wáng yáng bǔ láo", meaning: "出了问题后及时补救，防止继续损失", example: "这次没考好没关系，亡羊补牢还来得及。", category: "fable" },
    { word: "刻舟求剑", pinyin: "kè zhōu qiú jiàn", meaning: "比喻办事刻板，不知道随情况变化而变通", example: "社会发展了，我们的想法也要跟上，不能刻舟求剑。", category: "fable" },
    { word: "掩耳盗铃", pinyin: "yǎn ěr dào líng", meaning: "比喻自己欺骗自己，明明掩盖不了的事却要掩盖", example: "他犯错不承认，真是掩耳盗铃。", category: "fable" },
    { word: "自相矛盾", pinyin: "zì xiāng máo dùn", meaning: "比喻言语或行为前后抵触", example: "他的发言自相矛盾，大家都不相信了。", category: "fable" },
    { word: "坐井观天", pinyin: "zuò jǐng guān tiān", meaning: "比喻眼界狭窄，见识有限", example: "我们要多读书，不能坐井观天。", category: "fable" },
    { word: "叶公好龙", pinyin: "yè gōng hào lóng", meaning: "比喻表面上爱好某事物，实际上并不是真的爱好", example: "学习不能叶公好龙，要真正去行动。", category: "fable" },
    { word: "狐假虎威", pinyin: "hú jiǎ hǔ wēi", meaning: "比喻借别人的力量来吓唬人", example: "他总喜欢狐假虎威，仗势欺人。", category: "fable" },
    { word: "揠苗助长", pinyin: "yà miáo zhù zhǎng", meaning: "比喻急于求成，反而坏了事", example: "学习要循序渐进，不能揠苗助长。", category: "fable" },
    { word: "手忙脚乱", pinyin: "shǒu máng jiǎo luàn", meaning: "做事慌张，没有条理", example: "时间不够了，他急得手忙脚乱。", category: "action" },
    { word: "争先恐后", pinyin: "zhēng xiān kǒng hòu", meaning: "争着向前，唯恐落后", example: "下课铃响了，同学们争先恐后地跑出教室。", category: "action" },
    { word: "络绎不绝", pinyin: "luò yì bù jué", meaning: "来来往往，连续不断", example: "节假日里，游人络绎不绝。", category: "action" },
    { word: "日新月异", pinyin: "rì xīn yuè yì", meaning: "每天每月都有新变化，进步很快", example: "科技发展日新月异。", category: "action" },
    { word: "大步流星", pinyin: "dà bù liú xīng", meaning: "形容步伐矫健，走得很快", example: "他大步流星地走进了教室。", category: "action" },
    { word: "目不转睛", pinyin: "mù bù zhuǎn jīng", meaning: "不转眼地看，形容注意力很集中", example: "他目不转睛地盯着黑板。", category: "action" },
    { word: "东张西望", pinyin: "dōng zhāng xī wàng", meaning: "向四处张望，形容心神不安或到处看", example: "上课要专心，不要东张西望。", category: "action" },
    { word: "五光十色", pinyin: "wǔ guāng shí sè", meaning: "形容色彩鲜艳，花样繁多", example: "夜晚的灯光五光十色，漂亮极了。", category: "action" },
    { word: "成群结队", pinyin: "chéng qún jié duì", meaning: "一群一队地聚集在一起", example: "同学们成群结队地去操场。", category: "action" }
  ];

  const quizData = [
    { type: "choice", question: "\"春暖花开\"是描写哪个季节的词语？", options: ["春天", "夏天", "秋天", "冬天"], answer: 0 },
    { type: "choice", question: "下列词语中，哪个是形容人物品质的？", options: ["春暖花开", "助人为乐", "山清水秀", "蒙蒙细雨"], answer: 1 },
    { type: "fill", question: "小明把捡到的钱包还给了失主，真是______的好孩子。（拾金不昧）", answer: "拾金不昧" },
    { type: "choice", question: "\"闷闷不乐\"的意思是？", options: ["非常开心", "很着急", "心里不高兴", "很害怕"], answer: 2 },
    { type: "choice", question: "下列哪个不是描写心情的词语？", options: ["心花怒放", "眉开眼笑", "兴致勃勃", "山清水秀"], answer: 3 },
    { type: "fill", question: "科技发展______，人们的生活越来越方便。（日新月异）", answer: "日新月异" },
    { type: "choice", question: "\"迫不及待\"的意思是？", options: ["很有兴趣", "急得不能等待", "很高兴", "很认真"], answer: 1 },
    { type: "choice", question: "下列词语中，哪两个是反义词？", options: ["春暖花开 - 秋高气爽", "冰天雪地 - 春暖花开", "闷闷不乐 - 心花怒放", "助人为乐 - 拾金不昧"], answer: 2 },
    { type: "fill", question: "他______地练习，终于学会了游泳。（坚持不懈）", answer: "坚持不懈" },
    { type: "choice", question: "\"举一反三\"是哪种类型的词语？", options: ["描写景色", "描写心情", "学习成长", "描写动作"], answer: 2 },
    { type: "fill", question: "他______地写作业，连妈妈叫他吃饭都没听到。（专心致志）", answer: "专心致志" },
    { type: "choice", question: "\"持之以恒\"的意思是什么？", options: ["三心二意", "坚持到底不放弃", "变化很快", "非常着急"], answer: 1 },
    { type: "choice", question: "下列哪个词语是告诉我们要把学到的知识用起来？", options: ["学以致用", "博览群书", "废寝忘食", "温故知新"], answer: 0 },
    { type: "fill", question: "学习要______，多读课外书才能增长见识。（博览群书）", answer: "博览群书" },
    { type: "choice", question: "\"守株待兔\"告诉我们什么道理？", options: ["要耐心等待", "不要存侥幸心理，要努力", "要学会捉兔子", "要保护树木"], answer: 1 },
    { type: "choice", question: "图画得很好了，再加一笔反而多余，用哪个成语形容？", options: ["自相矛盾", "掩耳盗铃", "画蛇添足", "刻舟求剑"], answer: 2 },
    { type: "fill", question: "做事情要及时补救，______，为时未晚。（亡羊补牢）", answer: "亡羊补牢" },
    { type: "choice", question: "\"坐井观天\"比喻什么样的人？", options: ["知识渊博", "眼界狭窄", "勤劳勇敢", "聪明伶俐"], answer: 1 },
    { type: "choice", question: "\"风和日丽\"是用来描写什么的？", options: ["暴风雨", "天气晴朗", "夜晚", "冬天"], answer: 1 },
    { type: "choice", question: "描写雪后白色世界用的是哪个词语？", options: ["姹紫嫣红", "层林尽染", "银装素裹", "花红柳绿"], answer: 2 },
    { type: "fill", question: "花园里百花盛开，______，美丽极了。（姹紫嫣红）", answer: "姹紫嫣红" }
  ];

  const searchableVocabularies = vocabularies.map(function (item) {
    return Object.assign({}, item, {
      searchText: [item.word, item.pinyin, item.meaning].join(' ').toLowerCase()
    });
  });

  let currentQuiz = 0;
  let correctCount = 0;
  let learnedWords = 0;
  let selectedAnswer = null;

  function createFlashcard(vocabulary, todayCountEl) {
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.innerHTML = [
      '<div class="flashcard-inner">',
      '<div class="flashcard-front">',
      '<span class="word">' + vocabulary.word + '</span>',
      '<span class="hint">' + vocabulary.pinyin + '</span>',
      '</div>',
      '<div class="flashcard-back">',
      '<div class="meaning">' + vocabulary.meaning + '</div>',
      '<div class="example">' + vocabulary.example + '</div>',
      '</div>',
      '</div>'
    ].join('');

    card.addEventListener('click', function () {
      if (card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      learnedWords += 1;
      todayCountEl.textContent = String(learnedWords);
      updateAchievements();
    });

    return card;
  }

  function renderFlashcards(words) {
    const container = document.getElementById('flashcards');
    const todayCountEl = document.getElementById('todayCount');
    container.innerHTML = '';

    if (!words.length) {
      container.innerHTML = '<p style="color: white; font-size: 18px;">没有找到匹配的词语</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    words.forEach(function (item) {
      fragment.appendChild(createFlashcard(item, todayCountEl));
    });
    container.appendChild(fragment);
  }

  function initFlashcards(category) {
    const nextCategory = category || 'all';
    const words = nextCategory === 'all'
      ? searchableVocabularies
      : searchableVocabularies.filter(function (item) {
          return item.category === nextCategory;
        });

    renderFlashcards(words);
  }

  function searchWords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!searchTerm) {
      const activeTab = document.querySelector('.category-tab.active');
      initFlashcards(activeTab ? activeTab.dataset.category : 'all');
      return;
    }

    const matchedWords = searchableVocabularies.filter(function (item) {
      return item.searchText.indexOf(searchTerm) >= 0;
    });

    renderFlashcards(matchedWords);
  }

  function initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (item) {
          item.classList.remove('active');
        });
        tab.classList.add('active');
        document.getElementById('searchInput').value = '';
        initFlashcards(tab.dataset.category);
      });
    });
  }

  function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', searchWords);
    searchInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        searchWords();
      }
    });
  }

  function initQuiz() {
    renderQuiz();
  }

  function renderQuiz() {
    const content = document.getElementById('quizContent');
    const quiz = quizData[currentQuiz];

    document.getElementById('quizProgress').textContent = '第 ' + (currentQuiz + 1) + ' 题 / 共 ' + quizData.length + ' 题';
    document.getElementById('progressFill').style.width = ((currentQuiz + 1) / quizData.length) * 100 + '%';

    if (quiz.type === 'choice') {
      content.innerHTML = [
        '<div class="quiz-question">' + quiz.question + '</div>',
        '<div class="quiz-options">',
        quiz.options.map(function (option, index) {
          return '<div class="quiz-option" data-index="' + index + '">' + option + '</div>';
        }).join(''),
        '</div>'
      ].join('');

      document.querySelectorAll('.quiz-option').forEach(function (option) {
        option.addEventListener('click', function () {
          selectAnswer(parseInt(option.dataset.index, 10));
        });
      });
    } else if (quiz.type === 'fill') {
      content.innerHTML = [
        '<div class="fill-blank">',
        quiz.question.replace(/（.*?）/g, '<input type="text" id="fillAnswer" placeholder="请输入答案">'),
        '</div>',
        '<button class="next-btn" data-quiz-action="check-fill" type="button">提交答案</button>'
      ].join('');
    }

    selectedAnswer = null;
  }

  function selectAnswer(index) {
    if (selectedAnswer !== null) return;

    selectedAnswer = index;
    const quiz = quizData[currentQuiz];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach(function (option, optionIndex) {
      option.classList.remove('selected');
      if (optionIndex === index) {
        option.classList.add('selected');
      }
    });

    window.setTimeout(function () {
      if (index === quiz.answer) {
        options[index].classList.remove('selected');
        options[index].classList.add('correct');
        correctCount += 1;
      } else {
        options[index].classList.remove('selected');
        options[index].classList.add('wrong');
        options[quiz.answer].classList.add('correct');
      }

      document.getElementById('accuracy').textContent = Math.round((correctCount / (currentQuiz + 1)) * 100) + '%';
      updateAchievements();

      window.setTimeout(nextQuestion, 1500);
    }, 500);
  }

  function checkFillAnswer() {
    const input = document.getElementById('fillAnswer');
    const answer = input.value.trim();
    const quiz = quizData[currentQuiz];

    if (answer === quiz.answer) {
      correctCount += 1;
      input.style.borderColor = '#4caf50';
      input.style.background = '#e8f5e9';
    } else {
      input.style.borderColor = '#f44336';
      input.style.background = '#ffebee';
      window.alert('正确答案是：' + quiz.answer);
    }

    document.getElementById('accuracy').textContent = Math.round((correctCount / (currentQuiz + 1)) * 100) + '%';
    updateAchievements();

    window.setTimeout(nextQuestion, 1500);
  }

  function nextQuestion() {
    currentQuiz += 1;
    if (currentQuiz >= quizData.length) {
      showFinalResult();
      return;
    }
    renderQuiz();
  }

  function showFinalResult() {
    const content = document.getElementById('quizContent');
    const percentage = Math.round((correctCount / quizData.length) * 100);
    const emoji = percentage >= 80 ? '&#127942;' : percentage >= 60 ? '&#128579;' : '&#128549;';
    const message = percentage >= 80 ? '太棒了！继续保持！' : percentage >= 60 ? '还不错，继续加油！' : '多练习，你会越来越好！';

    content.innerHTML = [
      '<div class="quiz-result">',
      '<div class="result-icon">' + emoji + '</div>',
      '<div class="result-text">你答对了 ' + correctCount + ' / ' + quizData.length + ' 题</div>',
      '<p style="font-size: 18px; color: #666; margin-bottom: 30px;">' + message + '</p>',
      '<button class="next-btn" data-quiz-action="restart" type="button">再练一次</button>',
      '</div>'
    ].join('');
  }

  function restartQuiz() {
    currentQuiz = 0;
    correctCount = 0;
    document.getElementById('accuracy').textContent = '0%';
    renderQuiz();
  }

  function updateAchievements() {
    if (learnedWords >= 10) {
      document.getElementById('ach2').classList.remove('locked');
      document.getElementById('ach2').classList.add('unlocked');
    }

    if (correctCount >= 5) {
      document.getElementById('ach3').classList.remove('locked');
      document.getElementById('ach3').classList.add('unlocked');
    }

    if (currentQuiz >= quizData.length - 1) {
      document.getElementById('ach4').classList.remove('locked');
      document.getElementById('ach4').classList.add('unlocked');
    }
  }

  function formatLateGradeVocabulary() {
    const rows = document.querySelectorAll('main .study-block.grade-four .routine p, main .study-block.grade-five .routine p');

    rows.forEach(function (row) {
      if (row.dataset.vocabFormatted === 'true') return;

      const strong = row.querySelector(':scope > strong');
      const title = strong ? strong.textContent.trim() : '';
      const fullText = row.textContent.trim();
      const listText = strong ? fullText.slice(title.length).trim() : fullText;
      const isUsageNote = /运用/.test(title);
      const hasWordList = /[、,，]/.test(listText);

      if (!hasWordList || isUsageNote) {
        row.classList.add('late-vocab-note');
        row.dataset.vocabFormatted = 'true';
        return;
      }

      const lesson = document.createElement('div');
      lesson.className = 'late-vocab-lesson';

      if (title) {
        const heading = document.createElement('p');
        heading.className = 'late-vocab-lesson-title';
        heading.textContent = title;
        lesson.appendChild(heading);
      }

      const tagWrap = document.createElement('div');
      tagWrap.className = 'late-vocab-tags';

      listText.split(/[、,，]/)
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean)
        .forEach(function (item) {
          const chip = document.createElement('span');
          chip.className = 'late-vocab-chip';

          const match = item.match(/^(.+?)[(（]([^()（）]+)[)）]$/);
          if (match) {
            const word = document.createElement('strong');
            word.textContent = match[1].trim();
            const pinyin = document.createElement('span');
            pinyin.textContent = match[2].trim();
            chip.append(word, pinyin);
          } else {
            const word = document.createElement('strong');
            word.textContent = item;
            chip.appendChild(word);
          }

          tagWrap.appendChild(chip);
        });

      lesson.appendChild(tagWrap);
      row.replaceWith(lesson);
    });
  }

  function bindQuizActions() {
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;

    quizContent.addEventListener('click', function (event) {
      const actionButton = event.target.closest('[data-quiz-action]');
      if (!actionButton) return;

      if (actionButton.dataset.quizAction === 'check-fill') {
        checkFillAnswer();
        return;
      }

      if (actionButton.dataset.quizAction === 'restart') {
        restartQuiz();
      }
    });
  }

  function init() {
    initFlashcards();
    initCategoryTabs();
    initSearch();
    initQuiz();
    bindQuizActions();
    formatLateGradeVocabulary();
    updateAchievements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
