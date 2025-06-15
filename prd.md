

## ✅ 1. Project Overview

**목적:**
오프라인 행사장에서 참가자가 본인의 정보를 입력하고 포인트를 신청할 수 있는 단일 웹페이지를 제공합니다.

**대상 사용자:**
행사 참가자 (슈퍼로이어 회원)

**주요 특징:**

* 좌측에 행사 관련 동영상 또는 이미지 표시
* 우측에는 입력 폼: 이름, 이메일(슈퍼로이어 ID), 핸드폰 번호
* 입력값은 Google Sheet에 자동으로 저장

---

## ✅ 2. Core Functionalities

1. **반응형 단일 페이지 레이아웃**

   * 왼쪽: 행사 관련 이미지나 영상 (화면 너비 기준 60%)
   * 오른쪽: 폼 입력 영역 (40%)

2. **입력 폼 필드**

   * 이름 (텍스트)
   * 슈퍼로이어 ID (이메일, 형식 체크 포함)
   * 핸드폰 번호 (숫자만 입력)

3. **제출 기능**

   * 제출 시 Google Sheets API 또는 Google Forms를 통해 데이터 전송
   * 성공 메시지 간단하게 표시

---

## ✅ 3. Doc (사용 설명 및 비고)

* Google Sheets 연동은 **Google Forms** 백엔드 기능을 활용하면 코드가 간단합니다. (폼을 연동한 Google Form URL로 `POST` 요청을 보내는 방식)
* 참가자 수가 많은 경우 Google Sheets는 초기에 충분하며, 추후 백엔드 서버 도입 가능

---

## ✅ 4. File Structure

```plaintext
project-root/
│
├── index.html          # 단일 웹페이지
├── style.css           # 순수 CSS 스타일
└── script.js           # 폼 제출 처리 로직
```

---

## ✅ 5. Additional Requirements

* 기본적인 입력값 유효성 검사 (빈칸 또는 이메일 형식 체크)
* 모바일 환경에서도 적절하게 보여지는 레이아웃 유지
* 디자인은 심플하게 (폰트, 여백만 조정)

---

## 🔧 참고용 코드 스켈레톤

### `index.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>포인트 신청</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <div class="media">
      <!-- 이미지 또는 영상 -->
      <img src="event.jpg" alt="행사 이미지" />
    </div>
    <div class="form-container">
      <form id="pointForm">
        <h2>포인트 신청</h2>
        <input type="text" name="name" placeholder="이름" required />
        <input type="email" name="email" placeholder="슈퍼로이어 ID (이메일)" required />
        <input type="tel" name="phone" placeholder="핸드폰 번호" required />
        <button type="submit">신청하기</button>
      </form>
      <p id="msg"></p>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

### `style.css`

```css
body {
  margin: 0;
  font-family: sans-serif;
}

.container {
  display: flex;
  min-height: 100vh;
}

.media {
  flex: 6;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.media img {
  width: 90%;
  max-width: 500px;
  height: auto;
}

.form-container {
  flex: 4;
  padding: 40px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
}

input, button {
  margin: 10px 0;
  padding: 12px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
```

### `script.js` (Google Forms에 연동 예시)

```javascript
document.getElementById('pointForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  // Google Form URL (응답 제출 URL로 교체)
  const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/your-form-id/formResponse';

  fetch(GOOGLE_FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({
      'entry.1234567890': data.get('name'),
      'entry.2345678901': data.get('email'),
      'entry.3456789012': data.get('phone'),
    })
  });

  document.getElementById('msg').textContent = '신청이 완료되었습니다!';
  form.reset();
});
```

> ✅ Google Form을 생성한 뒤, 각 항목의 `entry.XXXXXXXX` 값을 구해서 위에 맞게 넣어주세요.