const serviceItems = {
  booking: {
    tab: "订舱服务",
    title: "订舱服务",
    text: "针对整箱（FCL）及拼箱（LCL）国际运输，我们将根据实际情况，为您推荐所需的货船或航班，并安排最佳货运舱位。",
    mediaClass: "service-media-booking",
    illustration: `
      <div class="service-illustration service-illustration-booking" aria-hidden="true">
        <span class="ship-main"></span>
        <span class="ship-bridge"></span>
        <span class="ship-cargo"></span>
        <span class="far-ship"></span>
      </div>
    `
  },
  customs: {
    tab: "清关·查验",
    title: "通关 · 检查",
    text: "凭借广博深厚的专业学识，以及久经沉淀的丰富经验，全方位助力进出口货物合法依规、高效快捷地通过行政许可流程，确保每一次货物流转都畅行无阻。",
    mediaClass: "service-media-customs",
    illustration: `
      <div class="service-illustration service-illustration-customs" aria-hidden="true">
        <span class="port-blocks"></span>
        <span class="truck-line"></span>
        <span class="worker"></span>
      </div>
    `
  },
  warehouse: {
    tab: "仓储配送服务",
    title: "仓库·配送",
    text: "我们珍视客户所托，定将其重要货物如期送达，不负所望。同时，对于客户的细致需求与特殊条件，将竭尽所能，全力提升服务品质，不负每一份信任。",
    mediaClass: "service-media-warehouse",
    illustration: `
      <div class="service-illustration service-illustration-warehouse" aria-hidden="true">
        <span class="warehouse-roof"></span>
        <span class="container-door"></span>
        <span class="cargo-pallet cargo-a"></span>
        <span class="cargo-pallet cargo-b"></span>
        <span class="cargo-pallet cargo-c"></span>
      </div>
    `
  }
};

const noticesApiUrl = "/api/notices";
const app = document.querySelector("#app");
const navLinks = Array.from(document.querySelectorAll(".nav a"));

let noticesCache = null;

