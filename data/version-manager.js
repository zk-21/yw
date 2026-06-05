/**
 * 版本管理工具 - 与 Service Worker 通信
 * 提供版本查询、强制刷新、回滚等功能
 */
(function() {
  'use strict';

  function sendMessageToSW(type, data = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
        reject(new Error('Service Worker 不可用'));
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'ERROR' || event.data.type.endsWith('ERROR')) {
          reject(new Error(event.data.error || '操作失败'));
        } else {
          resolve(event.data);
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type, data },
        [channel.port2]
      );
    });
  }

  // ── 公开 API ──────────────────────────────────────────────
  window.VersionManager = {
    /**
     * 获取当前版本信息
     * @returns {Promise<{currentVersion: number, availableVersions: Array, hasRollbackOption: boolean}>}
     */
    getVersionInfo: function() {
      return sendMessageToSW('GET_VERSION_INFO').then(res => res.data);
    },

    /**
     * 强制刷新缓存（重新加载所有资源）
     * @returns {Promise<void>}
     */
    forceRefresh: function() {
      return sendMessageToSW('FORCE_REFRESH').then(() => {
        // 刷新页面以应用新缓存
        window.location.reload();
      });
    },

    /**
     * 回滚到上一版本
     * @returns {Promise<{rolledBackTo: number}>}
     */
    rollback: function() {
      return sendMessageToSW('ROLLBACK').then(res => {
        // 刷新页面以应用回滚
        window.location.reload();
        return res.data;
      });
    },

    /**
     * 清空所有缓存
     * @returns {Promise<void>}
     */
    clearCache: function() {
      return sendMessageToSW('CLEAR_CACHE');
    },

    /**
     * 检查是否有新版本可用
     * @returns {Promise<boolean>}
     */
    checkForUpdate: function() {
      return new Promise((resolve) => {
        if (!navigator.serviceWorker) {
          resolve(false);
          return;
        }

        navigator.serviceWorker.register('service-worker.js').then((reg) => {
          if (reg.waiting) {
            resolve(true);
            return;
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                resolve(true);
              }
            });
          });

          resolve(false);
        }).catch(() => resolve(false));
      });
    },

    /**
     * 提示用户有新版本可用
     * @param {Function} onUpdate - 更新回调函数
     * @param {Function} onNoUpdate - 无更新回调函数
     */
    promptForUpdate: function(onUpdate, onNoUpdate) {
      this.checkForUpdate().then((hasUpdate) => {
        if (hasUpdate) {
          if (typeof onUpdate === 'function') {
            onUpdate();
          } else if (window.confirm('检测到新版本，是否立即更新？')) {
            this.forceRefresh();
          }
        } else if (typeof onNoUpdate === 'function') {
          onNoUpdate();
        }
      });
    }
  };
})();
