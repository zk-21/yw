// 练习数据
const transformData = [
  // 被字句转换
  {
    type: '被字句',
    sentence: '小明打死了蚊子。',
    options: ['蚊子被小明打死了。', '蚊子打了小明。', '小明被蚊子打死了。', '蚊子是小明打死的。'],
    answer: 0,
    level: 'easy',
    explanation: '把字句改被字句的方法是：将动作的承受者（蚊子）放到前面，加上"被"字，再加上动作的发出者（小明）。',
    mistakeReason: '容易把施动者和受动者弄反。被字句的结构是"受动者+被+施动者+动作"。'
  },
  {
    type: '被字句',
    sentence: '小红写完了作业。',
    options: ['作业被小红写完了。', '小红被作业写完了。', '作业写完了小红。', '写完了小红的作业。'],
    answer: 0,
    level: 'easy'
  },
  {
    type: '被字句',
    sentence: '爸爸修好了自行车。',
    options: ['自行车被爸爸修好了。', '爸爸被自行车修好了。', '修好了爸爸的自行车。', '自行车修好了爸爸。'],
    answer: 0,
    level: 'easy'
  },
  {
    type: '被字句',
    sentence: '老师表扬了小明。',
    options: ['小明被老师表扬了。', '老师被小明表扬了。', '表扬了老师的小明。', '小明表扬了老师。'],
    answer: 0,
    level: 'easy'
  },
  // 把字句转换
  {
    type: '把字句',
    sentence: '妈妈洗好了衣服。',
    options: ['衣服被妈妈洗好了。', '妈妈把衣服洗好了。', '衣服洗好了妈妈。', '洗好了妈妈的衣服。'],
    answer: 1,
    level: 'easy'
  },
  {
    type: '把字句',
    sentence: '弟弟吃完了蛋糕。',
    options: ['蛋糕被弟弟吃完了。', '弟弟把蛋糕吃完了。', '蛋糕吃完了弟弟。', '吃完了弟弟的蛋糕。'],
    answer: 1,
    level: 'easy'
  },
  {
    type: '把字句',
    sentence: '妹妹画好了图画。',
    options: ['图画被妹妹画好了。', '妹妹把图画画好了。', '图画画好了妹妹。', '画好了妹妹的图画。'],
    answer: 1,
    level: 'easy'
  },
  {
    type: '把字句',
    sentence: '哥哥整理好了书包。',
    options: ['书包被哥哥整理好了。', '哥哥把书包整理好了。', '书包整理好了哥哥。', '整理好了哥哥的书包。'],
    answer: 1,
    level: 'easy'
  },
  // 反问句转换
  {
    type: '反问句',
    sentence: '我们不应该珍惜时间。',
    options: ['我们怎么不珍惜时间呢？', '我们难道应该浪费时间吗？', '我们难道不应该珍惜时间吗？', '我们珍惜时间。'],
    answer: 2,
    level: 'medium'
  },
  {
    type: '反问句',
    sentence: '这是一本好书。',
    options: ['这不是一本好书吗？', '这难道是一本好书吗？', '这难道不是一本好书吗？', '这真是一本好书。'],
    answer: 2,
    level: 'medium'
  },
  {
    type: '反问句',
    sentence: '他是一个勇敢的人。',
    options: ['他不是一个勇敢的人吗？', '他难道是一个勇敢的人吗？', '他难道不是一个勇敢的人吗？', '他真是勇敢。'],
    answer: 2,
    level: 'medium'
  },
  {
    type: '反问句',
    sentence: '我们应该帮助同学。',
    options: ['我们怎么不帮助同学呢？', '我们难道应该帮助同学吗？', '我们难道不应该帮助同学吗？', '我们要帮助同学。'],
    answer: 2,
    level: 'medium'
  },
  // 陈述句转换
  {
    type: '陈述句',
    sentence: '这个问题难道很难吗？',
    options: ['这个问题不难。', '这个问题很难。', '这个问题很简单。', '这个问题不是很难。'],
    answer: 0,
    level: 'medium'
  },
  {
    type: '陈述句',
    sentence: '你难道不开心吗？',
    options: ['你很开心。', '你不开心。', '你难道开心吗？', '你是不是开心？'],
    answer: 0,
    level: 'medium'
  },
  {
    type: '陈述句',
    sentence: '他难道不是好学生吗？',
    options: ['他是好学生。', '他不是好学生。', '他难道是好学生吗？', '他是个学生。'],
    answer: 0,
    level: 'medium'
  },
  {
    type: '陈述句',
    sentence: '这难道不是美丽的风景吗？',
    options: ['这是美丽的风景。', '这不是美丽的风景。', '这难道是美丽的风景吗？', '这风景很美。'],
    answer: 0,
    level: 'medium'
  },
  // 扩句练习
  {
    type: '扩句',
    sentence: '小鸟飞。',
    options: ['小鸟在天上飞。', '可爱的小鸟在天上飞。', '可爱的小鸟在蓝天上自由地飞。', '小鸟飞得很高。'],
    answer: 2,
    level: 'hard'
  },
  {
    type: '扩句',
    sentence: '小猫吃鱼。',
    options: ['小猫在吃鱼。', '可爱的小猫在吃鱼。', '可爱的小猫在桌子旁津津有味地吃鱼。', '小猫吃得很香。'],
    answer: 2,
    level: 'hard'
  },
  {
    type: '扩句',
    sentence: '太阳升起。',
    options: ['太阳从东方升起。', '红红的太阳从东方升起。', '红红的太阳从东方慢慢升起。', '太阳升得很高。'],
    answer: 2,
    level: 'hard'
  },
  {
    type: '扩句',
    sentence: '花儿开放。',
    options: ['花儿在春天开放。', '美丽的花儿在春天开放。', '美丽的花儿在春天竞相开放。', '花儿开得很美。'],
    answer: 2,
    level: 'hard'
  },
  // 缩句练习
  {
    type: '缩句',
    sentence: '可爱的小鸟在蓝天上自由地飞。',
    options: ['小鸟飞。', '可爱的小鸟飞。', '小鸟在天上飞。', '小鸟自由地飞。'],
    answer: 0,
    level: 'hard'
  },
  {
    type: '缩句',
    sentence: '妈妈在厨房里认真地做饭。',
    options: ['妈妈做饭。', '妈妈在做饭。', '妈妈认真地做饭。', '妈妈在厨房做饭。'],
    answer: 0,
    level: 'hard'
  },
  {
    type: '缩句',
    sentence: '小明在教室里认真地写作业。',
    options: ['小明写作业。', '小明在写作业。', '小明认真地写作业。', '小明在教室写作业。'],
    answer: 0,
    level: 'hard'
  },
  {
    type: '缩句',
    sentence: '红红的太阳从东方慢慢升起。',
    options: ['太阳升起。', '太阳从东方升起。', '红红的太阳升起。', '太阳慢慢升起。'],
    answer: 0,
    level: 'hard'
  },
  // 更多被字句
  {
    type: '被字句',
    sentence: '大风刮倒了大树。',
    options: ['大树被大风刮倒了。', '大风被大树刮倒了。', '刮倒了大风的大树。', '大树刮倒了大风。'],
    answer: 0,
    level: 'easy'
  },
  {
    type: '被字句',
    sentence: '雨水打湿了衣服。',
    options: ['衣服被雨水打湿了。', '雨水被衣服打湿了。', '打湿了雨水的衣服。', '衣服打湿了雨水。'],
    answer: 0,
    level: 'easy'
  },
  // 更多把字句
  {
    type: '把字句',
    sentence: '小明收拾好了房间。',
    options: ['房间被小明收拾好了。', '小明把房间收拾好了。', '房间收拾好了小明。', '收拾好了小明的房间。'],
    answer: 1,
    level: 'easy'
  },
  {
    type: '把字句',
    sentence: '妹妹打扫干净了院子。',
    options: ['院子被妹妹打扫干净了。', '妹妹把院子打扫干净了。', '院子打扫干净了妹妹。', '打扫干净了妹妹的院子。'],
    answer: 1,
    level: 'easy'
  },
  // 更多反问句
  {
    type: '反问句',
    sentence: '我们应该好好学习。',
    options: ['我们怎么不好好学习呢？', '我们难道应该好好学习吗？', '我们难道不应该好好学习吗？', '我们要好好学习。'],
    answer: 2,
    level: 'medium'
  },
  {
    type: '反问句',
    sentence: '这是正确的答案。',
    options: ['这不是正确的答案吗？', '这难道是正确的答案吗？', '这难道不是正确的答案吗？', '这答案是正确的。'],
    answer: 2,
    level: 'medium'
  },
  // 更多陈述句
  {
    type: '陈述句',
    sentence: '他难道不喜欢读书吗？',
    options: ['他喜欢读书。', '他不喜欢读书。', '他难道喜欢读书吗？', '他是不是喜欢读书？'],
    answer: 0,
    level: 'medium'
  },
  {
    type: '陈述句',
    sentence: '这难道不是有趣的故事吗？',
    options: ['这是有趣的故事。', '这不是有趣的故事。', '这难道是有趣的故事吗？', '这故事很有趣。'],
    answer: 0,
    level: 'medium'
  }
];

const rhetoricData = [
  // 基础题：判断修辞 - 比喻
  {
    type: 'identify',
    sentence: '弯弯的月亮像小船。',
    answer: '比喻',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把月亮比作小船，用了"像"这个比喻词'
  },
  {
    type: 'identify',
    sentence: '太阳像一个大火球。',
    answer: '比喻',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把太阳比作大火球，形象地写出了太阳的炎热'
  },
  {
    type: 'identify',
    sentence: '大象的耳朵像扇子。',
    answer: '比喻',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把大象的耳朵比作扇子，突出了耳朵大的特点'
  },
  {
    type: 'identify',
    sentence: '平静的湖面像一面镜子。',
    answer: '比喻',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把湖面比作镜子，写出了湖水的平静'
  },
  // 基础题：判断修辞 - 拟人
  {
    type: 'identify',
    sentence: '花儿笑弯了腰。',
    answer: '拟人',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把花儿当作人来写，赋予它"笑"的动作'
  },
  {
    type: 'identify',
    sentence: '小鸟在树上唱歌。',
    answer: '拟人',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把小鸟当作人来写，让小鸟有了唱歌的能力'
  },
  {
    type: 'identify',
    sentence: '风儿轻轻地抚摸着我的脸。',
    answer: '拟人',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把风当作人来写，赋予它"抚摸"的动作'
  },
  {
    type: 'identify',
    sentence: '小草从土里探出头来。',
    answer: '拟人',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '把小草当作人来写，"探出头"是人的动作'
  },
  // 基础题：判断修辞 - 排比
  {
    type: 'identify',
    sentence: '书是钥匙，书是明灯，书是朋友。',
    answer: '排比',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '用了三个结构相似的句子，增强了表达效果'
  },
  {
    type: 'identify',
    sentence: '下课了，同学们有的跳绳，有的打球，有的看书。',
    answer: '排比',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '用了"有的...有的...有的..."的排比句式'
  },
  {
    type: 'identify',
    sentence: '春天来了，草绿了，花开了，小鸟歌唱了。',
    answer: '排比',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '用了三个结构相似的短句，描绘春天的景象'
  },
  {
    type: 'identify',
    sentence: '我们要爱学习，爱劳动，爱祖国。',
    answer: '排比',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '用了三个"爱..."的排比句式'
  },
  // 基础题：判断修辞 - 夸张
  {
    type: 'identify',
    sentence: '他高得能摸到天。',
    answer: '夸张',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '故意夸大了他的身高，突出他很高'
  },
  {
    type: 'identify',
    sentence: '教室里静得连根针掉下来都能听见。',
    answer: '夸张',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '故意夸大了安静的程度，突出教室很静'
  },
  {
    type: 'identify',
    sentence: '他饿得能吃下一头牛。',
    answer: '夸张',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '故意夸大了饥饿的程度，突出他很饿'
  },
  {
    type: 'identify',
    sentence: '飞流直下三千尺。',
    answer: '夸张',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'easy',
    tip: '用夸张手法写出了瀑布很高'
  },
  // 提优题：说明好处
  {
    type: 'explain',
    sentence: '小鸟在树上唱歌。',
    answer: '拟人',
    options: ['让句子更生动有趣', '让句子更长', '让句子更难', '没有好处'],
    level: 'medium',
    tip: '把小鸟当作人来写，让读者感觉小鸟像人一样有感情'
  },
  {
    type: 'explain',
    sentence: '教室里静得连根针掉下来都能听见。',
    answer: '夸张',
    options: ['突出教室很安静', '说明教室很小', '说明针很响', '没有好处'],
    level: 'medium',
    tip: '用夸张的手法，让读者更能感受到教室的安静'
  },
  {
    type: 'explain',
    sentence: '弯弯的月亮像小船。',
    answer: '比喻',
    options: ['让月亮的形状更形象', '让句子更难理解', '没有好处', '让句子变短'],
    level: 'medium',
    tip: '用比喻让抽象的月亮形状变得具体可感'
  },
  {
    type: 'explain',
    sentence: '书是钥匙，书是明灯，书是朋友。',
    answer: '排比',
    options: ['增强表达气势', '让句子更短', '让句子更简单', '没有好处'],
    level: 'medium',
    tip: '排比句式能增强语势，表达更有力量'
  },
  // 拔高题：仿写和改写
  {
    type: 'rewrite',
    sentence: '太阳升起来了。',
    answer: '拟人',
    options: ['太阳公公慢慢爬上了天空', '太阳很大', '太阳是圆的', '太阳很热'],
    level: 'hard',
    tip: '把太阳当作人来写，让句子更生动'
  },
  {
    type: 'rewrite',
    sentence: '树叶落下来。',
    answer: '比喻',
    options: ['树叶像蝴蝶一样飘落下来', '树叶很多', '树叶是绿色的', '树叶从树上掉下来'],
    level: 'hard',
    tip: '把树叶比作蝴蝶，让画面感更强'
  },
  {
    type: 'rewrite',
    sentence: '小草生长。',
    answer: '拟人',
    options: ['小草从土里探出头来', '小草是绿色的', '小草很多', '小草长高了'],
    level: 'hard',
    tip: '把小草当作人来写，用"探出头"更生动'
  },
  {
    type: 'rewrite',
    sentence: '雨下得很大。',
    answer: '夸张',
    options: ['雨下得像瓢泼一样', '雨是水做的', '雨从天上落下来', '下雨了'],
    level: 'hard',
    tip: '用夸张手法突出雨大的特点'
  },
  {
    type: 'rewrite',
    sentence: '同学们很开心。',
    answer: '排比',
    options: ['同学们有的笑，有的跳，有的拍手', '同学们很高兴', '同学们在玩耍', '同学们很多'],
    level: 'hard',
    tip: '用排比句式能更生动地表现开心的样子'
  },
  // 更多拔高题
  {
    type: 'identify',
    sentence: '小溪唱着歌向前流去。',
    answer: '拟人',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'medium',
    tip: '把小溪当作人来写，赋予它"唱歌"的能力'
  },
  {
    type: 'identify',
    sentence: '圆圆的苹果像红灯笼。',
    answer: '比喻',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'medium',
    tip: '把苹果比作红灯笼，写出了苹果又圆又红的特点'
  },
  {
    type: 'identify',
    sentence: '他跑得像飞一样快。',
    answer: '夸张',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'medium',
    tip: '用夸张手法突出他跑得快'
  },
  {
    type: 'identify',
    sentence: '我爱妈妈，我爱爸爸，我爱我的家。',
    answer: '排比',
    options: ['比喻', '拟人', '排比', '夸张'],
    level: 'medium',
    tip: '用排比句式表达对家人的爱'
  },
  {
    type: 'rewrite',
    sentence: '雪花飘落。',
    answer: '比喻',
    options: ['雪花像棉花糖一样飘落', '雪花是白色的', '雪花从天上落下', '下雪了'],
    level: 'hard',
    tip: '把雪花比作棉花糖，突出雪花的轻盈洁白'
  },
  {
    type: 'rewrite',
    sentence: '星星很亮。',
    answer: '比喻',
    options: ['星星像钻石一样闪亮', '星星很多', '星星在天上', '星星会发光'],
    level: 'hard',
    tip: '把星星比作钻石，突出星星的闪亮'
  }
];

const poemData = [
  {
    title: '静夜思',
    author: '李白',
    text: '床前明月光，疑是地上霜。举头望明月，_____。',
    answers: ['低头思故乡'],
    tips: '提示：这首诗描写了诗人思念故乡的情感'
  },
  {
    title: '春晓',
    author: '孟浩然',
    text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，_____。',
    answers: ['花落知多少'],
    tips: '提示：诗中写到了春天早晨醒来听到鸟叫声'
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    text: '白日依山尽，黄河入海流。欲穷千里目，_____。',
    answers: ['更上一层楼'],
    tips: '提示：这句诗告诉我们要有更高的追求'
  }
];