async function loadNotices() {
  if (noticesCache) {
    return noticesCache;
  }

  const response = await fetch(noticesApiUrl, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load notices: ${response.status}`);
  }

  const payload = await response.json();
  noticesCache = Array.isArray(payload.items) ? payload.items : [];
  return noticesCache;
}

function scheduleRows(items, limit = 5) {
  return items
    .slice(0, limit)
    .map(
      (item) => `
        <a class="schedule-row" href="#/news">
          <span>${item.title}</span>
          <span>${item.updatedAt}</span>
        </a>
      `
    )
    .join("");
}

function newsRows(items) {
  return items
    .map(
      (item) => `
        <div class="news-row">
          <span class="news-title">${item.title}</span>
          <span class="news-pdf">
            <a class="pdf-download" href="${item.downloadUrl}" download="${item.fileName || ""}" target="_blank" rel="noopener noreferrer" aria-label="下载 ${item.title}">
              <span class="pdf-icon" aria-hidden="true"></span>
            </a>
          </span>
          <span class="news-time">${item.updatedAt}</span>
        </div>
      `
    )
    .join("");
}

function homePage(items) {
  const initial = serviceItems.booking;

  return `
    <div class="page-shell">
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-inner">
          <div class="hero-copy">
            <h1>专业成就可能</h1>
            <p>让精准履约，驱动你的全球化交付。</p>
          </div>
        </div>
      </section>

      <section class="section section-services">
        <div class="container">
          <div class="section-heading">
            <h2>服务项目介绍</h2>
          </div>

          <div class="service-tabs" role="tablist" aria-label="服务项目">
            ${Object.entries(serviceItems)
              .map(
                ([key, item], index) => `
                  <button class="service-tab ${index === 0 ? "is-active" : ""}" type="button" data-service="${key}">
                    ${item.tab}
                  </button>
                `
              )
              .join("")}
          </div>

          <article class="service-panel">
            <div id="service-media" class="service-media ${initial.mediaClass}">
              ${initial.illustration}
            </div>

            <div class="service-content">
              <h3 id="service-title">${initial.title}</h3>
              <p id="service-text">${initial.text}</p>
              <a class="text-link" href="#/service">查看更多</a>
            </div>
          </article>
        </div>
      </section>

      <section class="section section-schedule">
        <div class="container">
          <div class="section-heading">
            <h2>通知与船舶计划</h2>
          </div>

          <div class="schedule-table">
            <div class="schedule-head">
              <span>标题</span>
              <span>更新时间</span>
            </div>
            ${scheduleRows(items, 5)}
          </div>

          <div class="section-more">
            <a class="text-link" href="#/news">查看更多</a>
          </div>
        </div>
      </section>

      <section class="section section-split">
        <div class="container split-grid">
          <article class="about-card">
            <div class="about-card-inner">
              <h2>关于我们</h2>
              <p>上海新悦航运有限公司，已正式获中国交通运输部认可，荣膺无船承运人资质。凭借专业实力，公司以“上海新悦”之名广为人知，并作为上海航运交易所正式会员，持续专注于海运、空运、铁路和国内物流市场。</p>
              <p>我们坚持以客户为中心，致力于优化货运链路，为全球客户打造更卓越、更省心的物流体验。</p>
              <a class="btn btn-light" href="#/about">查看更多</a>
            </div>
          </article>

          <article class="contact-card">
            <h2>联系我们</h2>
            <p>如果您在物流方面有任何疑问，欢迎随时与我们联系。</p>
            <a class="btn btn-primary wide" href="#/contact">查看更多</a>
          </article>
        </div>
      </section>
    </div>
  `;
}

function newsPage(items) {
  return `
    <div class="page-shell">
      <section class="news-hero">
        <div class="container news-hero-inner">
          <div class="news-hero-copy">
            <h1>通知与船舶计划</h1>
            <p>我们将提供最新资讯和船期表等相关通知</p>
          </div>
        </div>
      </section>

      <section class="news-section">
        <div class="container">
          <div class="news-table">
            <div class="news-head">
              <span>标题</span>
              <span>PDF下载</span>
              <span>更新时间</span>
            </div>
            ${newsRows(items)}
          </div>

          <div class="pagination" aria-label="分页">
            <span>前往</span>
            <span class="page-chip">1</span>
            <span>页</span>
            <span>&lt;</span>
            <span class="page-number is-active">1</span>
            <span class="page-number">2</span>
            <span class="page-number">3</span>
            <span class="page-number">4</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function placeholderPage(title, text) {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>${title}</h1>
          <p>${text}</p>
        </div>
      </div>
    </section>
  `;
}

function loadingPage() {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>加载中</h1>
          <p>正在读取通知与船舶计划数据...</p>
        </div>
      </div>
    </section>
  `;
}

function errorPage() {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>数据加载失败</h1>
          <p>请检查 `/api/notices` 接口和 PDF 文件路径是否已正确部署。</p>
        </div>
      </div>
    </section>
  `;
}

function normalizeRoute(hash) {
  return hash.replace(/^#/, "") || "/home";
}

function setActiveNav(route) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
}

function bindServiceTabs() {
  const tabs = document.querySelectorAll(".service-tab");
  const title = document.querySelector("#service-title");
  const text = document.querySelector("#service-text");
  const media = document.querySelector("#service-media");

  if (!tabs.length || !title || !text || !media) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const next = serviceItems[tab.dataset.service];

      if (!next) {
        return;
      }

      tabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      title.textContent = next.title;
      text.textContent = next.text;
      media.className = `service-media ${next.mediaClass}`;
      media.innerHTML = next.illustration;
    });
  });
}

async function render() {
  const route = normalizeRoute(location.hash);
  setActiveNav(route);

  if (route === "/service") {
    app.innerHTML = placeholderPage("业务中心", "服务详情页可继续在这里扩展，当前已将首页“服务项目介绍”调整为三部分展示。");
    return;
  }

  if (route === "/tracking") {
    app.innerHTML = placeholderPage("货物追踪", "这里可以接入提单号、箱号或订单号查询功能。");
    return;
  }

  if (route === "/about") {
    app.innerHTML = placeholderPage("关于我们", "公司介绍、资质证书与发展历程可在此继续补充。");
    return;
  }

  if (route === "/workspace") {
    app.innerHTML = placeholderPage("我的工作台", "登录后可查看订单、下载单据和处理消息。");
    return;
  }

  if (route !== "/home" && route !== "/news") {
    location.replace("#/home");
    return;
  }

  app.innerHTML = loadingPage();

  try {
    const notices = await loadNotices();
    app.innerHTML = route === "/home" ? homePage(notices) : newsPage(notices);
    bindServiceTabs();
    window.scrollTo({ top: 0, behavior: "auto" });
  } catch (error) {
    console.error(error);
    app.innerHTML = errorPage();
  }
}

if (!location.hash) {
  location.replace("#/home");
} else {
  render();
}

window.addEventListener("hashchange", render);
