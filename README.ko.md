# DM CTA Buttons for Instagram: 인스타그램 PC 웹 DM CTA 버튼 렌더러 (크롬 확장 프로그램)

[English](README.md) | **한국어**

인스타그램 DM에서 "아래 버튼을 클릭하시면 DM이 발송됩니다!"라는 메시지를 받았는데 PC에서는 버튼이 안 보이나요? 댓글 자동 DM(ManyChat 같은 도구)이 보낸 버튼은 휴대폰 앱에서만 보이고, 인스타그램 PC 웹에는 나타나지 않습니다. 이 크롬 확장 프로그램을 설치하면 PC에서도 그 버튼을 보고 누를 수 있습니다.

| 설치 전 (인스타그램 PC 웹) | 설치 후 |
|---|---|
| 메시지 텍스트만 보이고 버튼 없음 | 메시지 아래에 버튼 표시, 클릭하면 전송 |

## 이런 분께 필요해요

- 인플루언서 게시물에 댓글을 달고 자동 DM을 받았는데, PC에서 "버튼을 눌러 주세요" 버튼이 안 보이는 분
- 인스타그램 DM 버튼, 빠른 답장(Quick Reply), 링크 버튼이 데스크톱에서 안 눌리는 분
- 체험단, 이벤트, 쿠폰, 자료 링크를 받으려고 매번 휴대폰을 꺼내기 번거로운 분

## 기능

- **postback 버튼 표시와 전송**: "메시지 보내주세요!", "팔로우 했어요" 같은 버튼을 메시지 아래에 보여 주고, 누르면 모바일 앱에서 누른 것처럼 전송합니다.
- **링크 버튼 열기**: 링크형 버튼은 새 탭에서 엽니다.
- **모든 대화방 자동 적용**: DM 목록에서 대화방을 옮겨 다녀도 버튼이 있는 메시지에 자동으로 붙습니다.
- **설정 없음, 외부 서버 없음**: 인스타그램 페이지 안에서만 동작하고 어떤 데이터도 밖으로 보내지 않습니다.

## 설치 방법

1. 이 페이지 위쪽 초록색 **Code** 버튼을 누르고 **Download ZIP**을 선택합니다.
2. 내려받은 zip 파일의 압축을 풉니다.
3. 크롬 주소창에 `chrome://extensions`를 입력하고, 오른쪽 위 **개발자 모드**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 누르고 압축을 푼 폴더(`manifest.json`이 들어 있는 폴더)를 선택합니다.
5. [인스타그램 DM](https://www.instagram.com/direct/inbox/)을 새로고침합니다.

크롬 외에 엣지(Edge), 웨일(Whale) 등 크로미움 기반 브라우저에서도 같은 방법으로 설치할 수 있습니다.

## 왜 PC에서는 버튼이 안 보이나요?

Meta 공식 문서에 따르면 인스타그램 메시징의 [버튼 템플릿](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/button-template), [제네릭 템플릿](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/generic-template), [빠른 답장](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/quick-replies)은 웹 버전을 지원하지 않습니다. 그런데 실제로는 인스타그램 웹도 버튼 정보(`cta_buttons`)를 받아 두고 있고, postback 전송 기능도 웹 코드 안에 들어 있습니다. 화면에 그리지만 않을 뿐입니다.

이 확장 프로그램은 페이지에 이미 들어와 있는 버튼 정보를 읽어 버튼을 만들고, 누르면 인스타그램 웹에 들어 있는 postback 전송 기능(`IGDGenericTemplatePostbackCTAButtonOffMsysMutation`)을 그대로 호출합니다.

## 주의 사항

- 인스타그램의 비공개 내부 기능을 사용합니다. 인스타그램이 웹 코드를 바꾸면 작동하지 않을 수 있습니다.
- 전송에 실패하면 버튼에 "실패"가 표시됩니다. 이때는 휴대폰 앱에서 버튼을 눌러 주세요.
- 버튼을 누르면 버튼 문구가 상대 계정에 메시지로 전송됩니다.
- 개인 사용 목적으로 만들었습니다. 인스타그램 이용약관 준수와 사용에 따른 책임은 사용자에게 있습니다. Meta 및 Instagram과 관련이 없습니다.

## 문제가 생기면

[Issues](../../issues)에 증상과 함께 남겨 주세요. 크롬 개발자 도구(F12) 콘솔에 `[DM CTA]`로 시작하는 오류가 있으면 같이 적어 주시면 도움이 됩니다.


키워드: 인스타 DM 버튼 안보임, 인스타그램 PC 버튼, 인스타그램 웹 DM 버튼, 자동 DM 버튼, 댓글 DM 버튼, 매니챗, 체험단 DM, instagram dm button not showing desktop
