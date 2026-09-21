# 2026 웹서버프로그래밍 — 유튜브뮤직 만들기

작성자: 20230625 신혜원

---

원래 실습은 멜론 차트를 따라 만드는 거였는데, 어차피 만드는 거 내가 평소에 쓰는 유튜브뮤직 스타일로 바꿔서 해보고 싶었다. 그래서 페이지 테마 자체를 유튜브뮤직 느낌(검은 배경, 빨간 포인트 컬러)으로 바꿔서 만들었고, 그러다 보니 검색창도 그냥 껍데기로 두기가 싫어서 실제로 동작하게 만들어보기로 했다.

**시작할 때 상황**

카드(`.card`)랑 리스트(`.track`)에 각각 제목, 가수, 이미지, 링크가 다 들어있긴 한데, 검색에 쓸 만한 텍스트가 따로 없었다. 화면에 보이는 `<div class="card-title">LOVE ATTACK</div>` 같은 텍스트를 JS로 긁어와서 비교하는 방법도 있겠다 싶었는데, AI한테 물어보니 `data-*` 속성이라는 걸 알려줬다. 태그에 `data-search="LOVE ATTACK 리센느 RESCENE"`처럼 검색용 텍스트를 미리 박아두면 JS에서 훨씬 깔끔하게 꺼내 쓸 수 있다고 했다. 화면에 보이는 텍스트랑 로직에서 쓰는 텍스트를 분리해두면 나중에 디자인이 바뀌어도 검색 로직은 안 건드려도 된다는 장점이 있었다.

**막힌 부분 1 — CSS 셀렉터 묶음 처리**

카드는 `<a class="card">`고 리스트 항목은 `<li class="track">`라서, 태그도 다르고 클래스도 다르다. 처음엔 `querySelectorAll(".card")`랑 `querySelectorAll(".track")`를 따로 불러서 두 번 반복문을 돌려야 하나 싶었는데, CSS에서 셀렉터를 콤마로 묶어 쓰는 것처럼 `querySelectorAll(".card, .track")`으로 한 번에 가져올 수 있다는 걸 알고 나니 코드가 확 줄었다. CSS 문법이 JS 안에서도 그대로 쓰인다는 게 신기했다.

**막힌 부분 2 — 대소문자, 부분 검색**

처음 짠 코드는 `text === keyword`처럼 완전히 똑같아야만 걸리는 식이었는데, 이러면 "리센느"만 쳐도 아무것도 안 나온다. AI가 `includes()`를 알려줘서 부분 문자열 포함 여부로 바꿨고, "I.O.I"랑 "i.o.i"를 다르게 취급하는 것도 이상해서 양쪽 다 `toLowerCase()`로 맞춰줬다.

```js
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  items.forEach((item) => {
    const text = item.dataset.search.toLowerCase();
    item.hidden = !text.includes(keyword);
  });
});
```

**막힌 부분 3 — hidden 속성과 CSS 우선순위**

`item.hidden = true`로 하면 정말 안 보이나 싶어서 개발자 도구로 확인해봤다. 알고 보니 `hidden` 속성은 브라우저가 기본적으로 `display: none` 정도로 처리해주긴 하는데, 다른 CSS가 `display: flex` 같은 걸로 덮어써버리면 씹힐 수 있다고 한다. 그래서 코드에 이미 이런 게 준비돼 있었다.

```css
[hidden] {
  display: none !important;
}
```

`!important`로 못 박아둔 이유를 이번에 제대로 이해했다. JS는 "이거 숨길지 말지"만 결정하고, 실제로 화면에서 어떻게 사라지게 할지는 CSS 담당이라는 역할 나누기가 마음에 들었다.

**오늘 새로 안 것들**

- `data-*` 커스텀 속성과 `element.dataset`
- `querySelectorAll`에 콤마로 여러 셀렉터 묶기
- `includes()` / `toLowerCase()`로 느슨한 문자열 매칭
- `element.hidden`과 `[hidden] { display: none !important }`의 관계

**다음에 해보고 싶은 것**

지금은 상단의 운동/집중/기분 전환 같은 카테고리 칩을 눌러도 아무 반응이 없는데, 이것도 검색이랑 비슷하게 눌렀을 때 해당 카테고리 곡만 걸러지도록 만들어보고 싶다. 그리고 지금은 하단 플레이어 바가 LOVE ATTACK으로 고정돼 있는데, 카드나 트랙을 클릭했을 때 그 곡 정보가 플레이어 바에 반영되도록 해보고 싶다. 마지막으로 지금은 카드를 클릭하면 바로 유튜브 검색 결과로 넘어가버리는데, 이것보다는 곡을 더 늘려서 사용자가 원하는 곡들을 직접 플레이리스트에 담을 수 있게 만들어보고 싶다.
