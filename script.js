// 🔧 あなたのGASのデプロイURLに差し替えてください
const GAS_ENDPOINT = ';https://script.google.com/macros/s/AKfycbynlLoWDmKmJctOKq_VPfmcPA83WRBqhR92lwvjiDPGyuuYlpDfNyjMa8cgmRNWCnrx/exec'

let questions = [];
let currentQuestionIndex = 0;
let userId = '';

// ページ読み込み時に質問を取得
window.addEventListener('DOMContentLoaded', async () => {
  questions = await fetchQuestions();
  showQuestion();
});

// GASから質問データを取得
async function fetchQuestions() {
  try {
    const response = await fetch(`${GAS_ENDPOINT}?action=getQuestions`);
    const data = await response.json();
    return data.questions || data;
  } catch (error) {
    console.error("質問取得エラー:", error);
    return [];
  }
}

// 質問を表示
function showQuestion() {
  const container = document.getElementById("question-container");
  container.innerHTML = "";

  if (currentQuestionIndex === 0) {
    container.innerHTML = `
      <p>まずはお名前を入力してください：</p>
      <input type="text" id="username-input" placeholder="お名前を入力" />
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
      <p>診断が完了しました！</p>
      <button onclick="goToResult()">結果を見る</button>
    `;
  }
}

function submitName() {
  const input = document.getElementById("username-input");
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
  try {
    const res = await fetch(GAS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submitAnswer",
        userId: userId,
        questionIndex: currentQuestionIndex - 1,
        answer: answer,
      }),
    });

    const result = await res.json();
    if (!result.success) {
      alert("送信エラー。もう一度試してください。");
      return;
    }

    currentQuestionIndex++;
    showQuestion();
  } catch (error) {
    alert("送信エラーが発生しました");
    console.error(error);
  }
}

function goToResult() {
  window.location.href = 'result.html?user=' + encodeURIComponent(userId);
}
