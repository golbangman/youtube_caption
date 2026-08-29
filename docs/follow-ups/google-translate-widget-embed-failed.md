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

## 의심 원인

- 최근 구글이 이 위젯의 내부 구현을 변경해, `<select class="goog-te-combo">`를 직접 조작하는 전통적인 방식이 더 이상 실제 번역 트리거로 이어지지 않는 것으로 보인다(정확한 내부 동작은 비공개라 확인 불가).
- `googtrans` 쿠키를 사전에 설정하고 새로고침하는 방식도 함께 시도했으나 동일하게 동작하지 않았다.

## 결론 / 다음 단계

이 접근은 폐기하고 서버측 번역(Google 비공식 엔드포인트 → MyMemory 폴백)으로 되돌렸다. 이 방식을 다시 시도할 필요는 없다 — 재시도하기 전에 구글이 위젯 스펙을 변경했는지부터 확인할 것.
