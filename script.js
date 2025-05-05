// 🔧 あなたのGASのデプロイURLに差し替えてください
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbynlLoWDmKmJctOKq_VPfmcPA83WRBqhR92lwvjiDPGyuuYlpDfNyjMa8cgmRNWCnrx/exec'

let questions = [];
let currentQuestionIndex = 0;
let userId = '';

// ページ読み込み時の処理
window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', startDiagnosis);
});

// 診断開始処理
async function startDiagnosis() {
  const input = document.getElementById('username-input');
  const name = input.value.trim();
  
  if (!name) {
    alert('お名前を入力してください！');
    return;
  }

  userId = name;
  document.getElementById('input-area').style.display = 'none';
  
  try {
    questions = await fetchQuestions();
    if (questions.length === 0) {
      alert('質問の取得に失敗しました。ページを更新してください。');
      return;
    }
    showQuestion();
  } catch (error) {
    console.error('質問取得エラー:', error);
    alert('質問の取得に失敗しました。ページを更新してください。');
  }
}

// GASから質問データを取得
async function fetchQuestions() {
  try {
    const response = await fetch(`${GAS_ENDPOINT}?action=getQuestions`, {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('質問取得エラー:', error);
    return [];
  }
}

// 質問を表示
function showQuestion() {
  const container = document.getElementById('question-container');
  
  if (currentQuestionIndex < questions.length) {
    const q = questions[currentQuestionIndex];
    container.innerHTML = `
      <p class="question-number">【第${currentQuestionIndex + 1}問】</p>
      <p class="question-text">${q}</p>
      <div class="choices">
        <button onclick="answerQuestion('A')">はい</button>
        <button onclick="answerQuestion('B')">いいえ</button>
        <button onclick="answerQuestion('C')">どちらでもない</button>
      </div>
      <p class="progress">${currentQuestionIndex + 1} / ${questions.length} 問</p>
    `;
  } else {
    container.innerHTML = `
      <p>診断が完了しました！</p>
      <p>スコアを計算中です...</p>
      <button onclick="goToResult()">結果を見る</button>
    `;
  }
}

// 回答を送信
async function answerQuestion(answer) {
  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submitAnswer',
        userId: userId,
        questionIndex: currentQuestionIndex,
        answer: answer
      })
    });

    const result = await response.json();
    if (!result.success) {
      alert('回答の送信に失敗しました。もう一度試してください。');
      return;
    }

    currentQuestionIndex++;
    showQuestion();
  } catch (error) {
    console.error('回答送信エラー:', error);
    alert('回答の送信に失敗しました。もう一度試してください。');
  }
}

// 結果画面へ遷移
function goToResult() {
  window.location.href = `result.html?user=${encodeURIComponent(userId)}`;
}
