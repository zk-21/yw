const fs = require('fs');
const execSync = require('child_process').execSync;
const cwd = 'd:/work/张可/点点/create-a-notion-doc-summarizing-my';

// Current file
const cur = fs.readFileSync(cwd + '/grade4.html', 'utf8');
console.log('=== CURRENT grade4.html ===');
console.log('Total chars:', cur.length);
console.log('Lines:', cur.split('\n').length);
console.log('特级教师精讲:', (cur.match(/特级教师精讲/g) || []).length);
console.log('study-block accent:', (cur.match(/study-block accent/g) || []).length);
console.log('<section:', (cur.match(/<section /g) || []).length);
console.log('</section>:', (cur.match(/<\/section>/g) || []).length);

// Git original
const orig = execSync('git show 951fea4:grade4.html', {cwd: cwd}).toString();
console.log('\n=== GIT grade4.html ===');
console.log('Total chars:', orig.length);
console.log('Lines:', orig.split('\n').length);
console.log('特级教师精讲:', (orig.match(/特级教师精讲/g) || []).length);
console.log('study-block accent:', (orig.match(/study-block accent/g) || []).length);
console.log('<section:', (orig.match(/<section /g) || []).length);
console.log('</section>:', (orig.match(/<\/section>/g) || []).length);
