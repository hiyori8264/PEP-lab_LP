(function () {
  var config = window.SITE_CONFIG || {};
  var lineUrl = (config.lineUrl || "").trim();

  // 要素をつくる小さな関数（文字は textContent で入れるので安全）
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // ----- コミュニティ・イベントの表示（js/communities.js の内容から作る） -----
  var communities = Array.isArray(window.COMMUNITIES) ? window.COMMUNITIES : [];
  var list = document.getElementById("community-list");

  function renderEvent(ev) {
    var item = el("li", "community-event");
    item.appendChild(el("p", "community-event__title", ev.title));

    var info = el("dl", "event-card__info");
    [["日時", ev.date], ["場所", ev.place], ["参加費", ev.fee]].forEach(function (row) {
      if (!row[1]) return;
      info.appendChild(el("dt", "", row[0]));
      info.appendChild(el("dd", "", row[1]));
    });
    if (info.children.length) item.appendChild(info);
    if (ev.description) item.appendChild(el("p", "community-event__text", ev.description));

    var link = el("a", "community-event__link");
    if (ev.url) {
      link.href = ev.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "詳細・申し込み";
    } else {
      link.href = "#cta";
      link.setAttribute("data-line-link", "");
      link.textContent = "LINEで参加方法を受け取る";
    }
    item.appendChild(link);
    return item;
  }

  function renderCommunity(c) {
    var card = el("article", "community-card reveal");

    if (c.image) {
      var imgWrap = el("div", "community-card__image");
      var img = el("img");
      img.src = c.image;
      img.alt = c.name || "";
      img.loading = "lazy";
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);
    }

    var body = el("div", "community-card__body");
    var head = el("div", "community-card__head");
    if (c.isNew) head.appendChild(el("span", "badge-new", "NEW"));
    if (c.company) head.appendChild(el("span", "community-card__company", c.company));
    body.appendChild(head);
    body.appendChild(el("h4", "community-card__title", c.name));
    if (c.description) body.appendChild(el("p", "community-card__text", c.description));

    if (Array.isArray(c.tags) && c.tags.length) {
      var tags = el("ul", "community-card__tags");
      c.tags.forEach(function (t) { tags.appendChild(el("li", "tag", t)); });
      body.appendChild(tags);
    }

    var events = Array.isArray(c.events) ? c.events : [];
    body.appendChild(el("p", "community-card__label", "開催予定のイベント"));
    if (events.length) {
      var evList = el("ul", "community-events");
      events.forEach(function (ev) { evList.appendChild(renderEvent(ev)); });
      body.appendChild(evList);
    } else {
      body.appendChild(el("p", "community-card__empty", "イベント情報は準備中です。決まり次第LINEでお知らせします。"));
    }

    card.appendChild(body);
    return card;
  }

  if (list && communities.length) {
    list.innerHTML = "";
    communities.forEach(function (c) { list.appendChild(renderCommunity(c)); });
  }

  // ----- LINE登録ボタン（data-line-link 属性が付いたリンク）にURLを反映 -----
  var links = document.querySelectorAll("[data-line-link]");
  links.forEach(function (link) {
    if (lineUrl) {
      link.href = lineUrl;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = "#cta";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert("LINE公式アカウントは現在準備中です。公開まで少々お待ちください。");
      });
    }
  });

  // ----- Instagramリンク（data-instagram-link 属性が付いたリンク） -----
  var instagramUrl = (config.instagramUrl || "").trim();
  document.querySelectorAll("[data-instagram-link]").forEach(function (link) {
    if (instagramUrl) {
      link.href = instagramUrl;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      // URLが未設定ならリンクごと隠す
      (link.closest("li, p") || link).style.display = "none";
    }
  });

  // ----- スクロールに合わせてふわっと表示 -----
  var targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (node) { node.classList.add("is-visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(function (node) { observer.observe(node); });
})();
