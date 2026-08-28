# vitest 실행 시 jsdom/undici 초기화 오류

## 증상

`bun run test` 실행 시 테스트가 하나도 실행되지 않고 다음 오류로 즉시 실패한다.

```
TypeError: webidl.util.markAsUncloneable is not a function
  at new CacheStorage node_modules/undici/lib/web/cache/cachestorage.js:20:17
  at node_modules/jsdom/lib/api.js:12:33
```

## 재현

이 저장소를 아무 수정 없이(`git stash`) 그대로 둔 상태에서도 동일하게 재현된다. 즉 이번 작업(유튜브 자막 번역 기능 추가)과 무관한, 저장소의 기존 의존성 조합 문제다.

## 의심 원인

`jsdom@30`이 내부적으로 사용하는 `undici`가 현재 Node.js 런타임(v20.20.2, package.json에는 `>=20.9.0` 요구)의 `webidl` 구현과 맞지 않는 것으로 보인다. `jsdom`, `undici`, 또는 Node.js 버전 중 하나를 조정하면 해결될 가능성이 있다.

## 시도한 것

- `git stash`로 원본 상태에서 재현 여부만 확인함 (재현됨 — 이번 작업의 원인이 아님을 확인).
- 실제 원인 조사나 버전 조정은 시도하지 않음(이번 작업 범위 밖).

## 제안하는 다음 단계

`jsdom`/`undici` 버전 조합을 Node.js 실행 환경과 맞춰 조정하거나, Node.js 버전을 올려서 재현되는지 확인 필요.
