// 练习数据
const transformData = [
  // 被字句转换
  {
    type: '被字句',
    sentence: '小明打死了蚊子。',
    options: ['蚊子被小明打死了。', '蚊子打了小明。', '小明被蚊子打死了。', '蚊子是小明打死的。'],
    answer: 0,
    level: 'easy'
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
    explanation: '高分句运用了比喻修辞（"像吃了蜜一样甜"）和动作描写（"嘴角向上翘起"），把抽象的"开心"变成了可以看见的画面。这就是"用具体代替抽象"的写作技巧——不直接告诉读者你的感受，而是通过描写让读者自己感受到。'
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
    explanation: '高分句用了三个技巧：①比喻（"像一阵风"）让速度变得可感；②动作分解（"双腿飞快地交替"）让画面更具体；③环境烘托（"扬起一片尘土"）侧面描写速度。这就是"把笼统变具体"的写作方法——不要只告诉读者"很快"，要让他们看到"有多快"。'
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
    explanation: '高分句用的是"侧面烘托"手法：不直接说"安静"，而是通过"树叶沙沙声都听得见""大气都不敢喘"来让读者自己感受到安静的程度。好的写作不是告诉读者结论，而是让读者自己得出结论。'
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
      { text: '高分答案更好，因为它有原文依据和详细分析', correct: true },
      { text: '低分答案更好，因为简洁直接不啰嗦', correct: false },
      { text: '两个答案得分应该一样', correct: false },
      { text: '高分答案太长，考试写不完', correct: false }
    ],
    explanation: '低分答案只给了结论，没有证明过程，阅卷老师无法判断你是否读懂了文章。高分答案做到了三点：①引用原文关键词当证据；②解释关键词含义（"毫不犹豫"说明…）；③分析行为背后的品质。这就是阅读题的"观点+证据+分析"答题法——结论只是起点，依据和分析才是得分的关键。'
  },
  {
    type: 'compare',
    badge: '对比分析',
    title: '对比分析：概括段落大意',
    compareLow: '这段写了公园。',
    compareHigh: '这段话描写了春天公园的美丽景色：柳树发芽、桃花盛开、小河解冻，以及小朋友们在草地上开心玩耍的场景。',
    question: '概括段落大意的两个答案，哪个更符合要求？为什么？',
    options: [
      { text: '高分答案更好，因为它具体写出了段落中的要素', correct: true },
      { text: '低分答案更好，因为概括本身就是简单说重点', correct: false },
      { text: '两个答案都可以，得分一样', correct: false },
      { text: '低分答案更简洁，所以更好', correct: false }
    ],
    explanation: '概括内容不是"越短越好"，而是"准确全面"。低分答案只说"写了公园"，太笼统，没有体现段落的核心内容。高分答案做到了：①点明主题（春天公园景色）；②列举具体内容（柳树、桃花、小河、小朋友）；③用"：列举"的结构让条理清晰。好的概括能让没读过原文的人也能知道段落写了什么。'
  },
  {
    type: 'compare',
    badge: '对比分析',
    title: '对比分析：理解词语含义',
    compareLow: '"骄傲"的意思是自以为了不起。',
    compareHigh: '在这个句子中，"骄傲"的意思是"自豪"——妈妈看到孩子取得了好成绩，心里感到光荣和高兴，而不是"自大"的意思。',
    question: '解释"骄傲"这个词的两个答案，哪个更准确？为什么？',
    options: [
      { text: '高分答案更好，因为它结合语境解释了词语的准确含义', correct: true },
      { text: '低分答案更好，因为词典释义就是那个意思', correct: false },
      { text: '两个答案都对，得分一样', correct: false },
      { text: '高分答案写得太啰嗦了', correct: false }
    ],
    explanation: '理解词语题的关键是"结合语境"！很多词语在不同句子中有不同含义。低分答案只给了通用解释，没有联系句子内容。高分答案做到了：①点明在句中的具体含义；②结合上下文解释为什么是这个意思；③和常见含义做区分。这就是"词不离句"的阅读方法。'
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
}

function getWrongAnswers() {
  return JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
}

function clearWrongAnswers() {
  if (confirm('确定要清空所有错题吗？')) {
    localStorage.removeItem('wrongAnswers');
    renderWrongList();
  }
}

function renderWrongList() {
  const wrongList = getWrongAnswers();
  const container = document.getElementById('wrongList');
  
  if (wrongList.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">暂无错题，继续加油！</p>';
    return;
  }
  
  container.innerHTML = wrongList.map((item, index) => `
    <div class="wrong-item">
      <div class="wrong-question">${index + 1}. ${item.question}</div>
      <div class="wrong-answer">我的答案：${item.userAnswer}</div>
      <div class="correct-answer">正确答案：${item.correctAnswer}</div>
      ${item.tip ? `<div class="wrong-tip">提示：${item.tip}</div>` : ''}
      <button class="retry-btn" onclick="retryWrong(${index})">再练一次</button>
    </div>
  `).join('');
}

function retryWrong(index) {
  const wrongList = getWrongAnswers();
  const item = wrongList[index];
  
  alert(`请再做一次这道题：\n\n${item.question}\n\n正确答案：${item.correctAnswer}`);
  
  wrongList.splice(index, 1);
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderWrongList();
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
    html += '    <div class="compare-label high">📈 高分答案</div>';
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
  
  // 关闭奖励弹窗
  document.getElementById('rewardModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('rewardModal')) {
      closeReward();
    }
  });
  
  // 关闭奖励按钮
  document.getElementById('closeRewardBtn').addEventListener('click', closeReward);
});