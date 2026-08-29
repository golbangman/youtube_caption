# Google 공식 웹사이트 번역기 위젯 embed 시도 실패

## 시도한 것

서버측 번역(`lib/translate.ts`)이 무료 provider의 rate limit(`docs/follow-ups/translate-provider-rate-limit.md`)에 걸리는 문제를 우회하기 위해, 구글 공식 "웹사이트 번역기" 위젯(`translate.google.com/translate_a/element.js`)을 상세 화면에 직접 embed하는 방식을 시도했다.

- `translate.google.com`을 iframe으로 직접 embed하는 것은 애초에 불가능함을 확인함 (`x-frame-options: SAMEORIGIN`).
- 대신 구글이 사이트 소유자용으로 공식 제공하는 `google.translate.TranslateElement` 위젯 스크립트를 페이지에 직접 로드하는 방식으로 구현했다. 왼쪽엔 `notranslate` 클래스로 원문을 고정하고, 오른쪽엔 위젯이 번역 대상으로 인식하는 일반 텍스트를 배치.

## 증상

위젯 자체(드롭다운, 언어 옵션)는 정상적으로 로드되지만, 드롭다운에서 "한국어"를 선택해도 번역이 전혀 실행되지 않는다(네트워크 요청 없음, 텍스트 그대로 유지).

## 재현

- 자동화 브라우저(`agent-browser`, CDP로 제어)에서: 코드로 `<select>` 값을 바꾸고 `change` 이벤트를 dispatch → 반응 없음. 실제 CDP 기반 클릭으로 드롭다운을 선택 → 그래도 반응 없음.
- 사용자가 본인의 일반 브라우저(자동화 아님)에서 직접 드롭다운으로 "한국어"를 선택 → 동일하게 반응 없음(2026-08-29 확인).

자동화 특유의 문제가 아니라 위젯 자체가 이 방식으로는 더 이상 동작하지 않는 것으로 결론지었다.

## 확인된 원인

추가로 위젯 내부 JS 번들(`element_main.js`)을 직접 받아 살펴봤다. `goog-te-combo`의 `change` 리스너는 정상적으로 등록되어 있고(`addEventListener("change", ...)`), 실제로 값이 "ko"로 바뀐 change 이벤트도 정상 전달된다(리스너 자체는 호출됨). 그런데 그 이후 실제 번역을 요청하는 네트워크 호출이 단 한 건도 발생하지 않는다 — 즉 이벤트는 받지만 내부 로직 어딘가에서 조용히 중단된다.

원인은 코드 문제가 아니라 **구글 정책**이었다:

- 구글은 이 "Website Translator" 위젯을 2019년에 신규(상업용) 사이트 대상으로는 중단했다. 위젯 스크립트 자체(드롭다운 UI, 언어 옵션)는 여전히 배포되지만, 실제 번역을 수행하는 백엔드 동작은 승인된 사이트에만 제공되는 것으로 보인다.
- 2020년 이후로는 정부·비영리·학술 기관 등 비상업 목적 사이트로만 이용이 제한되어 있다. 우리 프로젝트(개인용 로컬 도구)는 이 허용 대상에 해당하지 않아, 위젯 UI만 로드되고 실제 번역 트리거는 조용히 무시된 것으로 보인다.
- 참고: [Google Translate Widget Discontinued | Brave River](https://www.braveriver.com/blog/google-discontinues-google-translate-widget/), [Google Translate Website Widget Discontinued — TranslatePress](https://translatepress.com/google-translate-website-widget/)

## 결론 / 다음 단계

이 접근은 폐기하고 서버측 번역(Google 비공식 엔드포인트 → MyMemory 폴백)으로 되돌렸다. **재시도할 가치 없음** — 코드를 어떻게 고쳐도 구글이 이 위젯의 번역 백엔드를 우리 사이트 종류(개인/상업용)에 허용하지 않는 한 동작하지 않는다.
