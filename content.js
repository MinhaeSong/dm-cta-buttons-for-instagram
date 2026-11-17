// IG DM 버튼 표시기
// 인스타그램 웹이 받아 두고도 화면에 그리지 않는 자동 DM 버튼(postback, 링크)을 메시지 아래에 표시합니다.
(function () {
  'use strict';
  const MARK = 'data-igdmbtn';

  function getFiber(el) {
    const k = Object.keys(el).find((k) => k.startsWith('__reactFiber'));
    return k ? el[k] : null;
  }

  let cachedEnv = null;
  function getEnv() {
    if (cachedEnv) return cachedEnv;
    const main = document.querySelector('[role="main"]') || document.body;
    const els = main.querySelectorAll('div');
    for (let i = 0; i < els.length && i < 400; i++) {
      let f = getFiber(els[i]);
      let n = 0;
      while (f && n < 200) {
        const v = f.memoizedProps && f.memoizedProps.value;
        if (v && v.environment && v.environment.getStore) {
          cachedEnv = v.environment;
          return cachedEnv;
        }
        f = f.return;
        n++;
      }
    }
    return null;
  }

  function req(name) {
    try { return window.require(name); } catch (e) { return null; }
  }

  function currentThreadKey() {
    const m = location.pathname.match(/\/direct\/t\/(\d+)/);
    return m ? m[1] : null;
  }

  function findThreadId(src) {
    const key = currentThreadKey();
    if (!key) return null;
    for (const id of src.getRecordIDs()) {
      if (!id.startsWith('XFBIGDirectViewerThread:')) continue;
      const r = src.get(id);
      if (r && r.thread_key === key && r.thread_id) return r.thread_id;
    }
    return null;
  }

  // 메시지 id별 버튼 목록
  function collectButtons(src) {
    const map = new Map();
    for (const id of src.getRecordIDs()) {
      const m = id.match(/^client:SlideMessage:(mid\.[^:]+):content:xma:cta_buttons:(\d+)$/);
      if (!m) continue;
      const r = src.get(id);
      if (!r || !r.title) continue;
      if (!map.has(m[1])) map.set(m[1], []);
      map.get(m[1])[+m[2]] = r;
    }
    return map;
  }

  // 화면의 메시지 요소에서 메시지 id 찾기
  function messageIdOf(el) {
    let f = getFiber(el);
    let n = 0;
    while (f && n < 40) {
      const p = f.memoizedProps;
      if (p) {
        for (const key of ['xmaContentRef', 'standardXMARef', 'slideMessageXMAContent']) {
          const ref = p[key];
          const rid = ref && ref.__id;
          if (typeof rid === 'string') {
            const m = rid.match(/SlideMessage:(mid\.[^:]+):content/);
            if (m) return m[1];
          }
        }
      }
      f = f.return;
      n++;
    }
    return null;
  }

  function sendPostback(env, threadId, btn, uiBtn) {
    const CometRelay = req('CometRelay');
    const mutation = req('IGDGenericTemplatePostbackCTAButtonOffMsysMutation.graphql');
    const ctx = req('createIGDMessageSendContext');
    if (!CometRelay || !mutation || !ctx) {
      uiBtn.textContent = '오류: 인스타그램 내부 모듈을 찾지 못했어요';
      return;
    }
    uiBtn.disabled = true;
    uiBtn.textContent = '보내는 중…';
    CometRelay.commitMutation(env, {
      mutation,
      variables: {
        input: {
          ig_thread_igid: threadId,
          offline_threading_id: ctx(env).offlineThreadingId,
          postback_payload: { sensitive_string_value: btn.postback_payload },
          text: { sensitive_string_value: btn.title },
        },
      },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          uiBtn.disabled = false;
          uiBtn.textContent = '실패, 다시 누르기: ' + btn.title;
          console.warn('[IG DM 버튼]', errors);
        } else {
          uiBtn.textContent = '✓ 보냄: ' + btn.title;
        }
      },
      onError: (e) => {
        uiBtn.disabled = false;
        uiBtn.textContent = '실패, 다시 누르기: ' + btn.title;
        console.warn('[IG DM 버튼]', e);
      },
    });
  }

  function makeUI(env, threadId, buttons) {
    const box = document.createElement('div');
    box.setAttribute(MARK, '1');
    box.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin:8px 0 2px;';
    for (const b of buttons) {
      if (!b) continue;
      const el = document.createElement('button');
      el.type = 'button';
      el.textContent = b.title;
      el.style.cssText =
        'cursor:pointer;border:0;border-radius:10px;padding:8px 12px;font-weight:600;font-size:14px;' +
        'background:rgba(255,255,255,0.15);color:inherit;width:100%;';
      if (b.cta_type === 'postback' && b.postback_payload) {
        el.title = '누르면 이 문구가 상대에게 전송됩니다';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          sendPostback(env, threadId, b, el);
        });
      } else if (b.action_url) {
        el.title = '링크 열기';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(b.action_url, '_blank', 'noopener');
        });
      } else {
        el.disabled = true;
        el.title = '지원하지 않는 버튼 형식: ' + (b.cta_type || '알 수 없음');
      }
      box.appendChild(el);
    }
    return box;
  }

  function scan() {
    const env = getEnv();
    if (!env) return;
    let src;
    try { src = env.getStore().getSource(); } catch (e) { cachedEnv = null; return; }
    const btnMap = collectButtons(src);
    if (!btnMap.size) return;
    const threadId = findThreadId(src);

    // 각 XMA 메시지의 제목 텍스트를 찾아 그 아래에 버튼 삽입
    const done = new Set();
    for (const [mid, buttons] of btnMap) {
      const xma = src.get('client:SlideMessage:' + mid + ':content:xma');
      const title = xma && xma.title_text;
      if (!title) continue;
      const first = title.split('\n')[0].trim().slice(0, 30);
      const candidates = document.querySelectorAll('[role="main"] div, [role="main"] span');
      for (const el of candidates) {
        if (el.childElementCount > 3) continue;
        if (!el.textContent || !el.textContent.includes(first)) continue;
        if ([...el.children].some((c) => c.textContent.includes(first))) continue; // 가장 안쪽 요소만
        if (done.has(el)) continue;
        if (messageIdOf(el) !== mid) continue;
        const host = el.parentElement;
        if (!host || host.querySelector('[' + MARK + ']')) { done.add(el); continue; }
        if (!threadId && buttons.some((b) => b && b.cta_type === 'postback')) continue;
        host.appendChild(makeUI(env, threadId, buttons));
        done.add(el);
      }
    }
  }

  let timer = null;
  const obs = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; try { scan(); } catch (e) { console.warn('[IG DM 버튼]', e); } }, 600);
  });
  function start() {
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(scan, 1500);
  }
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) { lastPath = location.pathname; cachedEnv = null; }
  }, 1000);
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
