# 무료 번역 제공자(Google/MyMemory) 동시 rate limit 발생

## 증상

`https://youtu.be/OWoaBte145I` 영상으로 실제 화면(폼 제출)에서 동작 확인 중,
자막 추출까지는 성공했지만 번역 단계에서 실패했다.

```
translateToKorean failed: Error: MyMemory 번역 요청 실패 (429)
```

## 재현

`lib/translate.ts`가 호출하는 두 provider를 이 환경에서 직접 호출해 확인함.

- `translate.googleapis.com/translate_a/single`: `429`, "we can't process your
  request right now" (자동화된 요청으로 차단). 15초 후 재시도해도 동일.
- `api.mymemory.translated.net/get`: `429`, "YOU USED ALL AVAILABLE FREE
  TRANSLATIONS FOR TODAY" (일일 무료 할당량 소진, 리셋까지 약 9시간 42분).

## 의심 원인

이번 작업(코드 변경)과 무관하다. 이 샌드박스가 사용하는 발신 IP에서 두 무료
번역 API의 일일/버스트 한도를 이미 소진한 상태로 보인다. `data/records.json`에
남아있는 기존 레코드(`jNQXAC9IVRw`, 2026-08-25 생성)는 영어 원문과 한국어 번역이
모두 정상적으로 채워져 있어, 코드 로직 자체는 quota가 남아있을 때 정상 동작함을
보여준다.

## 시도한 것

- yt-dlp로 `OWoaBte145I`의 `automatic_captions.en` json3 자막을 직접 받아
  파싱 로직(`fetchEnglishTranscript`와 동일한 로직)을 수동 실행 → 19,267자
  텍스트 정상 추출 확인.
- Google/MyMemory 엔드포인트를 앱 밖에서 curl로 직접 호출해 429 원인이
  코드가 아니라 provider 쪽 한도임을 확인.

## 제안하는 다음 단계

- 재현이 필요하면 quota가 리셋된 뒤(MyMemory 기준 수 시간 후) 같은 URL로
  다시 시도.
- 반복적으로 겪는다면 API 키 기반 번역 서비스(Google Cloud Translation 등)로
  교체하거나 provider를 더 추가하는 것을 고려.
