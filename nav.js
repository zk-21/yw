/**
 * 导航汉堡菜单控制（移动端）
 * 功能：点击汉堡按钮切换菜单、点击链接关闭、点击外部关闭、按 Escape 关闭
 */
document.addEventListener('DOMContentLoaded', function () {
  var topbar = document.querySelector('.topbar');
  var hamburger = document.getElementById('hamburger-btn');
  if (!topbar || !hamburger) return;

  // 点击汉堡按钮切换导航
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    topbar.classList.toggle('nav-visible');
  });

  // 点击导航链接后关闭菜单
  topbar.querySelectorAll('.nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      topbar.classList.remove('nav-visible');
    });
  });

  // 点击页面其他区域关闭菜单
  document.addEventListener('click', function (e) {
    if (!topbar.contains(e.target)) {
      topbar.classList.remove('nav-visible');
    }
  });

  // 按 Escape 键关闭菜单
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      topbar.classList.remove('nav-visible');
    }
  });
});
