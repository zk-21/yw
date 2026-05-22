const fs = require('fs');
const c = fs.readFileSync('d:/work/张可/点点/create-a-notion-doc-summarizing-my/grade4.html','utf8');

let m;
m = c.match(/特级教师精讲/g); console.log('精讲:', m ? m.length : 0);
m = c.match(/study-block accent/g); console.log('accent:', m ? m.length : 0);
m = c.match(/<section /g); console.log('<section:', m ? m.length : 0);
m = c.match(/<\/section>/g); console.log('</section>:', m ? m.length : 0);
console.log('Lines:', c.split('\n').length);

// Check for specific sections
const sections = [
  'pre-diagnostic', 'grade-closed-loop', 'lesson-pack', 'advanced-bank',
  'stage-assessment', 'teacher-note'
];
sections.forEach(s => {
  m = c.match(new RegExp('class="section ' + s, 'g'));
  console.log(s + ':', m ? m.length : 0);
});

m = c.match(/课标对照/g); console.log('课标对照:', m ? m.length : 0);
m = c.match(/二轮加厚题库/g); console.log('二轮加厚题库:', m ? m.length : 0);
m = c.match(/拔尖题型/g); console.log('拔尖题型:', m ? m.length : 0);
m = c.match(/补充提优/g); console.log('补充提优:', m ? m.length : 0);
