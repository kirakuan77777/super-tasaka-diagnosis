
// あなたのGAS WebアプリURLに置き換えてください（末尾 /exec を含む）
const GAS_ENDPOINT = 'https://script.google.com/macros/s/【ここにGASのURL】/exec';

let questions = [];
let currentQuestionIndex = 0;
let userId = '';

window.addEventListener('DOMContentLoaded', async () => {
  questions = await fetchQuestions();
  showQuestion();
});

async function fetchQuestions() {
  try {
    const response = await fetch(`${GAS_ENDPOINT}?action=getQuestions`);
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('質問の取得に失敗:', error);
    return [];
  }
}

async function submitAnswer(userId, questionIndex, answer) {
  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submitAnswer',
        userId: userId,
        questionIndex: questionIndex,
        answer: answer
      })
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('回答の送信に失敗:', error);
    return false;
  }
}

function showQuestion() {
  const container = document.getElementById('question-container');
  container.innerHTML = '';

  if (currentQuestionIndex === 0) {
    container.innerHTML = `
      <p>ようこそ！まずはお名前を入力してください：</p>
      <input type="text" id="username-input" placeholder="例：タサカ太郎" />
      <button onclick="submitName()">次へ</button>
    `;
  } else if (currentQuestionIndex <= questions.length) {
    const q = questions[currentQuestionIndex - 1];
    container.innerHTML = `
      <p>【第${currentQuestionIndex}問】 ${q}</p>
      <button onclick="answerQuestion('A')">A</button>
      <button onclick="answerQuestion('B')">B</button>
      <button onclick="answerQuestion('C')">C</button>
    `;
  } else {
    container.innerHTML = `
      <p>診断完了！結果を確認中...</p>
      <button onclick="goToResult()">結果を見る</button>
    `;
  }
}

function submitName() {
  const input = document.getElementById('username-input');
  const name = input.value.trim();
  if (!name) {
    alert("名前を入力してください！");
    return;
  }
  userId = name;
  currentQuestionIndex++;
  showQuestion();
}

async function answerQuestion(answer) {
  const success = await submitAnswer(userId, currentQuestionIndex - 1, answer);
  if (!success) {
    alert("送信に失敗しました。もう一度試してください。");
    return;
  }
  currentQuestionIndex++;
  showQuestion();
}

function goToResult() {
  window.location.href = 'result.html?user=' + encodeURIComponent(userId);
}