const vocabData = [
  // 简单难度 - 基础词语
  {
    sentence: '春天来了，小草______从土里钻出来。',
    options: ['慢慢', '快快', '轻轻', '悄悄'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '他______学习，成绩进步很大。',
    options: ['认真地', '开心地', '慢慢地', '轻轻地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '妈妈______把书包递给我。',
    options: ['开心地', '轻轻地', '慢慢地', '认真地'],
    answer: 1,
    level: 'easy'
  },
  {
    sentence: '小鸟______在树上唱歌。',
    options: ['开心地', '慢慢地', '轻轻地', '认真地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '爸爸______走进房间。',
    options: ['慢慢', '快快', '轻轻', '悄悄'],
    answer: 2,
    level: 'easy'
  },
  {
    sentence: '雨______下着。',
    options: ['慢慢', '哗哗', '轻轻', '悄悄'],
    answer: 1,
    level: 'easy'
  },
  {
    sentence: '弟弟______跑过来。',
    options: ['慢慢', '快快', '轻轻', '悄悄'],
    answer: 1,
    level: 'easy'
  },
  {
    sentence: '妹妹______笑了。',
    options: ['开心地', '慢慢地', '轻轻地', '认真地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '花儿______开放。',
    options: ['慢慢', '快快', '轻轻', '悄悄'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '风______吹着。',
    options: ['慢慢', '呼呼', '轻轻', '悄悄'],
    answer: 1,
    level: 'easy'
  },
  // 中等难度 - 词语搭配
  {
    sentence: '太阳______升起，照亮了整个大地。',
    options: ['慢慢地', '高高地', '缓缓地', '快速地'],
    answer: 1,
    level: 'medium'
  },
  {
    sentence: '秋天到了，树叶______飘落下来。',
    options: ['慢慢地', '轻轻地', '纷纷地', '快快地'],
    answer: 2,
    level: 'medium'
  },
  {
    sentence: '同学们______听老师讲课。',
    options: ['认真地', '开心地', '慢慢地', '轻轻地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '小明______完成了作业。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '妈妈______做晚饭。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '爷爷______看报纸。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 2,
    level: 'medium'
  },
  {
    sentence: '妹妹______画画。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 1,
    level: 'medium'
  },
  {
    sentence: '小猫______吃鱼。',
    options: ['开心地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '小鸟______飞翔。',
    options: ['自由地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '小溪______流淌。',
    options: ['慢慢', '哗哗', '欢快地', '悄悄'],
    answer: 2,
    level: 'medium'
  },
  // 较难难度 - 词语辨析
  {
    sentence: '听到这个好消息，大家______欢呼起来。',
    options: ['开心地', '高兴地', '兴奋地', '激动地'],
    answer: 3,
    level: 'hard'
  },
  {
    sentence: '他______完成了作业，然后出去玩了。',
    options: ['认真地', '快速地', '仔细地', '顺利地'],
    answer: 3,
    level: 'hard'
  },
  {
    sentence: '运动员______冲向终点。',
    options: ['快速地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '老师______批改作业。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 3,
    level: 'hard'
  },
  {
    sentence: '孩子们______玩耍。',
    options: ['开心地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '雪花______飘落。',
    options: ['慢慢', '轻轻', '纷纷地', '欢快地'],
    answer: 1,
    level: 'hard'
  },
  {
    sentence: '同学们______讨论问题。',
    options: ['热烈地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '妈妈______收拾房间。',
    options: ['认真地', '开心地', '快速地', '仔细地'],
    answer: 2,
    level: 'hard'
  },
  {
    sentence: '太阳______照耀着大地。',
    options: ['温暖地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '河水______流过村庄。',
    options: ['缓缓地', '快速地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  // 更多练习
  {
    sentence: '弟弟______吃苹果。',
    options: ['开心地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '姐姐______看书。',
    options: ['认真地', '开心地', '慢慢地', '轻轻地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '小狗______摇尾巴。',
    options: ['开心地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '小鸡______吃米。',
    options: ['慢慢', '快快', '轻轻', '悄悄'],
    answer: 0,
    level: 'easy'
  },
  {
    sentence: '蜜蜂______采蜜。',
    options: ['忙碌地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '蝴蝶______飞舞。',
    options: ['美丽地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '树叶______摇动。',
    options: ['轻轻', '慢慢', '哗哗', '悄悄'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '海浪______拍打着沙滩。',
    options: ['猛烈地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '火车______驶过大桥。',
    options: ['快速地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '飞机______飞向蓝天。',
    options: ['高高地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '同学们______打扫教室。',
    options: ['认真地', '开心地', '快速地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '农民______收割庄稼。',
    options: ['忙碌地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '画家______画风景。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 3,
    level: 'hard'
  },
  {
    sentence: '音乐家______演奏乐曲。',
    options: ['深情地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '厨师______做美食。',
    options: ['精心地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '医生______看病。',
    options: ['认真地', '开心地', '慢慢地', '仔细地'],
    answer: 3,
    level: 'hard'
  },
  {
    sentence: '警察______巡逻。',
    options: ['认真地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '消防员______灭火。',
    options: ['勇敢地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'hard'
  },
  {
    sentence: '孩子们______读书。',
    options: ['认真地', '开心地', '慢慢地', '大声地'],
    answer: 3,
    level: 'medium'
  },
  {
    sentence: '鸟儿______歌唱。',
    options: ['欢快地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '星星______闪烁。',
    options: ['明亮地', '慢慢地', '轻轻地', '仔细地'],
    answer: 0,
    level: 'medium'
  },
  {
    sentence: '月亮______升起。',
    options: ['慢慢地', '高高地', '缓缓地', '快速地'],
    answer: 2,
    level: 'medium'
  }
];

const readingData = [
  // 三年级短文（简单）
  {
    text: '春天的公园真美啊！柳树发出了嫩绿的新芽，桃花绽开了粉红的笑脸。小河解冻了，哗哗地唱着歌。草地上，小朋友们在放风筝、做游戏，开心极了！',
    question: '这段话主要写了什么？',
    options: ['春天公园的美丽景色和小朋友玩耍', '小朋友们在公园里放风筝', '柳树发芽了', '小河解冻了'],
    answer: 0,
    level: 'easy',
    grade: 3
  },
  {
    text: '小猫花花特别喜欢吃鱼。每天早上，它都会蹲在鱼缸旁边，盯着里面的金鱼看。有时候，它还会伸出爪子去抓，逗得我们哈哈大笑。',
    question: '小猫花花喜欢做什么？',
    options: ['喜欢吃鱼', '喜欢睡觉', '喜欢抓老鼠', '喜欢晒太阳'],
    answer: 0,
    level: 'easy',
    grade: 3
  },
  {
    text: '今天是星期天，天气晴朗。我和妈妈一起去超市买东西。超市里的东西真多呀！有水果、蔬菜、玩具，还有我最喜欢的巧克力。',
    question: '"我"和谁一起去超市？',
    options: ['爸爸', '妈妈', '爷爷', '奶奶'],
    answer: 1,
    level: 'easy',
    grade: 3
  },
  {
    text: '秋天到了，树上的叶子变黄了，一片片飘落下来，像一只只黄色的蝴蝶。小朋友们在树下捡树叶，做书签，开心极了。',
    question: '树叶像什么？',
    options: ['蝴蝶', '小船', '扇子', '羽毛'],
    answer: 0,
    level: 'easy',
    grade: 3
  },
  {
    text: '下课了，同学们来到操场上活动。有的跳绳，有的踢毽子，有的跑步，还有的打乒乓球。校园里到处都是欢声笑语。',
    question: '这段话主要写了什么？',
    options: ['同学们在操场上活动', '同学们在上课', '同学们在画画', '同学们在看书'],
    answer: 0,
    level: 'easy',
    grade: 3
  },
  // 四年级短文（中等）
  {
    text: '小明每天早上都坚持跑步。他说跑步不仅能锻炼身体，还能让他一天都精力充沛。现在他的身体越来越强壮了，体育成绩也提高了很多。',
    question: '小明坚持跑步有什么收获？',
    options: ['身体变强壮，成绩提高', '认识了新朋友', '学会了游泳', '变得更聪明'],
    answer: 0,
    level: 'medium',
    grade: 4
  },
  {
    text: '读书是一件很快乐的事。通过读书，我们可以学到很多知识，了解很多有趣的事情。书就像一位好朋友，陪伴我们成长，教会我们道理。',
    question: '作者为什么说读书是快乐的事？',
    options: ['能学到知识，了解有趣的事', '书很便宜', '读书可以打发时间', '书很好看'],
    answer: 0,
    level: 'medium',
    grade: 4
  },
  {
    text: '夏天的夜晚，萤火虫在草丛中飞来飞去，像一盏盏小灯笼。青蛙在池塘边呱呱地叫着，好像在开演唱会。星星在天上眨着眼睛，美丽极了。',
    question: '文中把萤火虫比作什么？',
    options: ['小灯笼', '星星', '灯笼', '灯泡'],
    answer: 0,
    level: 'medium',
    grade: 4
  },
  {
    text: '小红是个乐于助人的好孩子。有一次，同学忘记带雨伞，她主动把自己的伞借给同学。还有一次，她帮老师整理作业本，受到了老师的表扬。',
    question: '从哪里可以看出小红乐于助人？',
    options: ['借伞给同学，帮老师整理作业', '学习成绩好', '喜欢读书', '长得漂亮'],
    answer: 0,
    level: 'medium',
    grade: 4
  },
  {
    text: '蚂蚁是一种非常勤劳的小动物。它们每天都忙着寻找食物，然后搬回洞里储存起来。即使遇到困难，它们也从不放弃，总是团结在一起克服困难。',
    question: '蚂蚁有什么特点？',
    options: ['勤劳、团结', '懒惰、自私', '聪明、狡猾', '胆小、怕事'],
    answer: 0,
    level: 'medium',
    grade: 4
  },
  // 五年级短文（较难）
  {
    text: '在一个寒冷的冬天，一只小鸟不小心从树上掉下来，冻得瑟瑟发抖。一位小朋友看见了，赶紧把小鸟捧在手里，用自己的体温温暖它。最后，小鸟恢复了体力，飞向了蓝天。',
    question: '小朋友是怎样帮助小鸟的？',
    options: ['用体温温暖小鸟', '给小鸟喂食', '把小鸟带回家', '给小鸟唱歌'],
    answer: 0,
    level: 'hard',
    grade: 5
  },
  {
    text: '时间就像流水一样，一去不复返。我们应该珍惜每一分每一秒，努力学习，做有意义的事情。只有这样，当我们回首往事时，才不会感到后悔。',
    question: '这段话告诉我们什么道理？',
    options: ['要珍惜时间', '时间过得很慢', '时间可以倒流', '时间不重要'],
    answer: 0,
    level: 'hard',
    grade: 5
  },
  {
    text: '母爱是世界上最伟大的爱。妈妈每天为我们做饭、洗衣服、辅导功课，从不抱怨。她们用无私的爱呵护着我们成长，是我们最应该感谢的人。',
    question: '为什么说母爱是伟大的？',
    options: ['妈妈无私地照顾我们', '妈妈很漂亮', '妈妈很有钱', '妈妈很年轻'],
    answer: 0,
    level: 'hard',
    grade: 5
  },
  {
    text: '学习就像爬山，只有坚持不懈，才能到达山顶。在学习的过程中，我们会遇到很多困难，但只要不放弃，一步一步往上爬，就一定能取得成功。',
    question: '这段话用了什么修辞手法？',
    options: ['比喻', '拟人', '排比', '夸张'],
    answer: 0,
    level: 'hard',
    grade: 5
  },
  {
    text: '在一次运动会上，小明参加了跑步比赛。虽然他一开始跑得很慢，但他没有放弃，而是咬紧牙关，奋力追赶。最后，他超过了所有对手，获得了第一名。',
    question: '小明为什么能获得第一名？',
    options: ['坚持不懈，奋力追赶', '跑得很快', '运气好', '对手太弱'],
    answer: 0,
    level: 'hard',
    grade: 5
  }
];

const thinkingData = [
  // ===== 升格训练 =====
  {
    type: 'upgrade',
    badge: '升格训练',
    title: '升格训练：把句子写生动',
    original: '我很开心。',
    improved: '我的心里像吃了蜜一样甜，嘴角忍不住向上翘起。',
    question: '以上两个句子，哪个写得更好？为什么？',
    options: [
      { text: 'A句（润色后）更好，因为用了比喻让"开心"更具体形象', correct: true },
      { text: 'B句（原句）更好，因为句子更短更简单', correct: false },
      { text: '两句话写得一样好，没有区别', correct: false },
      { text: '原句更好，因为看起来更真实', correct: false }
    ],
    explanation: '满分句运用了比喻修辞（"像吃了蜜一样甜"）和动作描写（"嘴角向上翘起"），把抽象的"开心"变成了可以看见的画面。这就是"用具体代替抽象"的写作技巧——不直接告诉读者你的感受，而是通过描写让读者自己感受到。'
  },
  {
    type: 'upgrade',
    badge: '升格训练',
    title: '升格训练：把动作写具体',
    original: '他跑得很快。',
    improved: '他像一阵风似的冲了出去，双腿飞快地交替着，身后扬起一片尘土。',
    question: '两个句子表达"跑得快"的意思，哪个更好？为什么？',
    options: [
      { text: '润色句更好，因为它用比喻和细节描写让画面更生动', correct: true },
      { text: '原句更好，因为简单直接，一看就懂', correct: false },
      { text: '两句话没有区别，意思一样', correct: false },
      { text: '润色句太夸张了，不够真实', correct: false }
    ],
    explanation: '满分句用了三个技巧：①比喻（"像一阵风"）让速度变得可感；②动作分解（"双腿飞快地交替"）让画面更具体；③环境烘托（"扬起一片尘土"）侧面描写速度。这就是"把笼统变具体"的写作方法——不要只告诉读者"很快"，要让他们看到"有多快"。'
  },
  {
    type: 'upgrade',
    badge: '升格训练',
    title: '升格训练：把环境写安静',
    original: '教室里很安静。',
    improved: '教室里静得出奇，连窗外树叶沙沙的声音都听得一清二楚，同学们连大气都不敢喘。',
    question: '写"安静"的两个句子，哪个更打动人？为什么？',
    options: [
      { text: '润色句更好，因为用细节和侧面描写让人感受到安静', correct: true },
      { text: '原句更好，因为简洁明了不啰嗦', correct: false },
      { text: '两个句子写得一样好', correct: false },
      { text: '润色句写得不够准确，没有直接说安静', correct: false }
    ],
    explanation: '满分句用的是"侧面烘托"手法：不直接说"安静"，而是通过"树叶沙沙声都听得见""大气都不敢喘"来让读者自己感受到安静的程度。好的写作不是告诉读者结论，而是让读者自己得出结论。'
  },
  // ===== 对比分析 =====
  {
    type: 'compare',
    badge: '对比分析',
    title: '对比分析：阅读题回答',
    compareLow: '小明很勇敢。',
    compareHigh: '从"小明毫不犹豫地冲进火海救小猫"这句话可以看出，小明是一个勇敢的人。因为"毫不犹豫"说明他没想危险，"冲进火海"说明他在最危险时刻选择救人。',
    question: '同一道题的两个答案，哪个得分更高？为什么？',
    options: [
      { text: '满分答案更好，因为它有原文依据和详细分析', correct: true },
      { text: '低分答案更好，因为简洁直接不啰嗦', correct: false },
      { text: '两个答案得分应该一样', correct: false },
      { text: '满分答案太长，考试写不完', correct: false }
    ],
    explanation: '低分答案只给了结论，没有证明过程，阅卷老师无法判断你是否读懂了文章。满分答案做到了三点：①引用原文关键词当证据；②解释关键词含义（"毫不犹豫"说明…）；③分析行为背后的品质。这就是阅读题的"观点+证据+分析"答题法——结论只是起点，依据和分析才是得分的关键。'
  },
  {
    type: 'compare',
    badge: '对比分析',
    title: '对比分析：概括段落大意',
    compareLow: '这段写了公园。',
    compareHigh: '这段话描写了春天公园的美丽景色：柳树发芽、桃花盛开、小河解冻，以及小朋友们在草地上开心玩耍的场景。',
    question: '概括段落大意的两个答案，哪个更符合要求？为什么？',
    options: [
      { text: '满分答案更好，因为它具体写出了段落中的要素', correct: true },
      { text: '低分答案更好，因为概括本身就是简单说重点', correct: false },
      { text: '两个答案都可以，得分一样', correct: false },
      { text: '低分答案更简洁，所以更好', correct: false }
    ],
    explanation: '概括内容不是"越短越好"，而是"准确全面"。低分答案只说"写了公园"，太笼统，没有体现段落的核心内容。满分答案做到了：①点明主题（春天公园景色）；②列举具体内容（柳树、桃花、小河、小朋友）；③用"：列举"的结构让条理清晰。好的概括能让没读过原文的人也能知道段落写了什么。'
  },
  {
    type: 'compare',
    badge: '对比分析',
    title: '对比分析：理解词语含义',
    compareLow: '"骄傲"的意思是自以为了不起。',
    compareHigh: '在这个句子中，"骄傲"的意思是"自豪"——妈妈看到孩子取得了好成绩，心里感到光荣和高兴，而不是"自大"的意思。',
    question: '解释"骄傲"这个词的两个答案，哪个更准确？为什么？',
    options: [
      { text: '满分答案更好，因为它结合语境解释了词语的准确含义', correct: true },
      { text: '低分答案更好，因为词典释义就是那个意思', correct: false },
      { text: '两个答案都对，得分一样', correct: false },
      { text: '满分答案写得太啰嗦了', correct: false }
    ],
    explanation: '理解词语题的关键是"结合语境"！很多词语在不同句子中有不同含义。低分答案只给了通用解释，没有联系句子内容。满分答案做到了：①点明在句中的具体含义；②结合上下文解释为什么是这个意思；③和常见含义做区分。这就是"词不离句"的阅读方法。'
  },
  // ===== 效果赏析 =====
  {
    type: 'analyze',
    badge: '效果赏析',
    title: '效果赏析：比喻的作用',
    sentence: '弯弯的月亮像小船，挂在深蓝色的夜空中。',
    question: '这句话中"弯弯的月亮像小船"这个比喻起到了什么作用？',
    options: [
      { text: '把月亮的形状写得形象生动，让读者能想象出月亮弯弯的样子', correct: true },
      { text: '说明月亮真的变成了一艘小船', correct: false },
      { text: '只是为了让句子变得更长更好看', correct: false },
      { text: '没有特别的作用，怎么写都可以', correct: false }
    ],
    explanation: '比喻的核心作用是"化抽象为具体"和"化陌生为熟悉"。月亮的形状是抽象的，但"小船"是读者熟悉的事物。作者把月亮比作小船，读者就能在脑海中想象出月亮弯弯的、静静挂在夜空中的画面。修辞不是装饰，而是帮助读者"看见"的工具。'
  },
  {
    type: 'analyze',
    badge: '效果赏析',
    title: '效果赏析：拟人的作用',
    sentence: '小鸟在树枝上欢快地唱歌。',
    question: '作者为什么用"唱歌"来形容小鸟的叫声？如果改成"小鸟在树枝上叫"，效果有什么不同？',
    options: [
      { text: '"唱歌"让小鸟有了人的情感，画面更温暖美好', correct: true },
      { text: '用"唱歌"只是换一种说法，意思完全一样', correct: false },
      { text: '用"唱歌"让句子更长，显得更有文采', correct: false },
      { text: '用"叫"更准确，因为小鸟本来就是在叫', correct: false }
    ],
    explanation: '拟人的作用是把事物"人格化"，让读者产生情感共鸣。用"唱歌"代替"叫"，小鸟就不再是普通动物，而像一个快乐的歌唱家，传递了"欢快""美好"的感受。如果改成"叫"，就只是客观描述，缺少了情感色彩。拟人是让描写"有温度"的修辞。'
  },
  {
    type: 'analyze',
    badge: '效果赏析',
    title: '效果赏析：排比的作用',
    sentence: '书是钥匙，能打开知识的大门；书是明灯，能照亮前进的道路；书是朋友，能陪伴我们成长。',
    question: '作者为什么连续用三个"书是…"的句式？如果只写第一句，效果有什么不同？',
    options: [
      { text: '排比句式层层递进，增强了表达的气势和感染力', correct: true },
      { text: '写三句比写一句显得字数更多，看上去更认真', correct: false },
      { text: '三句话是重复表达同一个意思，没有区别', correct: false },
      { text: '写一句更好，因为更简洁不啰嗦', correct: false }
    ],
    explanation: '排比的作用是"层层递进，增强语势"。三个"书是…"从"钥匙"（认知工具）到"明灯"（方向引导）到"朋友"（情感陪伴），一层比一层深入，让读者对书的价值有更丰富的认识。如果只写第一句，道理虽然没错，但缺少了情感的积累和递进的力量。排比不是简单重复，而是"螺旋上升"地强化观点。'
  }
];

// 当前状态
let currentTransform = 0;
let currentRhetoric = 0;
let currentPoem = 0;
let currentReading = 0;
let currentVocab = 0;
let currentLevel = 'easy';
let correctCount = 0;
let currentThinking = 0;

// 从localStorage加载进度
function loadProgress() {
  const saved = localStorage.getItem('chinesePractice');
  if (saved) {
    const data = JSON.parse(saved);
    currentLevel = data.level || 'easy';
    correctCount = data.correctCount || 0;
  }
}

// 保存进度到localStorage
function saveProgress() {
  localStorage.setItem('chinesePractice', JSON.stringify({
    level: currentLevel,
    correctCount: correctCount,
    lastDate: new Date().toISOString().split('T')[0]
  }));
}

// 错题本功能
function saveWrongAnswer(type, question, userAnswer, correctAnswer, tip) {
  const wrongList = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
  const wrongItem = {
    type: type,
    question: question,
    userAnswer: userAnswer,
    correctAnswer: correctAnswer,
    tip: tip,
    timestamp: new Date().toISOString()
  };
  
  wrongList.push(wrongItem);
  if (wrongList.length > 50) {
    wrongList.shift();
  }
  
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderAutoRoutingPanel();
}

function getWrongAnswers() {
  return JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
}

function clearWrongAnswers() {
  if (confirm('确定要清空所有错题吗？')) {
    localStorage.removeItem('wrongAnswers');
    renderWrongList();
    renderAutoRoutingPanel();
  }
}

// ==================== 错因分类系统 ====================

// 错因分类
const ERROR_CATEGORIES = {
  B1: { id: 'b1', label: '字词拼音', icon: 'B1', desc: '拼音、识字、形近字或语境运用不稳' },
  R1: { id: 'r1', label: '概括主干', icon: 'R1', desc: '概括照抄、漏人物事件结果' },
  R2: { id: 'r2', label: '原文依据', icon: 'R2', desc: '人物、原因、情感题缺少材料依据' },
  R3: { id: 'r3', label: '赏析语言', icon: 'R3', desc: '赏析或说明文语言只背术语，不联系原文' },
  R4: { id: 'r4', label: '材料数据', icon: 'R4', desc: '非连续文本没有引用材料、数字或关键词' },
  W1: { id: 'w1', label: '写话观察', icon: 'W1', desc: '写话或观察片段太短、太空' },
  W2: { id: 'w2', label: '重点段', icon: 'W2', desc: '作文重点段薄，缺少变化和认识' },
  W3: { id: 'w3', label: '审题扣题', icon: 'W3', desc: '作文题眼、中心、材料和点题不稳' },
  C1: { id: 'c1', label: '综合题型', icon: 'C1', desc: '综合题型判断慢，分层答题不清楚' },
  SHEN_TI: { id: 'shenti', label: '审题错', icon: '🔍', desc: '没看清问什么' },
  XIN_XI: { id: 'xinxi', label: '信息错', icon: '📖', desc: '没回原文找依据' },
  GAI_KUO: { id: 'gaikuo', label: '概括错', icon: '📝', desc: '太笼统或漏要点' },
  BIAO_DA: { id: 'biaoda', label: '表达错', icon: '✏️', desc: '答案不完整、不分点' },
  MO_BAN: { id: 'moban', label: '模板错', icon: '📋', desc: '套话多，没结合文本' }
};

function normalizeErrorCategoryId(categoryId) {
  const id = String(categoryId || '').trim().toLowerCase();
  const aliasMap = {
    xinxii: 'xinxi',
    b1: 'b1',
    r1: 'r1',
    r2: 'r2',
    r3: 'r3',
    r4: 'r4',
    w1: 'w1',
    w2: 'w2',
    w3: 'w3',
    c1: 'c1'
  };
  return aliasMap[id] || id;
}

function getErrorCategory(categoryId) {
  const normalizedId = normalizeErrorCategoryId(categoryId);
  return Object.values(ERROR_CATEGORIES).find(cat => cat.id === normalizedId);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

// 保存错因
function saveErrorCategory(wrongIndex, categoryId) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].errorCategory = normalizeErrorCategoryId(categoryId);
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
    renderWrongList();
  }
}

// 保存复盘填写内容
function saveReviewField(wrongIndex, field, value) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].review = {
      ...(wrongList[wrongIndex].review || {}),
      [field]: value
    };
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  }
}

// 保存重做答案
function saveRetryAnswer(wrongIndex, value) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].retryAnswer = value;
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  }
}

// 获取错因统计
function getErrorCategoryStats() {
  const wrongList = getWrongAnswers();
  const stats = {};
  Object.values(ERROR_CATEGORIES).forEach(cat => {
    stats[cat.id] = 0;
  });
  stats['other'] = 0;
  
  wrongList.forEach(item => {
    const cat = normalizeErrorCategoryId(item.errorCategory);
    if (cat && stats[cat] !== undefined) {
      stats[cat]++;
    } else {
      stats['other']++;
    }
  });
  
  return stats;
}

// ==================== 复盘模板 ====================

// 生成复盘建议
function generateReviewAdvice(wrongItem) {
  const cat = normalizeErrorCategoryId(wrongItem.errorCategory);
  let advice = '';
  
  switch(cat) {
    case 'shenti':
      advice = '下次做题先圈题目关键词，问什么再答什么，不答非所问。';
      break;
    case 'b1':
      advice = '回到 B1 训练包，先看字音、偏旁和语境，再组词说句。';
      break;
    case 'r1':
      advice = '回到 R1 训练包，按“谁 + 做什么 + 结果”删细节、留主干。';
      break;
    case 'r2':
      advice = '回到 R2 训练包，先圈原文证据，再写特点、原因或情感。';
      break;
    case 'r3':
      advice = '回到 R3 训练包，答案必须包含词义或方法、对象特点和表达效果。';
      break;
    case 'r4':
      advice = '回到 R4 训练包，答案里必须出现材料数字、编号或关键词。';
      break;
    case 'w1':
      advice = '回到 W1 训练包，把句子补出时间、地点、动作、变化和心情。';
      break;
    case 'w2':
      advice = '回到 W2 训练包，放大关键一幕，写出动作、心理和认识提升。';
      break;
    case 'w3':
      advice = '回到 W3 训练包，先圈题眼，再定中心、重点段和点题结尾。';
      break;
    case 'c1':
      advice = '回到 C1 训练包，先判断题型，再按分值分层组织答案。';
      break;
    case 'xinxi':
      advice = '答案必须回原文找依据，不能凭感觉写。找到原文句子，把关键词抄下来。';
      break;
    case 'gaikuo':
      advice = '概括要包含"谁+做什么+结果/感受"，不能只说一两个词。写完检查是否全面。';
      break;
    case 'biaoda':
      advice = '用"①②③"分点作答，每点先写结论再写依据。写完读一遍看看通不通顺。';
      break;
    case 'moban':
      advice = '模板是框架，必须填入原文具体内容。每句模板后面都要跟上文中对应的例子。';
      break;
    default:
      advice = '先分析错因，找出是哪个环节出了问题，再针对性地练。';
  }
  
  return advice;
}

// 获取复盘数据 (为导出/展示用)
function getReviewData() {
  const wrongList = getWrongAnswers();
  return wrongList.map((item, index) => ({
    index: index,
    question: item.question,
    userAnswer: item.userAnswer,
    correctAnswer: item.correctAnswer,
    tip: item.tip,
    category: normalizeErrorCategoryId(item.errorCategory) || '未分类',
    review: item.review || {},
    reviewAdvice: generateReviewAdvice(item),
    timestamp: item.timestamp
  }));
}

// 当前筛选类型
let currentFilter = 'all';

function renderWrongList() {
  const wrongList = getWrongAnswers();
  const container = document.getElementById('wrongList');
  const analysisDiv = document.getElementById('wrongAnalysis');
  const filterDiv = document.getElementById('wrongFilter');
  
  if (wrongList.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">暂无错题，继续加油！</p>';
    analysisDiv.style.display = 'none';
    filterDiv.style.display = 'none';
    renderErrorStats();
    renderAutoRoutingPanel();
    return;
  }
  
  // 显示分析和筛选
  analysisDiv.style.display = 'block';
  filterDiv.style.display = 'block';
  
  // 按类型统计错题
  const typeStats = {};
  wrongList.forEach(item => {
    const type = item.type || '其他';
    typeStats[type] = (typeStats[type] || 0) + 1;
  });
  
  // 生成统计数据
  const statsDiv = document.getElementById('wrongStats');
  let statsHTML = '';
  for (const [type, count] of Object.entries(typeStats)) {
    statsHTML += `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${count}</div>
        <div style="font-size: 14px; color: #666;">${type}</div>
      </div>
    `;
  }
  statsDiv.innerHTML = statsHTML;
  
  // 生成复习建议
  const suggestionsDiv = document.getElementById('wrongSuggestions');
  let suggestionsHTML = '<strong>💡 复习建议：</strong><ul style="margin: 10px 0 0 20px;">';
  for (const [type, count] of Object.entries(typeStats)) {
    if (count >= 3) {
      suggestionsHTML += `<li>你在${type}方面错题较多，建议重点复习这部分内容。</li>`;
    }
  }
  suggestionsHTML += '<li>定期回顾错题，巩固薄弱知识点。</li>';
  suggestionsHTML += '</ul>';
  suggestionsDiv.innerHTML = suggestionsHTML;
  
  // 生成筛选按钮
  const filterButtonsDiv = document.getElementById('filterButtons');
  let filterButtonsHTML = '';
  for (const type of Object.keys(typeStats)) {
    filterButtonsHTML += `
      <button class="filter-btn" onclick="filterWrong('${type}')" 
              style="padding: 8px 16px; margin-right: 8px; border: 1px solid #667eea; background: white; color: #667eea; border-radius: 20px; cursor: pointer;">
        ${type}
      </button>
    `;
  }
  filterButtonsDiv.innerHTML = filterButtonsHTML;
  
  // 根据筛选显示错题
  let filteredList = wrongList;
  if (currentFilter !== 'all') {
    filteredList = wrongList.filter(item => item.type === currentFilter);
  }
  
  container.innerHTML = filteredList.map((item, index) => {
    const realIndex = wrongList.indexOf(item);
    const cat = normalizeErrorCategoryId(item.errorCategory || '');
    const category = getErrorCategory(cat);
    const advice = generateReviewAdvice(item);
    const review = item.review || {};
    
    // 错因分类选择器
    const categoryOptions = Object.values(ERROR_CATEGORIES).map(c => 
      `<button class="error-cat-btn ${cat === c.id ? 'active' : ''}" 
               onclick="saveErrorCategory(${realIndex}, '${c.id}')"
               title="${c.desc}">${c.icon} ${c.label}</button>`
    ).join('');

    const answerHTML = item.retryMode ? '' : `
      <div class="wrong-answer">我的答案：${escapeHTML(item.userAnswer)}</div>
      <div class="correct-answer">正确答案：${escapeHTML(item.correctAnswer)}</div>
      ${item.tip ? `<div class="wrong-tip">提示：${escapeHTML(item.tip)}</div>` : ''}`;

    const retryHTML = item.retryMode ? `
      <div class="retry-panel">
        <div class="retry-title">重新作答</div>
        <textarea class="review-input retry-textarea" rows="3" placeholder="先不看答案，重新写一遍你的答案。" oninput="saveRetryAnswer(${realIndex}, this.value)">${escapeHTML(item.retryAnswer || '')}</textarea>
        <div class="retry-actions">
          <button class="retry-btn" onclick="revealRetryAnswer(${realIndex})">查看答案</button>
          <button class="retry-btn secondary" onclick="cancelRetry(${realIndex})">取消重做</button>
        </div>
        ${item.retryRevealed ? `
        <div class="answer-reveal">
          <div><strong>原来的答案：</strong>${escapeHTML(item.userAnswer)}</div>
          <div><strong>正确答案：</strong>${escapeHTML(item.correctAnswer)}</div>
          ${item.tip ? `<div><strong>提示：</strong>${escapeHTML(item.tip)}</div>` : ''}
        </div>` : ''}
      </div>` : '';
    
    return `
    <div class="wrong-item">
      <div class="wrong-question">${index + 1}. ${escapeHTML(item.question)}</div>
      ${answerHTML}
      ${retryHTML}
      <div class="error-category-select">
        <div style="font-size:12px;color:#888;margin-bottom:6px;">分析错因（点击选择）：</div>
        <div class="error-cat-btns">${categoryOptions}</div>
      </div>
      ${cat ? `
      <div class="review-box">
        <strong>📝 复盘建议：</strong>
        <p>我错在：<strong>${category?.label || '其他'}</strong>。</p>
        <div class="review-field">
          <label>原文依据是：</label>
          <textarea class="review-input" rows="2" placeholder="写出最能证明答案的原文词句。" oninput="saveReviewField(${realIndex}, 'evidence', this.value)">${escapeHTML(review.evidence || '')}</textarea>
        </div>
        <div class="review-field">
          <label>正确答法应包含：</label>
          <textarea class="review-input" rows="2" placeholder="例如：结论 + 依据 + 分析。" oninput="saveReviewField(${realIndex}, 'answerPoints', this.value)">${escapeHTML(review.answerPoints || '')}</textarea>
        </div>
        <p>下次遇到同类题，我先做：${advice}</p>
      </div>` : ''}
      <div style="margin-top: 10px;">
        ${item.retryMode ? '' : `<button class="retry-btn" onclick="retryWrong(${realIndex})">再练一次</button>`}
        <button class="retry-btn" onclick="removeWrong(${realIndex})" style="background: #f44336; margin-left: 10px;">移除</button>
      </div>
    </div>`;
  }).join('');
  renderErrorStats();
  renderAutoRoutingPanel();
}

// 渲染错因统计
function renderErrorStats() {
  const stats = getErrorCategoryStats();
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  
  const container = document.getElementById('errorStatsVisual');
  if (!container) return;
  
  if (total === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;">暂无错因数据，标记错题后会自动生成分析。</p>';
    return;
  }
  
  let html = '<div class="error-stats-grid">';
  
  // 生成每个错因的统计卡片
  Object.values(ERROR_CATEGORIES).forEach(cat => {
    const count = stats[cat.id] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    html += `
      <div class="error-stat-card">
        <div class="error-stat-icon">${cat.icon}</div>
        <div class="error-stat-count">${count}</div>
        <div class="error-stat-label">${cat.label}</div>
        <div class="error-stat-bar"><div class="error-stat-fill" style="width:${pct}%"></div></div>
        <div class="error-stat-pct">${pct}%</div>
        <div class="error-stat-desc">${cat.desc}</div>
      </div>`;
  });
  
  html += '</div>';
  
  // 生成排序后的改善建议
  const sorted = Object.values(ERROR_CATEGORIES)
    .map(cat => ({ ...cat, count: stats[cat.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  
  if (sorted[0].count > 0) {
    html += `<div class="error-top-advice">
      <strong>🎯 当前最需要改善：</strong> ${sorted[0].icon} ${sorted[0].label}（${sorted[0].count}次）<br>
      <span style="color:#666;font-size:13px;">${sorted[0].desc}。${sorted[0].id === 'shenti' ? '每次做题先用笔圈出关键词。' : 
        sorted[0].id === 'xinxi' ? '答案必须回原文找依据，找到后划线标记。' :
        sorted[0].id === 'gaikuo' ? '写完后检查：谁+做什么+结果都写了吗？' :
        sorted[0].id === 'biaoda' ? '用①②③分点，每点先写结论。' :
        '模板后必须跟原文例句。'}</span>
    </div>`;
  }
  
  container.innerHTML = html;
}

function formatReviewDate(timestamp, offsetDays) {
  const base = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(base.getTime())) return '待生成';
  base.setDate(base.getDate() + offsetDays);
  return `${base.getMonth() + 1}月${base.getDate()}日`;
}

function getAutoRoutingLabel(wrongList) {
  const total = wrongList.length;
  const stats = getErrorCategoryStats();
  const sorted = Object.values(ERROR_CATEGORIES)
    .map(cat => ({ ...cat, count: stats[cat.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  const top = sorted.find(item => item.count > 0);

  if (!total) {
    return {
      level: '等待A卷诊断',
      issue: '暂无错题数据',
      action: '先完成15分钟诊断，系统会自动生成错因码和下一课路径。'
    };
  }

  if (total >= 6) {
    return {
      level: '基础达标',
      issue: top ? `${top.icon} ${top.label}` : '基础薄弱点',
      action: '先不要混刷题，集中完成最高频错因训练包，再做B卷复测。'
    };
  }

  if (total >= 3) {
    return {
      level: '提优提升',
      issue: top ? `${top.icon} ${top.label}` : '答案完整度',
      action: '重点补“依据 + 分析 + 完整表达”，同类变式通过后进入C卷。'
    };
  }

  return {
    level: '拔尖迁移',
    issue: top ? `${top.icon} ${top.label}` : '迁移稳定性',
    action: '错题较少，建议直接做C1/C2混合迁移，看能否换材料稳定使用方法。'
  };
}

function renderAutoRoutingPanel() {
  const routePanel = document.getElementById('autoRoutingSummary');
  const reviewPanel = document.getElementById('reviewScheduleSummary');
  if (!routePanel && !reviewPanel) return;

  const wrongList = getWrongAnswers();
  const route = getAutoRoutingLabel(wrongList);

  if (routePanel) {
    routePanel.innerHTML = `
      <p><strong>当前路径：</strong>${route.level}</p>
      <p><strong>主攻问题：</strong>${route.issue}</p>
      <p><strong>下一步：</strong>${route.action}</p>
    `;
  }

  if (reviewPanel) {
    if (!wrongList.length) {
      reviewPanel.innerHTML = `
        <p><strong>复习提醒：</strong>暂无错题。</p>
        <p>完成诊断或互动练习后，错题会自动进入这里，并生成3天/7天复习节奏。</p>
      `;
      return;
    }

    const latest = wrongList[wrongList.length - 1];
    const unfinished = wrongList.filter(item => !item.mastered).length;
    reviewPanel.innerHTML = `
      <p><strong>未完全掌握：</strong>${unfinished}题</p>
      <p><strong>3天后复练：</strong>${formatReviewDate(latest.timestamp, 3)}</p>
      <p><strong>7天后复测：</strong>${formatReviewDate(latest.timestamp, 7)}</p>
      <p><strong>考前策略：</strong>优先练未完全掌握题，再做同类变式迁移。</p>
    `;
  }
}

// 筛选错题
function filterWrong(type) {
  currentFilter = type;
  
  // 更新按钮状态
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'white';
    btn.style.color = '#667eea';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  renderWrongList();
}

// 移除错题
function removeWrong(index) {
  const wrongList = getWrongAnswers();
  wrongList.splice(index, 1);
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderWrongList();
  renderAutoRoutingPanel();
}

function retryWrong(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryMode = true;
    wrongList[index].retryRevealed = false;
    wrongList[index].retryAnswer = '';
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
    renderWrongList();
  }
}

function revealRetryAnswer(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryRevealed = true;
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
    renderWrongList();
  }
}

function cancelRetry(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryMode = false;
    wrongList[index].retryRevealed = false;
    wrongList[index].retryAnswer = '';
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
    renderWrongList();
  }
}

// 模式切换
function initModeSwitch() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode) {
        document.querySelectorAll('.sentence-transform, .rhetoric-card, .poem-card, .thinking-card').forEach(el => {
          el.style.display = 'none';
        });
        document.getElementById(btn.dataset.mode + 'Practice').style.display = 'block';
        document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.mode === 'thinking') {
          initThinking();
        }
      } else if (btn.dataset.level) {
        currentLevel = btn.dataset.level;
        document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        saveProgress();
      }
    });
  });
}

// 句式转换练习
function initTransform() {
  const question = document.getElementById('transformQuestion');
  const sentence = document.getElementById('transformSentence');
  const options = document.getElementById('transformOptions');
  
  const data = transformData[currentTransform];
  question.textContent = `把下面的句子改写成"${data.type}"`;
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkTransform(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkTransform(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkTransform(index) {
  const data = transformData[currentTransform];
  const options = document.querySelectorAll('#transformOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('句式转换', data.sentence, data.options[index], data.options[data.answer], '');
    showFeedback(false, '');
  }
  
  setTimeout(nextTransform, 2000);
}

function nextTransform() {
  currentTransform = (currentTransform + 1) % transformData.length;
  initTransform();
}

// 修辞判断练习
function initRhetoric() {
  const sentence = document.getElementById('rhetoricSentence');
  const options = document.getElementById('rhetoricOptions');
  
  const data = rhetoricData[currentRhetoric];
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'rhetoric-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkRhetoric(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkRhetoric(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkRhetoric(index) {
  const data = rhetoricData[currentRhetoric];
  const options = document.querySelectorAll('#rhetoricOptions .rhetoric-btn');
  
  options.forEach((opt, i) => {
    opt.disabled = true;
    opt.setAttribute('tabindex', '-1');
    if (i === data.options.indexOf(data.answer)) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.style.background = '#f44336';
      opt.style.color = 'white';
      opt.style.borderColor = '#f44336';
    }
  });
  
  if (index === data.options.indexOf(data.answer)) {
    correctCount++;
    saveProgress();
    showFeedback(true, data.tip || '');
  } else {
    showFeedback(false, data.tip || '');
  }
  
  setTimeout(nextRhetoric, 2500);
}

function nextRhetoric() {
  currentRhetoric = (currentRhetoric + 1) % rhetoricData.length;
  initRhetoric();
}

// 古诗填空练习
function initPoem() {
  const title = document.getElementById('poemTitle');
  const text = document.getElementById('poemText');
  
  const data = poemData[currentPoem];
  title.textContent = data.title;
  text.innerHTML = data.text;
}

function checkPoem() {
  const inputs = document.querySelectorAll('#poemText input');
  const data = poemData[currentPoem];
  let allCorrect = true;
  
  inputs.forEach((input, i) => {
    if (input.value.trim() === data.answers[i]) {
      input.style.borderColor = '#4caf50';
      input.style.background = '#e8f5e9';
    } else {
      input.style.borderColor = '#f44336';
      input.style.background = '#ffebee';
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    correctCount++;
    saveProgress();
  }
  setTimeout(nextPoem, 2000);
}

function nextPoem() {
  currentPoem = (currentPoem + 1) % poemData.length;
  initPoem();
}

// 阅读练习
function initReading() {
  const text = document.getElementById('readingText');
  const question = document.getElementById('readingQuestion');
  const options = document.getElementById('readingOptions');
  
  const filteredData = readingData.filter(d => d.level === currentLevel);
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentReading % filteredData.length];
  
  text.textContent = data.text;
  question.textContent = data.question;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkReading(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkReading(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkReading(index) {
  const filteredData = readingData.filter(d => d.level === currentLevel);
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentReading % filteredData.length];
  const options = document.querySelectorAll('#readingOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('阅读理解', data.question, data.options[index], data.options[data.answer], '');
    showFeedback(false, '', data.options[data.answer]);
  }
  
  setTimeout(nextReading, 2500);
}

function nextReading() {
  currentReading++;
  initReading();
}

// 词语选择练习
function initVocab() {
  const sentence = document.getElementById('vocabSentence');
  const options = document.getElementById('vocabOptions');
  
  const filteredData = vocabData.filter(d => d.level === currentLevel);
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentVocab % filteredData.length];
  
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkVocab(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkVocab(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkVocab(index) {
  const filteredData = vocabData.filter(d => d.level === currentLevel);
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentVocab % filteredData.length];
  const options = document.querySelectorAll('#vocabOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    showFeedback(false, '');
  }
  
  setTimeout(nextVocab, 2000);
}

function nextVocab() {
  currentVocab++;
  initVocab();
}

// 思维进阶练习
function initThinking() {
  const data = thinkingData[currentThinking % thinkingData.length];
  const badge = document.getElementById('thinkingBadge');
  const content = document.getElementById('thinkingContent');
  const explanation = document.getElementById('thinkingExplanation');
  const nextBtn = document.getElementById('thinkingNextBtn');

  explanation.style.display = 'none';
  nextBtn.style.display = 'none';

  badge.textContent = data.badge;
  badge.className = 'thinking-badge ' + data.type;

  let html = '';

  if (data.type === 'upgrade') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="compare-row">';
    html += '  <div class="compare-box low">';
    html += '    <div class="compare-label low">✏️ 原句</div>';
    html += '    <div class="compare-content">' + data.original + '</div>';
    html += '  </div>';
    html += '  <div class="compare-box high">';
    html += '    <div class="compare-label high">✨ 润色后</div>';
    html += '    <div class="compare-content">' + data.improved + '</div>';
    html += '  </div>';
    html += '</div>';
  } else if (data.type === 'compare') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="compare-row">';
    html += '  <div class="compare-box low">';
    html += '    <div class="compare-label low">📉 低分答案</div>';
    html += '    <div class="compare-content">' + data.compareLow + '</div>';
    html += '  </div>';
    html += '  <div class="compare-box high">';
    html += '    <div class="compare-label high">📈 满分答案</div>';
    html += '    <div class="compare-content">' + data.compareHigh + '</div>';
    html += '  </div>';
    html += '</div>';
  } else if (data.type === 'analyze') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="rhetoric-sentence" style="border-left-color:#7b1fa2;background:#f3e5f5;">' + data.sentence + '</div>';
  }

  html += '<div class="thinking-question">' + data.question + '</div>';
  html += '<div class="thinking-options" id="thinkingOptions"></div>';

  content.innerHTML = html;

  const optionsContainer = document.getElementById('thinkingOptions');
  data.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'thinking-opt';
    div.textContent = String.fromCharCode(65 + i) + '. ' + opt.text;
    div.dataset.index = i;
    div.setAttribute('tabindex', '0');
    div.addEventListener('click', () => checkThinking(i));
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkThinking(i);
      }
    });
    optionsContainer.appendChild(div);
  });
}

function checkThinking(index) {
  const data = thinkingData[currentThinking % thinkingData.length];
  const options = document.querySelectorAll('#thinkingOptions .thinking-opt');

  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (data.options[i].correct) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });

  const explanation = document.getElementById('thinkingExplanation');
  explanation.innerHTML = '<strong>💡 解析：</strong>' + data.explanation;
  explanation.style.display = 'block';

  document.getElementById('thinkingNextBtn').style.display = 'block';

  if (data.options[index].correct) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('思维进阶', data.question || data.title, data.options[index].text, data.options.find(o => o.correct).text, '');
    showFeedback(false, '');
  }
}

function nextThinking() {
  currentThinking++;
  initThinking();
}

// 打卡功能
function initCheckin() {
  const btn = document.getElementById('checkinBtn');
  const today = document.querySelector('.checkin-day.today');
  
  // 检查今日是否已打卡
  const lastCheckin = localStorage.getItem('lastCheckin');
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (lastCheckin === todayStr) {
    btn.disabled = true;
    btn.textContent = '已打卡';
    if (today) today.classList.add('checked');
    return;
  }
  
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '已打卡';
    
    if (today) today.classList.add('checked');
    localStorage.setItem('lastCheckin', todayStr);
    
    // 更新连续打卡天数
    let streak = parseInt(localStorage.getItem('checkinStreak') || '0');
    streak++;
    localStorage.setItem('checkinStreak', streak.toString());
    
    // 显示奖励
    document.getElementById('rewardText').textContent = streak >= 5 
      ? `太棒了！你已经连续打卡${streak}天了！`
      : `今天是你连续打卡的第${streak}天！继续加油！`;
    document.getElementById('rewardModal').classList.add('show');
  });
}

function closeReward() {
  document.getElementById('rewardModal').classList.remove('show');
}

// 答题反馈函数
function showFeedback(isCorrect, tip, correctAnswer = '') {
  const feedback = document.createElement('div');
  feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
  
  if (isCorrect) {
    feedback.innerHTML = '&#10004; 回答正确！';
    if (tip) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">${tip}</span>`;
    }
  } else {
    feedback.innerHTML = '&#10006; 再接再厉！';
    if (correctAnswer) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">正确答案：${correctAnswer}</span>`;
    }
    if (tip) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">提示：${tip}</span>`;
    }
  }
  
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 2500);
}

// 测后分流训练包状态和 A/B 卷评分器
const FLOW_PACKS = [
  { code: 'B1', id: 'b1', title: '字词拼音', problem: '拼音、识字、形近字、词语语境不稳', href: '#pack-b1' },
  { code: 'R1', id: 'r1', title: '概括主干', problem: '概括照抄、不完整，漏人物、事件或结果', href: '#pack-r1' },
  { code: 'R2', id: 'r2', title: '原文依据', problem: '人物、原因、情感题缺少材料依据', href: '#pack-r2' },
  { code: 'R3', id: 'r3', title: '赏析语言', problem: '赏析或说明文语言只背术语，不联系原文', href: '#pack-r3' },
  { code: 'R4', id: 'r4', title: '材料数据', problem: '非连续文本没有引用材料、数字或关键词', href: '#pack-r4' },
  { code: 'W1', id: 'w1', title: '写话观察', problem: '写话或观察片段太短、太空', href: '#pack-w1' },
  { code: 'W2', id: 'w2', title: '重点段升格', problem: '作文重点段薄，缺少变化和认识', href: '#pack-w2' },
  { code: 'W3', id: 'w3', title: '审题扣题', problem: '作文题眼、中心、材料和点题不稳', href: '#pack-w3' },
  { code: 'C1', id: 'c1', title: '综合题型', problem: '综合题型判断慢，分层答题不清楚', href: '#pack-c1' }
];

const FLOW_STATUS_LABELS = {
  todo: '未开始',
  done: '已完成训练',
  retry: '需再练',
  passed: '复测已通过'
};

const FLOW_STATUS_CLASS = {
  todo: 'status-todo',
  done: 'status-done',
  retry: 'status-retry',
  passed: 'status-passed'
};

const AB_TEST_MAP = {
  1: {
    label: '一年级',
    retest: 'grade1.html#grade1-b-test',
    a: [
      { no: 1, code: 'B1', points: 3, title: '拼读 p-én、q-iú、m-āo', reason: '拼读或声调不稳', standard: 'pén、qiú、māo，声调准确。' },
      { no: 2, code: 'B1', points: 3, title: '给“花、球、猫”各组 1 个词', reason: '会认字，不会组词说句', standard: '花朵、皮球、小猫等，词义正确。' },
      { no: 3, code: 'R1', points: 3, title: '写出第一句话谁在哪里做什么', reason: '回答缺人物、地点或事情', standard: '小猫在院子里玩球。' },
      { no: 4, code: 'R2', points: 2, title: '说出感叹号应读出的语气', reason: '读不出句子情感', standard: '开心、高兴的语气。' },
      { no: 5, code: 'W1', points: 5, title: '看图说话：小朋友浇花，说 3 句话', reason: '看图说话太短', standard: '至少有时间、地点、人物、动作和心情。' }
    ],
    b: [
      { no: 1, code: 'B1', points: 1, title: '拼读 t-ǔ、h-uā、x-iǎo', reason: '同类拼读迁移不稳', standard: 'tǔ、huā、xiǎo，声调读完整。' },
      { no: 2, code: 'B1', points: 1, title: '给“水、鸟、书”组词并说句子', reason: '词语和句子迁移不稳', standard: '词语正确，句子有完整意思。' },
      { no: 3, code: 'R1', points: 1, title: '回答小狗在草地上追蝴蝶中的谁在哪里做什么', reason: '主干信息不全', standard: '小狗在草地上追蝴蝶。' },
      { no: 4, code: 'W1', points: 1, title: '看图说话：小朋友捡起地上的纸', reason: '动作和心情不完整', standard: '至少 3 句，补动作和心情。' }
    ],
    c: [
      { no: 1, code: 'B1', points: 2, title: '读准“桥、云、灯”，各组一个词并说完整句', reason: '字音、组词和句子不能连续迁移', standard: '读音正确，组词贴合语境，句子有谁、做什么。' },
      { no: 2, code: 'R1', points: 3, title: '读短句“小兔在草地上捡到红球，它高兴地跳起来”，说清谁在哪里做什么', reason: '主干提取遇到新材料仍不完整', standard: '小兔在草地上捡到红球。' },
      { no: 3, code: 'R2', points: 2, title: '从句子中找出小兔心情的依据', reason: '情感判断没有回到词句', standard: '从“高兴地跳起来”可以看出小兔很开心。' },
      { no: 4, code: 'W1', points: 4, title: '看图说话：雨后小朋友扶起倒下的小花，说 3 句以上', reason: '换图后画面、动作、心情缺层', standard: '写清时间、人物、动作、结果和心情。' }
    ],
    c2: [
      { no: 1, code: 'B1', points: 2, title: '限时读准“船、窗、树”，并各说一个短句', reason: '限时下字音和组句不稳', standard: '读音正确，短句完整。' },
      { no: 2, code: 'R1', points: 3, title: '读“小鸟飞回树上唱歌”，说清谁做什么', reason: '换句后主干不稳', standard: '小鸟飞回树上唱歌。' },
      { no: 3, code: 'R2', points: 3, title: '从“笑眯眯”判断人物心情，并说明依据', reason: '心情词不会转成答案', standard: '人物很高兴，依据是“笑眯眯”。' },
      { no: 4, code: 'W1', points: 5, title: '看图说话：小朋友给迷路的弟弟指路', reason: '动作和结果写不完整', standard: '至少 3 句，有帮助过程和结果。' }
    ],
    c3: [
      { no: 1, code: 'B1', points: 2, title: '区分“再、在”，各写一句话', reason: '同音字语境迁移不稳', standard: '“再”表示又一次，“在”表示位置或正在。' },
      { no: 2, code: 'R1', points: 3, title: '用 15 字内概括“小鹿送伞”的句群', reason: '短句群概括啰嗦或漏结果', standard: '小鹿把伞送给没带伞的小伙伴。' },
      { no: 3, code: 'R2', points: 3, title: '小鹿为什么值得表扬，从句子中找依据', reason: '评价题没有动作依据', standard: '因为它帮助同伴，依据是把伞送给没带伞的小伙伴。' },
      { no: 4, code: 'W1', points: 6, title: '写 4 句“我帮助同学”的小片段', reason: '拔尖写话缺过程和心情', standard: '有起因、动作、对方反应和自己的心情。' }
    ]
  },
  2: {
    label: '二年级',
    retest: 'grade2.html#grade2-b-test',
    a: [
      { no: 1, code: 'B1', points: 3, title: '选字填空：清、晴、睛', reason: '形近字按感觉选', standard: '晴、清、睛。' },
      { no: 2, code: 'R1', points: 2, title: '贝贝和妈妈去哪里、做什么', reason: '只答地点或事情不完整', standard: '去公园看花。' },
      { no: 3, code: 'R2', points: 3, title: '老奶奶为什么夸贝贝', reason: '原因题没有回到短文', standard: '因为贝贝帮老奶奶捡起掉在地上的袋子。' },
      { no: 4, code: 'R1', points: 4, title: '用一句话概括短文主要内容', reason: '概括漏人物、事件或结果', standard: '贝贝和妈妈去公园看花，贝贝帮助老奶奶捡袋子，受到夸奖。' },
      { no: 5, code: 'W1', points: 6, title: '扩写“贝贝帮助老奶奶”成一段话', reason: '只有评价，没有动作过程', standard: '写出看见、跑去、捡起、递给、被夸和心情。' }
    ],
    b: [
      { no: 1, code: 'B1', points: 1, title: '选字填空：园、圆', reason: '形近字语境迁移不稳', standard: '园、圆。' },
      { no: 2, code: 'R2', points: 1, title: '小雨为什么把伞借给同学', reason: '原因没有材料依据', standard: '因为同学没有带伞，外面正在下雨。' },
      { no: 3, code: 'R1', points: 1, title: '概括“小雨借伞”短文', reason: '人物、事情、结果不完整', standard: '小雨看到同学没带伞，把伞借给他，同学很感激。' },
      { no: 4, code: 'W1', points: 1, title: '扩写“小雨借伞”成 4 句话', reason: '动作、语言、心情不足', standard: '有动作、语言、心情。' }
    ],
    c: [
      { no: 1, code: 'B1', points: 2, title: '选字填空：带、戴、代，并说明为什么这样选', reason: '只会选答案，不会解释语境', standard: '戴红领巾、带雨伞、代表，能说出词义差别。' },
      { no: 2, code: 'R1', points: 3, title: '读“小河边的提醒”短文，用一句话概括主要内容', reason: '新短文概括漏人物或结果', standard: '小明看到警示牌后提醒弟弟远离河边，两人安全回家。' },
      { no: 3, code: 'R2', points: 3, title: '小明为什么拉住弟弟，从文中找依据', reason: '原因题没有引用关键句', standard: '因为河边有警示牌，水很深；依据要来自文中。' },
      { no: 4, code: 'W1', points: 5, title: '把“小明提醒弟弟”扩写成 5 句话', reason: '动作、语言、结果不能同时写完整', standard: '有看见、拉住、提醒、弟弟反应、结果。' }
    ],
    c2: [
      { no: 1, code: 'B1', points: 2, title: '限时选择“坐、座、做”，并说理由', reason: '常用字语境判断慢', standard: '坐下、一座桥、做作业，理由清楚。' },
      { no: 2, code: 'R1', points: 3, title: '概括“小雨让座”短文', reason: '人物、事件、结果漏一项', standard: '小雨在公交车上给老爷爷让座，受到夸奖。' },
      { no: 3, code: 'R2', points: 3, title: '为什么说小雨懂事？找两处依据', reason: '人物品质缺依据', standard: '主动让座、扶老爷爷坐稳。' },
      { no: 4, code: 'W1', points: 5, title: '扩写“小雨让座”成一段话', reason: '限时扩写过程不足', standard: '写出看见、起身、说话、结果、心情。' }
    ],
    c3: [
      { no: 1, code: 'B1', points: 2, title: '用“清、晴、情”各写一句话', reason: '形近同音字拔尖迁移不稳', standard: '水清、天晴、心情，语境准确。' },
      { no: 2, code: 'R1', points: 4, title: '用 20 字内概括“捡钱包还失主”', reason: '概括不能压缩', standard: '贝贝捡到钱包后交给失主，受到表扬。' },
      { no: 3, code: 'R2', points: 4, title: '贝贝有哪些品质？从两处细节说明', reason: '只能写一个品质或无依据', standard: '诚实、乐于助人，并有两处细节。' },
      { no: 4, code: 'W1', points: 6, title: '写一段“我做对了一件事”', reason: '拔尖写话缺选择和结果', standard: '有犹豫、选择、行动、结果。' }
    ]
  },
  3: {
    label: '三年级',
    retest: 'grade3.html#grade3-b-test',
    a: [
      { no: 1, code: 'R1', points: 1, title: '找中心句', reason: '把地点词当中心句', standard: '放学后，操场上真热闹。' },
      { no: 2, code: 'R1', points: 3, title: '概括“操场热闹”这段', reason: '概括时照抄原句', standard: '放学后，操场上同学们跳绳、跑步、踢球，到处都是欢笑声。' },
      { no: 3, code: 'W1', points: 2, title: '绿豆第一天是什么样子', reason: '只写对象，不写样子', standard: '硬硬的、小小的。' },
      { no: 4, code: 'W1', points: 3, title: '第三天发生了什么变化', reason: '只写发芽，没有变化细节', standard: '绿豆裂开了一道缝，白白的小芽探出了头。' },
      { no: 5, code: 'W1', points: 6, title: '写一段观察片段', reason: '观察片段没有顺序和感受', standard: '有顺序、变化和感受。' }
    ],
    b: [
      { no: 1, code: 'R1', points: 1, title: '找中心句：图书角真安静', reason: '中心句判断迁移不稳', standard: '图书角真安静。' },
      { no: 2, code: 'R1', points: 1, title: '概括“图书角安静”这段', reason: '删细节留主干不稳', standard: '图书角里同学们安静地看书、做摘记。' },
      { no: 3, code: 'W1', points: 1, title: '写绿豆第五天的变化', reason: '观察变化细节不足', standard: '小芽长高了，顶端露出两片嫩嫩的小叶子。' },
      { no: 4, code: 'W1', points: 1, title: '围绕“花坛真美”写 4 句话', reason: '句子没有围绕中心', standard: '每句话都围绕一个中心。' }
    ],
    c: [
      { no: 1, code: 'R1', points: 3, title: '读“午后的植物角”，找中心句并概括这一段', reason: '中心句和段意混在一起', standard: '先找中心句，再用自己的话概括植物角热闹或有变化。' },
      { no: 2, code: 'R2', points: 3, title: '为什么说小军观察得认真，从两处细节说明', reason: '人物评价没有细节支撑', standard: '写出特点，并列出两处观察动作或记录细节。' },
      { no: 3, code: 'W1', points: 4, title: '按“第一天、第三天、第五天”写一段观察变化', reason: '观察片段顺序乱、变化少', standard: '有时间顺序、外形变化和自己的发现。' },
      { no: 4, code: 'C1', points: 2, title: '判断第2题属于“概括题、依据题、赏析题”哪一类', reason: '题型判断慢，影响答题层次', standard: '属于依据题，要按“特点 + 依据”作答。' }
    ],
    c2: [
      { no: 1, code: 'R1', points: 3, title: '限时找“热闹的操场”中心句并概括', reason: '限时下照抄原句', standard: '能找中心句，并用自己的话概括活动多、气氛热闹。' },
      { no: 2, code: 'R2', points: 3, title: '为什么说班长负责？从两处动作说明', reason: '责任品质没有细节支撑', standard: '组织排队、提醒安全等动作。' },
      { no: 3, code: 'W1', points: 5, title: '围绕“操场真热闹”写 5 句话', reason: '句子不围绕中心', standard: '每句都服务“热闹”。' },
      { no: 4, code: 'C1', points: 3, title: '判断“找中心句”和“概括段意”的区别', reason: '题型混淆', standard: '中心句是原文句子，段意是自己的概括。' }
    ],
    c3: [
      { no: 1, code: 'R1', points: 4, title: '用 25 字内概括“第一次养蚕”的片段', reason: '拔尖概括不能抓变化', standard: '写清观察对象、主要变化和自己的发现。' },
      { no: 2, code: 'R2', points: 4, title: '小作者为什么惊喜？从两处变化说明', reason: '情感题缺变化依据', standard: '蚕卵变化、蚕宝宝出现等细节。' },
      { no: 3, code: 'W1', points: 5, title: '写一段“我发现了一个小秘密”', reason: '观察作文缺发现意识', standard: '有观察过程、细节变化、发现或感受。' },
      { no: 4, code: 'C1', points: 3, title: '把第2题改成满分答案并说出补了哪一层', reason: '不会自改答案', standard: '补情感、依据和分析。' }
    ]
  },
  4: {
    label: '四年级',
    retest: 'grade4.html#grade4-b-test',
    a: [
      { no: 1, code: 'R1', points: 4, title: '概括短文主要内容', reason: '概括漏结果或太啰嗦', standard: '小林克服紧张，代表小组完整讲完故事，赢得掌声。' },
      { no: 2, code: 'R2', points: 3, title: '小林上台前是什么心情，从哪里看出', reason: '心情题没有原文依据', standard: '紧张。从“手心里全是汗”“声音有些发抖”可以看出。' },
      { no: 3, code: 'R2', points: 4, title: '小林是怎样的人', reason: '人物特点只有一个词', standard: '小林勇敢、敢于挑战自己，并能结合情节说明。' },
      { no: 4, code: 'R3', points: 4, title: '赏析“雨点像一串串小鼓点”', reason: '赏析只写“生动”', standard: '修辞、特点、效果都写到。' },
      { no: 5, code: 'W2', points: 5, title: '写一段“紧张”，不能出现“紧张”二字', reason: '重点场景没有细节', standard: '动作、神态、心理细节齐全。' }
    ],
    b: [
      { no: 1, code: 'R1', points: 1, title: '概括“晓雨第一次主持班会”的短文', reason: '概括迁移漏结果', standard: '晓雨克服害怕，顺利主持班会，得到同学认可。' },
      { no: 2, code: 'R2', points: 1, title: '晓雨为什么害怕，从哪里看出', reason: '观点后没有依据', standard: '观点后必须有原文依据。' },
      { no: 3, code: 'R3', points: 1, title: '赏析“掌声像春风一样涌过来”', reason: '方法、特点、效果不全', standard: '方法、特点、效果都写到。' },
      { no: 4, code: 'W2', points: 1, title: '写一段“不安”，不能出现“不安”二字', reason: '动作、神态、心理细节不足', standard: '有动作、神态、心理细节。' }
    ],
    c: [
      { no: 1, code: 'R1', points: 3, title: '读“第一次上台领读”，概括主要内容', reason: '综合阅读时概括漏起因或结果', standard: '写清谁、遇到什么困难、怎样做、结果怎样。' },
      { no: 2, code: 'R2', points: 3, title: '主人公是怎样的人，从两处细节说明', reason: '人物形象没有证据链', standard: '特点 + 两处细节 + 简要分析，不能只写“很好”。' },
      { no: 3, code: 'R3', points: 3, title: '赏析“声音像一条细线慢慢稳了下来”', reason: '赏析只贴术语，没有联系变化', standard: '写出修辞、声音由弱到稳的特点和表现出的成长。' },
      { no: 4, code: 'W2', points: 4, title: '写一段“我终于敢开口了”，不能出现“敢”字', reason: '重点段不能用细节表现心理变化', standard: '有动作、神态、心理、结果，能看出变化。' },
      { no: 5, code: 'C1', points: 2, title: '判断第3题应按几层作答', reason: '综合题分层意识不稳', standard: '至少三层：方法、内容特点、表达效果。' }
    ],
    c2: [
      { no: 1, code: 'R1', points: 3, title: '限时概括“雨中护书”的短文', reason: '限时综合漏结果', standard: '写清人物、护书过程和结果。' },
      { no: 2, code: 'R2', points: 4, title: '人物有哪些品质？用两处细节证明', reason: '多品质题层次乱', standard: '负责、细心等品质与细节对应。' },
      { no: 3, code: 'R3', points: 4, title: '赏析“雨点像小鼓一样敲在伞面上”', reason: '赏析只写比喻', standard: '写出修辞、声音特点和气氛。' },
      { no: 4, code: 'W2', points: 5, title: '写一段“我克服了害怕”', reason: '限时重点段薄', standard: '有害怕、动作、鼓励、变化。' },
      { no: 5, code: 'C1', points: 3, title: '判断第2题和第3题的答题步骤分别是什么', reason: '人物题和赏析题混淆', standard: '人物题：特点+依据；赏析题：方法+特点+效果。' }
    ],
    c3: [
      { no: 1, code: 'R1', points: 4, title: '用 30 字内概括“班级图书角风波”', reason: '压轴概括抓不住冲突和解决', standard: '写清问题、解决办法和结果。' },
      { no: 2, code: 'R2', points: 4, title: '主人公前后发生了什么变化？从两处细节说明', reason: '变化题只写结果', standard: '前后对比 + 两处细节。' },
      { no: 3, code: 'R3', points: 4, title: '赏析结尾“心里像窗户被推开了一样亮”', reason: '不能结合中心', standard: '写出比喻、心情变化和中心。' },
      { no: 4, code: 'W2', points: 6, title: '写一段“我主动承担了责任”', reason: '拔尖重点段缺成长认识', standard: '有错误、犹豫、承担、认识。' },
      { no: 5, code: 'C1', points: 4, title: '把第2题低分答案改成满分答案', reason: '不会定位缺层', standard: '补前后变化、依据和分析。' }
    ]
  },
  5: {
    label: '五年级',
    retest: 'grade5.html#grade5-b-test',
    a: [
      { no: 1, code: 'R3', points: 4, title: '“大约”能删去吗，为什么', reason: '说明文语言题只背“不准确”', standard: '词义、删后变化、准确性共三层。' },
      { no: 2, code: 'R1', points: 4, title: '材料 A 主要说明什么', reason: '概括漏说明对象或条件', standard: '竹笋在春雨后生长快，但受温度、水分和土壤影响。' },
      { no: 3, code: 'R2', points: 5, title: '材料 B 中爸爸是怎样的人', reason: '人物题没有两处依据', standard: '关爱孩子、默默付出，并列出两处依据。' },
      { no: 4, code: 'R2', points: 3, title: '“我低头看着热气，忽然说不出话来”表达了什么', reason: '情感题只写“感动”', standard: '写出被父亲关爱打动和感激。' },
      { no: 5, code: 'W2', points: 5, title: '给《那一次，我懂得了坚持》列中心和详写段', reason: '作文中心没有成长认识', standard: '中心、详写、成长认识都明确。' }
    ],
    b: [
      { no: 1, code: 'R3', points: 1, title: '“几乎全部”能删去“几乎”吗', reason: '语言准确性迁移不稳', standard: '词义、删后变化、准确性完整。' },
      { no: 2, code: 'R1', points: 1, title: '概括海鸟迁徙材料', reason: '说明对象和影响因素不全', standard: '说明对象和影响因素都不漏。' },
      { no: 3, code: 'R2', points: 1, title: '爷爷是怎样的人，从两处细节说明', reason: '特点和两处依据不对应', standard: '特点 + 两处依据 + 分析。' },
      { no: 4, code: 'W2', points: 1, title: '给《那一次，我学会了负责》列中心和详写段', reason: '中心缺少认识，详写不聚焦', standard: '中心有认识，详写最能表现变化的一幕。' }
    ],
    c: [
      { no: 1, code: 'R3', points: 4, title: '说明文中“约三分之一”能否删去“约”，说明理由', reason: '限制词分析不能迁移到数据表达', standard: '解释词义、删后变绝对、体现说明文准确严谨。' },
      { no: 2, code: 'R1', points: 4, title: '概括材料 A“城市树荫降温”的主要信息', reason: '材料概括漏对象、条件或结论', standard: '写清树荫能降低地表温度，效果受树种、密度等影响。' },
      { no: 3, code: 'R4', points: 4, title: '根据材料 B 的数据，给学校操场改造提一条建议', reason: '建议题没有引用数据', standard: '建议要带数据依据，如增加树荫区或遮阳设施。' },
      { no: 4, code: 'R2', points: 4, title: '短文中的父亲是怎样的人，从两处细节说明', reason: '人物形象缺“内容 + 情感 + 中心”', standard: '关爱孩子、默默付出；用两处行动细节支撑并分析情感。' },
      { no: 5, code: 'W2', points: 5, title: '给《那一次，我懂得了体谅》设计中心和重点段', reason: '作文中心和详写段脱节', standard: '中心有认识，重点段能表现误解到理解的变化。' }
    ],
    c2: [
      { no: 1, code: 'R3', points: 4, title: '限时分析“接近一半”能否删去“接近”', reason: '限制词答题不完整', standard: '词义、删后变化、准确性三层。' },
      { no: 2, code: 'R1', points: 4, title: '概括“候鸟迁徙受天气影响”的材料', reason: '说明对象和影响因素不全', standard: '写清候鸟迁徙受风向、温度等影响。' },
      { no: 3, code: 'R4', points: 5, title: '根据两组数据给学校阅读活动提建议', reason: '跨材料数据整合不稳', standard: '建议具体，引用并比较数据。' },
      { no: 4, code: 'R2', points: 4, title: '文中的母亲是怎样的人？从两处细节说明', reason: '人物题迁移缺分析', standard: '特点、两处依据、分析齐全。' },
      { no: 5, code: 'W2', points: 6, title: '给《那一次，我学会了体谅》列中心和重点段', reason: '限时提纲中心浅', standard: '中心有认识，重点段有前后变化。' }
    ],
    c3: [
      { no: 1, code: 'R3', points: 5, title: '压轴：比较“大约”和“至少”在说明文中的表达作用', reason: '不能比较不同限制词作用', standard: '分别说明估计范围和最低限度，体现严谨。' },
      { no: 2, code: 'R1', points: 5, title: '概括两则材料共同说明的问题', reason: '跨材料共同点抓不住', standard: '找共同对象和共同结论。' },
      { no: 3, code: 'R4', points: 5, title: '结合材料数据，写一段 80 字建议', reason: '建议缺论证层次', standard: '建议、数据、比较、理由齐全。' },
      { no: 4, code: 'R2', points: 5, title: '分析人物情感变化，并用两处细节证明', reason: '高阶人物题缺变化线', standard: '前后情感、两处细节、中心分析。' },
      { no: 5, code: 'W2', points: 6, title: '写《那一次，我懂得了沉默的爱》的重点段', reason: '拔尖作文不能用细节表现含蓄情感', standard: '有动作细节、心理转折和认识。' }
    ]
  },
  6: {
    label: '六年级',
    retest: 'grade6.html#grade6-b-test',
    a: [
      { no: 1, code: 'C1', points: 1, title: '判断“这段话在文中有什么作用”属于什么题型', reason: '题型判断不准', standard: '句段作用题。' },
      { no: 2, code: 'R3', points: 4, title: '“通常”能删去吗，为什么', reason: '语言准确性题漏删后变化', standard: '词义、删后变化、文体特点齐全。' },
      { no: 3, code: 'R4', points: 4, title: '根据材料 B 给学生提一条运动建议', reason: '建议题没有引用材料', standard: '建议有材料依据。' },
      { no: 4, code: 'R4', points: 4, title: '根据材料 B 说明运动有什么好处', reason: '数据题不会比较', standard: '数据、结论、建议齐全。' },
      { no: 5, code: 'W3', points: 5, title: '给《这一次，我长大了》列提纲', reason: '作文提纲没扣题眼', standard: '题眼、中心、详写都明确。' }
    ],
    b: [
      { no: 1, code: 'C1', points: 1, title: '判断“结尾一句在全文中的作用”属于什么题型', reason: '综合题型迁移不稳', standard: '句段作用题，重点从内容、结构、中心三层思考。' },
      { no: 2, code: 'R3', points: 1, title: '“一般情况下”能删去吗', reason: '限制词分析不完整', standard: '词义、删后变化和严谨性齐全。' },
      { no: 3, code: 'R4', points: 1, title: '根据阅读数据提出建议', reason: '建议没有数据依据', standard: '建议每天坚持阅读 30 分钟以上，并引用数据。' },
      { no: 4, code: 'W3', points: 1, title: '给《这一次，我做对了》列提纲', reason: '题眼、中心、详写没有扣合', standard: '题眼、中心、详写和点题都明确。' }
    ],
    c: [
      { no: 1, code: 'C1', points: 3, title: '判断“开头引用数据有什么作用”属于哪类题，并列答题层次', reason: '综合题型识别和分层迁移不稳', standard: '属于句段作用或材料作用题，从内容、结构、效果三层答。' },
      { no: 2, code: 'R3', points: 4, title: '“不超过 15 分钟”中的“不超过”能否删去', reason: '说明文语言题漏边界意识', standard: '解释限定范围，删后意思改变，体现表达准确严谨。' },
      { no: 3, code: 'R4', points: 4, title: '结合两则材料，为六年级学生制定一条阅读建议', reason: '跨材料整合没有数据和对象意识', standard: '建议明确对象，至少引用一处数据或材料关键词。' },
      { no: 4, code: 'R2', points: 4, title: '文中的“我”发生了怎样的变化，从两处细节说明', reason: '变化题只写结果，不写前后对比', standard: '写出前后变化，并用两处细节证明。' },
      { no: 5, code: 'W3', points: 5, title: '给《这一次，我没有逃避》列限时作文提纲', reason: '高年级作文题眼、中心、材料不能一体化', standard: '题眼是“没有逃避”，中心有成长认识，详写关键一幕并点题。' }
    ],
    c2: [
      { no: 1, code: 'C1', points: 4, title: '限时判断“中间段承上启下”的答题层次', reason: '句段作用题层次少', standard: '内容、结构、中心三层。' },
      { no: 2, code: 'R3', points: 4, title: '分析“多数情况下”在说明文中的作用', reason: '限制词不能联系语境', standard: '范围、删后变化、准确性。' },
      { no: 3, code: 'R4', points: 5, title: '整合两则阅读材料，给毕业复习提建议', reason: '跨材料整合缺比较', standard: '对象、建议、数据、比较齐全。' },
      { no: 4, code: 'R2', points: 5, title: '分析“我”从逃避到面对的变化线', reason: '变化题缺前后对照', standard: '前后状态、触发细节、结果。' },
      { no: 5, code: 'W3', points: 6, title: '给《这一次，我做对了》列限时提纲', reason: '限时作文题眼和中心脱节', standard: '选择、过程、认识、点题齐全。' }
    ],
    c3: [
      { no: 1, code: 'C1', points: 5, title: '压轴：比较“开头引用数据”和“结尾点题”的不同作用', reason: '综合作用题不能比较', standard: '分别从内容、结构、表达效果比较。' },
      { no: 2, code: 'R3', points: 5, title: '分析两个限制词共同体现的说明文特点', reason: '语言题不能综合归纳', standard: '限制范围、避免绝对、体现准确严谨。' },
      { no: 3, code: 'R4', points: 5, title: '用两则材料写 100 字建议短文', reason: '材料建议不能成段表达', standard: '建议明确，数据支撑，语言有条理。' },
      { no: 4, code: 'R2', points: 5, title: '结合细节分析人物成长，并点明文章中心', reason: '高阶人物题缺中心提升', standard: '变化、依据、分析、中心齐全。' },
      { no: 5, code: 'W3', points: 8, title: '给《这一次，我没有逃避》写题眼、中心、重点段、结尾', reason: '小升初压轴作文构思不完整', standard: '题眼、中心、详写、点题结尾闭环。' }
    ]
  }
};

function getFlowPack(codeOrId) {
  const id = normalizeErrorCategoryId(codeOrId);
  return FLOW_PACKS.find(pack => pack.id === id || pack.code.toLowerCase() === id);
}

function getFlowPackStatus() {
  try {
    const parsed = JSON.parse(localStorage.getItem('flowPackStatus') || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveFlowPackStatus(status) {
  localStorage.setItem('flowPackStatus', JSON.stringify(status));
}

function getFlowStatusText(packId) {
  const status = getFlowPackStatus()[packId] || 'todo';
  return FLOW_STATUS_LABELS[status] || FLOW_STATUS_LABELS.todo;
}

function markFlowPack(codeOrId, status = 'done', options = {}) {
  const pack = getFlowPack(codeOrId);
  if (!pack) return;

  const nextStatus = FLOW_STATUS_LABELS[status] ? status : 'todo';
  const flowStatus = getFlowPackStatus();
  if (nextStatus === 'todo') {
    delete flowStatus[pack.id];
  } else {
    flowStatus[pack.id] = nextStatus;
  }
  saveFlowPackStatus(flowStatus);
  renderFlowStatusPanel();
  injectFlowPackControls();
  renderLearningProfilePanel();
  renderNextLessonPanel();

  if (!options.silent) {
    showFeedback(true, `${pack.code} 已标记为“${FLOW_STATUS_LABELS[nextStatus]}”。`);
  }
}

function renderFlowStatusPanel() {
  const panel = document.getElementById('flowStatusPanel');
  if (!panel) return;

  const flowStatus = getFlowPackStatus();
  panel.innerHTML = `
    <div class="flow-status-grid">
      ${FLOW_PACKS.map(pack => {
        const status = flowStatus[pack.id] || 'todo';
        return `
          <article class="flow-status-card">
            <strong>${pack.code} ${pack.title}</strong>
            <span class="status-pill ${FLOW_STATUS_CLASS[status] || FLOW_STATUS_CLASS.todo}">${FLOW_STATUS_LABELS[status] || FLOW_STATUS_LABELS.todo}</span>
            <a class="flow-action-btn" href="${pack.href}">进入训练</a>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function injectFlowPackControls() {
  const actions = [
    { status: 'done', label: '完成训练' },
    { status: 'retry', label: '需要再练' },
    { status: 'passed', label: '复测已通过' },
    { status: 'todo', label: '重置' }
  ];
  const flowStatus = getFlowPackStatus();

  FLOW_PACKS.forEach(pack => {
    const article = document.getElementById(`pack-${pack.id}`);
    if (!article) return;

    const current = flowStatus[pack.id] || 'todo';
    const oldActions = article.querySelector('.flow-pack-actions');
    if (oldActions) oldActions.remove();

    const html = `
      <div class="flow-pack-actions" data-pack="${pack.id}">
        ${actions.map(action => `
          <button type="button" class="flow-action-btn ${current === action.status ? 'active' : ''}" onclick="markFlowPack('${pack.id}', '${action.status}')">
            ${action.label}
          </button>
        `).join('')}
      </div>
    `;
    article.insertAdjacentHTML('beforeend', html);
  });
}

function getPaperLabel(paper) {
  const labels = {
    a: 'A卷诊断',
    b: 'B卷复测',
    c: 'C1基础混合迁移',
    c2: 'C2限时综合',
    c3: 'C3拔尖压轴'
  };
  return labels[paper] || labels.a;
}

function isCPaper(paper) {
  return ['c', 'c2', 'c3'].includes(paper);
}

function getABTestSet(grade, paper) {
  const gradeData = AB_TEST_MAP[String(grade)];
  if (!gradeData) return [];
  return gradeData[paper] || gradeData.a || [];
}

function initABScorePanel() {
  const panel = document.getElementById('abScorePanel');
  if (!panel) return;

  const gradeOptions = Object.entries(AB_TEST_MAP).map(([grade, data]) => (
    `<option value="${grade}">${data.label}</option>`
  )).join('');

  panel.innerHTML = `
    <div class="flow-score-form">
      <div class="flow-score-controls">
        <label>
          <span style="display:block;font-weight:900;margin-bottom:4px;">年级</span>
          <select class="flow-select" id="abGradeSelect">${gradeOptions}</select>
        </label>
        <label>
          <span style="display:block;font-weight:900;margin-bottom:4px;">卷型</span>
          <select class="flow-select" id="abPaperSelect">
            <option value="a">A卷诊断</option>
            <option value="b">B卷复测</option>
            <option value="c">C1基础混合迁移</option>
            <option value="c2">C2限时综合</option>
            <option value="c3">C3拔尖压轴</option>
          </select>
        </label>
      </div>
      <div id="abQuestionChecks"></div>
      <button type="button" class="next-btn flow-score-btn" id="abScoreBtn" style="width:100%;">生成分流建议</button>
      <div id="abScoreResult"></div>
    </div>
  `;

  document.getElementById('abGradeSelect').addEventListener('change', renderABQuestionChecks);
  document.getElementById('abPaperSelect').addEventListener('change', renderABQuestionChecks);
  document.getElementById('abScoreBtn').addEventListener('click', calculateABScore);

  renderABQuestionChecks();
  renderStoredABScoreResult();
}

function renderABQuestionChecks() {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  const checksBox = document.getElementById('abQuestionChecks');
  if (!gradeSelect || !paperSelect || !checksBox) return;

  const questions = getABTestSet(gradeSelect.value, paperSelect.value);
  checksBox.innerHTML = `
    <div class="ab-question-list">
      ${questions.map((item, index) => `
        <label class="ab-question-item">
          <input type="checkbox" name="abWrongQuestion" value="${index}">
          <span>
            <span class="ab-code">${item.code}</span>
            第${item.no}题：${escapeHTML(item.title)}
            <br><small>${escapeHTML(item.reason)}</small>
          </span>
        </label>
      `).join('')}
    </div>
  `;

  const resultBox = document.getElementById('abScoreResult');
  if (resultBox) resultBox.innerHTML = '';
}

function saveFlowWrongItems(grade, paper, wrongItems) {
  if (!wrongItems.length) return;

  const gradeData = AB_TEST_MAP[String(grade)];
  const paperLabel = getPaperLabel(paper);
  const wrongList = getWrongAnswers();
  const existingKeys = new Set(wrongList.map(item => item.flowKey).filter(Boolean));

  wrongItems.forEach(item => {
    const pack = getFlowPack(item.code);
    if (!pack) return;

    const flowKey = `ab-${grade}-${paper}-${item.no}`;
    if (existingKeys.has(flowKey)) return;

    wrongList.push({
      type: `${gradeData.label}${paperLabel}`,
      question: `第${item.no}题：${item.title}`,
      userAnswer: '本题扣分或未达通过标准',
      correctAnswer: item.standard || `对应错因码：${pack.code}`,
      tip: `错因：${item.reason || pack.problem}。建议进入 ${pack.code}${pack.title} 训练包。`,
      errorCategory: pack.id,
      flowKey,
      timestamp: new Date().toISOString()
    });
    existingKeys.add(flowKey);
  });

  while (wrongList.length > 50) {
    wrongList.shift();
  }

  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderWrongList();
  renderErrorStats();
}

function calculateABScore() {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  if (!gradeSelect || !paperSelect) return;

  const grade = gradeSelect.value;
  const paper = paperSelect.value;
  const gradeData = AB_TEST_MAP[String(grade)];
  const questions = getABTestSet(grade, paper);
  const checkedIndexes = Array.from(document.querySelectorAll('input[name="abWrongQuestion"]:checked'))
    .map(input => Number(input.value));
  const wrongItems = checkedIndexes.map(index => questions[index]).filter(Boolean);
  const totalPoints = questions.reduce((sum, item) => sum + (item.points || 1), 0);
  const lostPoints = wrongItems.reduce((sum, item) => sum + (item.points || 1), 0);
  const score = Math.max(0, totalPoints - lostPoints);
  const wrongCodes = [...new Set(wrongItems.map(item => item.code))];

  if ((paper === 'b' || isCPaper(paper)) && wrongItems.length === 0) {
    [...new Set(questions.map(item => item.code))].forEach(code => markFlowPack(code, 'passed', { silent: true }));
  } else {
    wrongCodes.forEach(code => markFlowPack(code, 'retry', { silent: true }));
  }

  saveFlowWrongItems(grade, paper, wrongItems);

  const result = {
    grade,
    paper,
    gradeLabel: gradeData.label,
    paperLabel: getPaperLabel(paper),
    total: questions.length,
    wrongCount: wrongItems.length,
    score,
    totalPoints,
    wrongCodes,
    retest: gradeData.retest,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('lastABScoreResult', JSON.stringify(result));
  saveScoreHistory(result);
  renderABScoreResult(result);
  renderFlowStatusPanel();
  injectFlowPackControls();
  renderLearningProfilePanel();
  renderNextLessonPanel();

  if (wrongItems.length === 0) {
    const passText = isCPaper(paper)
      ? `${getPaperLabel(paper)}无错，迁移通过，可以进入下一层拔尖训练。`
      : (paper === 'b' ? 'B卷无错，相关训练包已标记为通过，可以挑战C卷。' : 'A卷无错，可以直接挑战B卷。');
    showFeedback(true, passText);
  } else {
    showFeedback(false, `已生成 ${wrongItems.length} 个分流训练码。`);
  }
}

function renderStoredABScoreResult() {
  try {
    const result = JSON.parse(localStorage.getItem('lastABScoreResult') || 'null');
    if (result) renderABScoreResult(result);
  } catch (error) {
    localStorage.removeItem('lastABScoreResult');
  }
}

function renderABScoreResult(result) {
  const resultBox = document.getElementById('abScoreResult');
  if (!resultBox) return;

  const hasWrong = result.wrongCodes && result.wrongCodes.length > 0;
  const codeLinks = hasWrong ? result.wrongCodes.map(code => {
    const pack = getFlowPack(code);
    return pack ? `<a href="${pack.href}">${pack.code} ${pack.title}</a>` : '';
  }).join('') : '';
  const retestLink = hasWrong
    ? (isCPaper(result.paper)
      ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', '${result.paper}')">训练后再做${result.paperLabel}</button>`
      : `<a href="${result.retest}">训练后再做B卷复测</a>`)
    : (result.paper === 'a'
      ? `<a href="${result.retest}">完成训练后去B卷复测</a>`
      : (result.paper === 'b'
        ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c')">打开C1基础混合迁移</button>`
        : (result.paper === 'c'
          ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c2')">进入C2限时综合</button>`
          : (result.paper === 'c2'
            ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c3')">进入C3拔尖压轴</button>`
            : `<a href="#peak-promotion">进入拔尖晋级测评</a>`))));

  resultBox.innerHTML = `
    <div class="ab-result">
      <strong>${result.gradeLabel}${result.paperLabel}：${result.score}/${result.totalPoints} 分，错 ${result.wrongCount}/${result.total} 题</strong>
      <p style="margin:0;color:#536174;">
        ${hasWrong ? '先集中处理错因码对应的训练包，做完后再复测。' : (isCPaper(result.paper) ? '迁移通过，说明不是记住原题，而是能换材料使用方法。' : (result.paper === 'b' ? '本次复测通过，可以进入C卷混合迁移。' : '诊断卷表现稳定，可以直接挑战B卷迁移。'))}
      </p>
      <div class="route-links">
        ${hasWrong ? codeLinks : ''}
        ${retestLink}
      </div>
    </div>
  `;
}

function readLastABScoreResult() {
  try {
    const result = JSON.parse(localStorage.getItem('lastABScoreResult') || 'null');
    return result && typeof result === 'object' ? result : null;
  } catch (error) {
    localStorage.removeItem('lastABScoreResult');
    return null;
  }
}

function getScoreHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    localStorage.removeItem('scoreHistory');
    return [];
  }
}

function saveScoreHistory(result) {
  const history = getScoreHistory();
  const percent = result.totalPoints ? Math.round((result.score / result.totalPoints) * 100) : 0;
  history.push({
    grade: result.grade,
    gradeLabel: result.gradeLabel,
    paper: result.paper,
    paperLabel: result.paperLabel,
    percent,
    wrongCount: result.wrongCount,
    wrongCodes: result.wrongCodes || [],
    createdAt: result.createdAt
  });
  while (history.length > 12) {
    history.shift();
  }
  localStorage.setItem('scoreHistory', JSON.stringify(history));
}

function selectABPaper(grade, paper) {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  if (!gradeSelect || !paperSelect) return;

  if (grade && AB_TEST_MAP[String(grade)]) {
    gradeSelect.value = String(grade);
  }
  paperSelect.value = paper;
  renderABQuestionChecks();
  document.getElementById('abScorePanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getFlowStatsFromWrongAnswers() {
  const stats = {};
  FLOW_PACKS.forEach(pack => {
    stats[pack.id] = 0;
  });

  getWrongAnswers().forEach(item => {
    const id = normalizeErrorCategoryId(item.errorCategory || '');
    if (Object.prototype.hasOwnProperty.call(stats, id)) {
      stats[id] += 1;
    }
  });

  const lastResult = readLastABScoreResult();
  if (lastResult?.wrongCodes?.length) {
    lastResult.wrongCodes.forEach(code => {
      const pack = getFlowPack(code);
      if (pack) stats[pack.id] += 2;
    });
  }

  return stats;
}

function getProfileMetric(label, codeIds, stats, flowStatus, fallbackScore = 100) {
  const issueCount = codeIds.reduce((sum, id) => sum + (stats[id] || 0), 0);
  const retryCount = codeIds.filter(id => flowStatus[id] === 'retry').length;
  const passedCount = codeIds.filter(id => flowStatus[id] === 'passed').length;
  const score = Math.max(35, Math.min(100, fallbackScore - issueCount * 14 - retryCount * 18 + passedCount * 8));
  const status = score >= 88 ? '拔尖' : (score >= 68 ? '提升' : '补课');
  return { label, score, status, trend: '待观察' };
}

function getTrendLabel(recentScores) {
  if (!recentScores || recentScores.length < 2) return '待观察';
  const first = recentScores[0].percent || 0;
  const last = recentScores[recentScores.length - 1].percent || 0;
  const diff = last - first;
  if (diff >= 8) return `上升 ${diff}分`;
  if (diff <= -8) return `下降 ${Math.abs(diff)}分`;
  return '基本稳定';
}

function buildLearningProfile() {
  const stats = getFlowStatsFromWrongAnswers();
  const flowStatus = getFlowPackStatus();
  const lastResult = readLastABScoreResult();
  const scoreHistory = getScoreHistory();
  const recentScores = scoreHistory.slice(-3);
  const sortedPacks = FLOW_PACKS
    .map(pack => ({ ...pack, count: stats[pack.id] || 0, status: flowStatus[pack.id] || 'todo' }))
    .sort((a, b) => (b.status === 'retry') - (a.status === 'retry') || b.count - a.count);
  const hasAnyData = Boolean(lastResult) || Object.values(stats).some(count => count > 0) || Object.keys(flowStatus).length > 0;
  const mainIssue = hasAnyData ? (sortedPacks.find(pack => pack.status === 'retry' || pack.count > 0) || sortedPacks[0]) : null;
  const retryCount = Object.values(flowStatus).filter(status => status === 'retry').length;
  const passedCount = Object.values(flowStatus).filter(status => status === 'passed').length;
  const lastPercent = lastResult?.totalPoints ? Math.round((lastResult.score / lastResult.totalPoints) * 100) : 0;
  let level = '待诊断';
  let summary = '先完成当前年级 A 卷，系统会自动生成错因画像和下一课路径。';

  if (lastResult) {
    if (lastResult.paper === 'c3' && lastResult.wrongCount === 0 && retryCount === 0) {
      level = '拔尖迁移';
      summary = 'C3拔尖压轴已通过，孩子已经能换材料、换题型、换表达稳定使用方法。';
    } else if ((isCPaper(lastResult.paper) && lastResult.wrongCount === 0) || (lastResult.paper === 'b' && lastResult.wrongCount === 0) || passedCount >= 3) {
      level = '提升巩固';
      summary = '同类变式或混合迁移基本过关，下一步要继续向更高层 C 卷推进。';
    } else if (lastPercent >= 80 && retryCount <= 1) {
      level = '掌握中';
      summary = '基础方法已有雏形，需要把薄弱错因做成稳定步骤。';
    } else {
      level = '专项补强';
      summary = '先集中处理最高频错因，别急着混刷题。';
    }
  }

  return {
    level,
    summary,
    mainIssue,
    lastResult,
    recentScores,
    metrics: [
      getProfileMetric('基础短板', ['b1'], stats, flowStatus, lastPercent || 82),
      getProfileMetric('阅读短板', ['r1', 'r2', 'r3', 'r4'], stats, flowStatus, lastPercent || 78),
      getProfileMetric('作文短板', ['w1', 'w2', 'w3'], stats, flowStatus, lastPercent || 76),
      getProfileMetric('迁移短板', ['c1'], stats, flowStatus, isCPaper(lastResult?.paper) && lastResult.wrongCount === 0 ? 96 : (lastPercent || 72)),
      {
        label: '拔尖潜力',
        score: Math.max(35, Math.min(100, (lastPercent || 70) + passedCount * 6 - retryCount * 12)),
        status: (lastPercent >= 90 && retryCount === 0) ? '拔尖' : (lastPercent >= 75 ? '提升' : '补课'),
        trend: getTrendLabel(recentScores)
      }
    ].map(metric => ({
      ...metric,
      trend: metric.trend === '待观察' ? getTrendLabel(recentScores) : metric.trend
    }))
  };
}

function renderLearningProfilePanel() {
  const panel = document.getElementById('learningProfilePanel');
  if (!panel) return;

  const profile = buildLearningProfile();
  const last = profile.lastResult;
  const trendText = profile.recentScores.length
    ? profile.recentScores.map(item => `${item.gradeLabel}${item.paperLabel}${item.percent}%`).join(' → ')
    : '暂无趋势，完成 3 次测评后生成';
  panel.innerHTML = `
    <div class="profile-summary">
      <span class="profile-level">${profile.level}</span>
      <p>${escapeHTML(profile.summary)}</p>
      <p><strong>主攻错因：</strong>${profile.mainIssue ? `${profile.mainIssue.code} ${profile.mainIssue.title}：${profile.mainIssue.problem}` : '等待诊断数据'}</p>
      <p><strong>最近测评：</strong>${last ? `${last.gradeLabel}${last.paperLabel} ${last.score}/${last.totalPoints} 分，错 ${last.wrongCount} 题` : '暂无记录'}</p>
      <p><strong>最近3次趋势：</strong>${escapeHTML(trendText)}</p>
    </div>
    <div class="profile-metric-grid">
      ${profile.metrics.map(metric => `
        <article class="profile-metric-card">
          <strong>${metric.label}</strong>
          <span>${metric.status}</span>
          <small>${escapeHTML(metric.trend)}</small>
          <div class="profile-meter"><span style="width:${metric.score}%"></span></div>
        </article>
      `).join('')}
    </div>
  `;
}

function buildNextLessonPath() {
  const result = readLastABScoreResult();
  if (!result) {
    return {
      title: '下一课：先做年级A卷诊断',
      desc: '没有诊断数据时，不直接刷题。先完成当前年级A卷，勾选错题后系统会生成画像。',
      actions: [
        { label: '一年级A卷', href: 'grade1.html' },
        { label: '二年级A卷', href: 'grade2.html' },
        { label: '三年级A卷', href: 'grade3.html' },
        { label: '四年级A卷', href: 'grade4.html' },
        { label: '五年级A卷', href: 'grade5.html' },
        { label: '六年级A卷', href: 'grade6.html' }
      ],
      steps: ['完成A卷', '勾选错题', '生成错因码']
    };
  }

  if (result.wrongCodes?.length) {
    const firstPack = getFlowPack(result.wrongCodes[0]);
    return {
      title: `下一课：${firstPack?.code || ''}${firstPack?.title || '错因'}专项精练`,
      desc: '先处理最高优先级错因，完成基础题、提升题、拔尖题后再复测。',
      actions: [
        firstPack ? { label: `进入${firstPack.code}训练包`, href: firstPack.href } : null,
        result.paper === 'a'
          ? { label: '训练后做B卷', href: result.retest }
          : (result.paper === 'b'
            ? { label: '再做B卷复测', href: result.retest }
            : { label: `再做${result.paperLabel}`, grade: result.grade, paper: result.paper })
      ].filter(Boolean),
      steps: ['重讲错因方法', '做3道递进题', isCPaper(result.paper) ? 'C卷再迁移' : 'B卷复测']
    };
  }

  if (result.paper === 'a') {
    return {
      title: '下一课：B卷同类变式',
      desc: 'A卷稳定不代表真正掌握，要用B卷换题验证同类迁移。',
      actions: [{ label: '去B卷复测', href: result.retest }],
      steps: ['口头讲方法', '完成B卷', '错题回流训练包']
    };
  }

  if (result.paper === 'b') {
    return {
      title: '下一课：C1基础混合迁移',
      desc: 'B卷通过后，进入 C1 混合题组，检查孩子能否判断题型、切换方法、稳定表达。',
      actions: [{ label: '打开C卷评分器', grade: result.grade, paper: 'c' }],
      steps: ['混合题限时做', '按错因码判题', '通过后进拔尖晋级']
    };
  }

  if (result.paper === 'c') {
    return {
      title: '下一课：C2限时综合',
      desc: 'C1通过后，加入限时压力，检查孩子是否还能稳定判断题型和完整表达。',
      actions: [{ label: '打开C2限时综合', grade: result.grade, paper: 'c2' }],
      steps: ['限时完成', '口头讲方法', '错因回流或进C3']
    };
  }

  if (result.paper === 'c2') {
    return {
      title: '下一课：C3拔尖压轴',
      desc: 'C2通过后，进入压轴题，重点看跨材料、改答案、作文构思的综合能力。',
      actions: [{ label: '打开C3拔尖压轴', grade: result.grade, paper: 'c3' }],
      steps: ['压轴题组', '改低分答案', '通过后进拔尖晋级']
    };
  }

  return {
    title: '下一课：拔尖晋级测评',
    desc: 'C卷通过后，不再重复刷基础题，重点检查会讲、会改、会迁移。',
    actions: [{ label: '进入拔尖晋级', href: '#peak-promotion' }],
    steps: ['讲清题型', '改低分答案', '换材料再迁移']
  };
}

function renderNextLessonPanel() {
  const panel = document.getElementById('nextLessonPanel');
  if (!panel) return;

  const path = buildNextLessonPath();
  panel.innerHTML = `
    <div class="next-lesson-card">
      <strong>${escapeHTML(path.title)}</strong>
      <p>${escapeHTML(path.desc)}</p>
      <ol class="next-lesson-steps">
        ${path.steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}
      </ol>
      <div class="route-links">
        ${path.actions.map(action => action.href
          ? `<a href="${action.href}">${escapeHTML(action.label)}</a>`
          : `<button type="button" class="flow-action-btn" onclick="selectABPaper('${action.grade}', '${action.paper}')">${escapeHTML(action.label)}</button>`
        ).join('')}
      </div>
    </div>
  `;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  initModeSwitch();
  initTransform();
  initRhetoric();
  initPoem();
  initReading();
  initVocab();
  initThinking();
  initCheckin();
  renderWrongList();
  renderErrorStats();
  renderFlowStatusPanel();
  injectFlowPackControls();
  initABScorePanel();
  renderLearningProfilePanel();
  renderNextLessonPanel();
  renderAutoRoutingPanel();
  
  // 关闭奖励弹窗
  document.getElementById('rewardModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('rewardModal')) {
      closeReward();
    }
  });
  
  // 关闭奖励按钮
  document.getElementById('closeRewardBtn').addEventListener('click', closeReward);
});

// ==================== 诊断测评功能 ====================

// 诊断测评题目数据
const diagnosisQuestions = [
  // 字词基础（1-5题）
  {
    type: '字词基础',
    question: '下列词语中，与"安静"意思最相近的是：',
    options: ['吵闹', '宁静', '热闹', '活泼'],
    answer: 1,
    explanation: '正确答案：宁静。"安静"和"宁静"都表示没有声音、安稳平静的意思，是近义词。',
    mistakeReason: '容易混淆"安静"与其他词的含义，"吵闹""热闹"与"安静"是反义词，"活泼"形容的是人的性格。'
  },
  {
    type: '字词基础',
    question: '下列句子中，哪个词语用得不恰当？',
    options: [
      '春天来了，大地一片生机勃勃。',
      '他说话总是夸夸其谈，很有学问。',
      '这次考试，我胸有成竹。',
      '她的歌声悦耳动听。'
    ],
    answer: 1,
    explanation: '正确答案：第二句。"夸夸其谈"是贬义词，形容说话浮夸不切实际，不能用来赞美别人有学问。',
    mistakeReason: '没有理解"夸夸其谈"的感情色彩，误用了贬义词。'
  },
  {
    type: '字词基础',
    question: '"情不自禁"的"禁"，意思是：',
    options: ['禁止', '忍住', '禁止的地方', '忍受'],
    answer: 1,
    explanation: '正确答案：忍住。"情不自禁"意思是感情激动得不能控制。',
    mistakeReason: '不熟悉成语中单个字的意思。'
  },
  {
    type: '字词基础',
    question: '下列哪个词与其他三个不是同一类？',
    options: ['菊花', '梅花', '雪花', '桃花'],
    answer: 2,
    explanation: '正确答案：雪花。其他都是植物的花，雪花是自然现象。',
    mistakeReason: '没有正确分类，把自然现象和植物的花混在一起了。'
  },
  {
    type: '字词基础',
    question: '把句子补充完整：太阳像______一样挂在天空。',
    options: ['小船', '圆盘', '月牙', '镰刀'],
    answer: 1,
    explanation: '正确答案：圆盘。用圆盘最贴切地描述了太阳的形状。',
    mistakeReason: '比喻不贴切，小船、月牙、镰刀常用来形容月亮。'
  },
  // 阅读理解（6-10题）
  {
    type: '阅读理解',
    question: '春天到了，公园里的花都开了。有红的、黄的、白的，五颜六色，美丽极了。这段话主要写了：',
    options: [
      '春天来了',
      '公园里的花很美',
      '花的颜色很多',
      '公园很美'
    ],
    answer: 1,
    explanation: '正确答案：公园里的花很美。这段话描述了春天公园里花开的美丽景象。',
    mistakeReason: '概括不全面，只看到部分内容而没有抓住主要意思。'
  },
  {
    type: '阅读理解',
    question: '小明每天早上都坚持跑步，从不间断。这句话主要表现了小明的什么品质？',
    options: ['勤劳', '勇敢', '有毅力', '善良'],
    answer: 2,
    explanation: '正确答案：有毅力。"从不间断"体现了他有毅力。',
    mistakeReason: '没有抓住关键词"从不间断"来理解人物品质。'
  },
  {
    type: '阅读理解',
    question: '读书可以让我们学到很多知识，可以让我们明白很多道理。这句话的主要意思是：',
    options: [
      '读书很有趣',
      '读书有很多好处',
      '读书要认真',
      '读书可以解闷'
    ],
    answer: 1,
    explanation: '正确答案：读书有很多好处。这句话列举了读书的两个好处。',
    mistakeReason: '没有正确理解句子要表达的主要观点。'
  },
  {
    type: '阅读理解',
    question: '下列哪句话是比喻句？',
    options: [
      '小鸟在树上唱歌。',
      '他长得像他爸爸。',
      '弯弯的月亮像小船。',
      '我好像认识他。'
    ],
    answer: 2,
    explanation: '正确答案：弯弯的月亮像小船。把月亮比作小船，有比喻词"像"。',
    mistakeReason: '把比较和比喻混淆了，不是所有有"像"的句子都是比喻句。'
  },
  {
    type: '阅读理解',
    question: '"这件事真让人感动。"这句话中的"感动"可以换成哪个词？',
    options: ['难过', '激动', '生气', '高兴'],
    answer: 1,
    explanation: '正确答案：激动。感动和激动在某些语境下可以互换。',
    mistakeReason: '不理解词语在具体语境中的意思。'
  },
  // 写作表达（11-15题）
  {
    type: '写作表达',
    question: '写人的文章，一般要先写什么？',
    options: ['人物的外貌', '人物的品质', '具体事例', '人物的爱好'],
    answer: 0,
    explanation: '正确答案：人物的外貌。写人通常先介绍外貌，让读者对人物有初步印象。',
    mistakeReason: '不熟悉写人文章的基本结构。'
  },
  {
    type: '写作表达',
    question: '下列哪个结尾方式不恰当？',
    options: [
      '首尾呼应',
      '点明中心',
      '画蛇添足',
      '总结全文'
    ],
    answer: 2,
    explanation: '正确答案：画蛇添足。画蛇添足是贬义词，指做多余的事，反而不好。',
    mistakeReason: '不理解成语的意思和写作方法。'
  },
  {
    type: '写作表达',
    question: '写一件事，最重要的是写清楚：',
    options: ['时间、地点、人物', '事情的经过', '事情的结果', '以上都是'],
    answer: 3,
    explanation: '正确答案：以上都是。写事要写清楚六要素。',
    mistakeReason: '不知道写事的六要素。'
  },
  {
    type: '写作表达',
    question: '下列哪句话写得最生动？',
    options: [
      '花开了。',
      '花开了，真好看。',
      '花儿张开了笑脸。',
      '有很多花开了。'
    ],
    answer: 2,
    explanation: '正确答案：花儿张开了笑脸。用了拟人的手法，写得很生动。',
    mistakeReason: '不会运用修辞手法让句子更生动。'
  },
  {
    type: '写作表达',
    question: '作文题目"一件______的事"，横线处填哪个词最合适？',
    options: ['难忘', '美丽', '高大', '明亮'],
    answer: 0,
    explanation: '正确答案：难忘。只有"难忘"能用来形容事。',
    mistakeReason: '词语搭配不当，不理解哪些词可以修饰"事"。'
  }
];

// 诊断测评状态
let currentDiagnosisQuestion = 0;
let diagnosisAnswers = [];
let diagnosisScores = {
  '字词基础': 0,
  '阅读理解': 0,
  '写作表达': 0
};

// 开始诊断测评
function startDiagnosis() {
  currentDiagnosisQuestion = 0;
  diagnosisAnswers = new Array(diagnosisQuestions.length).fill(null);
  document.getElementById('diagnosisIntro').style.display = 'grid';
  document.getElementById('diagnosisQuiz').style.display = 'block';
  document.getElementById('diagnosisResult').style.display = 'none';
  renderDiagnosisQuestion();
}

// 渲染诊断测评题目
function renderDiagnosisQuestion() {
  const question = diagnosisQuestions[currentDiagnosisQuestion];
  const questionCard = document.getElementById('questionCard');
  
  let optionsHTML = '';
  question.options.forEach((option, index) => {
    const isSelected = diagnosisAnswers[currentDiagnosisQuestion] === index;
    optionsHTML += `
      <button class="option-btn ${isSelected ? 'selected' : ''}" 
              onclick="selectDiagnosisOption(${index})">
        ${option}
      </button>
    `;
  });
  
  questionCard.innerHTML = `
    <div class="question-type">${question.type}</div>
    <div class="question-text">${currentDiagnosisQuestion + 1}. ${question.question}</div>
    <div class="question-options">${optionsHTML}</div>
  `;
  
  // 更新进度
  const progress = ((currentDiagnosisQuestion + 1) / diagnosisQuestions.length) * 100;
  document.getElementById('quizProgress').style.width = progress + '%';
  document.getElementById('currentQ').textContent = currentDiagnosisQuestion + 1;
  
  // 更新导航按钮
  updateDiagnosisNav();
}

// 选择诊断选项
function selectDiagnosisOption(index) {
  diagnosisAnswers[currentDiagnosisQuestion] = index;
  renderDiagnosisQuestion();
}

// 更新诊断导航按钮
function updateDiagnosisNav() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  prevBtn.style.display = currentDiagnosisQuestion > 0 ? 'inline-block' : 'none';
  
  if (currentDiagnosisQuestion < diagnosisQuestions.length - 1) {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  }
  
  // 如果当前题已作答则启用按钮
  nextBtn.disabled = diagnosisAnswers[currentDiagnosisQuestion] === null;
  submitBtn.disabled = diagnosisAnswers[currentDiagnosisQuestion] === null;
}

// 上一题
function prevQuestion() {
  if (currentDiagnosisQuestion > 0) {
    currentDiagnosisQuestion--;
    renderDiagnosisQuestion();
  }
}

// 下一题
function nextQuestion() {
  if (currentDiagnosisQuestion < diagnosisQuestions.length - 1) {
    currentDiagnosisQuestion++;
    renderDiagnosisQuestion();
  }
}

// 提交诊断测评
function submitDiagnosis() {
  // 检查是否所有题都已作答
  const unanswered = diagnosisAnswers.includes(null);
  if (unanswered) {
    alert('请完成所有题目后再提交！');
    return;
  }
  
  // 计算得分
  let totalScore = 0;
  diagnosisScores = {
    '字词基础': 0,
    '阅读理解': 0,
    '写作表达': 0
  };
  
  diagnosisQuestions.forEach((q, index) => {
    const isCorrect = diagnosisAnswers[index] === q.answer;
    if (isCorrect) {
      totalScore++;
      diagnosisScores[q.type]++;
    }
  });
  
  // 保存到错题本
  saveDiagnosisMistakes();
  
  // 显示结果
  showDiagnosisResult(totalScore);
}

// 保存诊断错题
function saveDiagnosisMistakes() {
  const wrongList = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
  
  diagnosisQuestions.forEach((q, index) => {
    if (diagnosisAnswers[index] !== q.answer) {
      const wrongItem = {
        type: '诊断测评 - ' + q.type,
        question: q.question,
        userAnswer: q.options[diagnosisAnswers[index]],
        correctAnswer: q.options[q.answer],
        tip: q.explanation,
        timestamp: new Date().toISOString()
      };
      wrongList.push(wrongItem);
    }
  });
  
  if (wrongList.length > 50) {
    wrongList.splice(0, wrongList.length - 50);
  }
  
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderWrongList();
}

// 显示诊断结果
function showDiagnosisResult(totalScore) {
  document.getElementById('diagnosisQuiz').style.display = 'none';
  document.getElementById('diagnosisResult').style.display = 'block';
  
  // 设置总得分
  document.getElementById('totalScore').textContent = totalScore;
  
  // 渲染技能得分
  const skills = [
    { name: '字词基础', score: diagnosisScores['字词基础'], max: 5 },
    { name: '阅读理解', score: diagnosisScores['阅读理解'], max: 5 },
    { name: '写作表达', score: diagnosisScores['写作表达'], max: 5 }
  ];
  
  const skillScoresDiv = document.getElementById('skillScores');
  let skillScoresHTML = '';
  skills.forEach(skill => {
    const percentage = (skill.score / skill.max) * 100;
    let levelClass = 'good';
    if (percentage < 60) levelClass = 'weak';
    else if (percentage < 80) levelClass = 'medium';
    
    skillScoresHTML += `
      <div class="skill-item">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-bar">
          <div class="skill-fill ${levelClass}" style="width: ${percentage}%"></div>
        </div>
        <div class="skill-score">${skill.score}/${skill.max}</div>
      </div>
    `;
  });
  skillScoresDiv.innerHTML = skillScoresHTML;
  
  // 生成学习建议
  generateSuggestions(skills);
  
  // 保存诊断结果
  localStorage.setItem('lastDiagnosisResult', JSON.stringify({
    totalScore: totalScore,
    skills: diagnosisScores,
    date: new Date().toISOString()
  }));
}

// 生成学习建议
function generateSuggestions(skills) {
  const suggestionsDiv = document.getElementById('suggestions');
  let suggestionsHTML = '<h3>📝 个性化学习建议</h3>';
  
  skills.forEach(skill => {
    const percentage = (skill.score / skill.max) * 100;
    
    if (percentage < 60) {
      suggestionsHTML += `
        <div class="suggestion-item">
          <div class="suggestion-title">⚠️ ${skill.name}需要加强</div>
          <div class="suggestion-text">
            建议加强${skill.name}练习，每天花更多时间在这方面。可以先从基础题开始，循序渐进。
          </div>
        </div>
      `;
    } else if (percentage < 80) {
      suggestionsHTML += `
        <div class="suggestion-item">
          <div class="suggestion-title">📚 ${skill.name}有提升空间</div>
          <div class="suggestion-text">
            ${skill.name}基础还不错，可以多做些提高题，巩固知识掌握得更牢固。
          </div>
        </div>
      `;
    } else {
      suggestionsHTML += `
        <div class="suggestion-item">
          <div class="suggestion-title">🎉 ${skill.name}表现优秀</div>
          <div class="suggestion-text">
            ${skill.name}学得很好！可以挑战一些更难的题目，保持优势。
          </div>
        </div>
      `;
    }
  });
  
  suggestionsDiv.innerHTML = suggestionsHTML;
}

// 重置诊断测评
function resetDiagnosis() {
  document.getElementById('diagnosisIntro').style.display = 'grid';
  document.getElementById('diagnosisQuiz').style.display = 'none';
  document.getElementById('diagnosisResult').style.display = 'none';
  currentDiagnosisQuestion = 0;
  diagnosisAnswers = [];
}

// 跳转到练习
function goToPractice() {
  // 滚动到练习区域
  document.querySelector('.interactive-practice').scrollIntoView({ behavior: 'smooth' });
}

// 作文筛选功能
function filterWriting(grade) {
  // 更新按钮状态
  document.querySelectorAll('.grade-filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'white';
    btn.style.color = '#667eea';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  // 隐藏所有年级内容
  document.querySelectorAll('.writing-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // 显示选中年级内容
  document.getElementById('writing-grade-' + grade).style.display = 'block';
}
