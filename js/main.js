import { initUI } from "/js/ui.js";

function startIntro() {
  const transition = document.querySelector("[data-transition]");
  const shutters = transition ? Array.from(transition.querySelectorAll(".shutter")) : [];
  const welcomeMessage = document.getElementById("welcomeMessage");

  setTimeout(() => {
    if (welcomeMessage) {
      welcomeMessage.classList.add("is-hidden");
    }
  }, 4000);

  setTimeout(() => {
    shutters.forEach((shutter, i) => {
      setTimeout(() => {
        shutter.style.transform = "translateY(-100%)";
      }, i * 250);
    });
  }, 4100);

  setTimeout(() => {
    if (transition) {
      transition.remove();
    }
  }, 7000);
}

window.addEventListener("load", async () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      const ui = await initUI();
      startIntro();

      if (ui && typeof ui.start === "function") {
        ui.start();
      }
    });
  });
});

function updateCountdown() {
  const weddingDate = new Date("2027-08-21T00:00:00").getTime();
  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) return;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((diff / 1000 / 60) % 60);
  secondsEl.textContent = Math.floor((diff / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);
// ------------------------------------------------------------
// QUIZ
// Texte, Antwortmöglichkeiten und richtige Antworten können hier
// später einfach geändert werden. "correct" ist der Index der
// richtigen Antwort: 0 = erste, 1 = zweite, 2 = dritte Antwort.
// ------------------------------------------------------------
const quizQuestions = [
  {
    question: "Welcher Artist ist bei Stine und Luis jeweils in den Spotify-All-Time-Top-5?",
    answers: ["Ikkimel", "Twentyone Pilots", "Bad Bunny"],
    correct: 1,
  },
  {
    question: "Wann feiern Stine und Luis Jahrestag?",
    answers: ["25.07. - Am offiziellen Jakobstag", "16.08. - Madonnas Geburtstag", "21.08. - im Jahr 1876: Die Wiener Reichsbrücke wird unter dem Namen Kronprinz-Rudolf-Brücke eingeweiht."],
    correct: 0,
  },
  {
    question: "An welchem Wochentag wurden Stine und Luis geboren?",
    answers: ["Dienstag & Donnerstag", "Beide am Wochenende", "Woher soll ich das denn wissen?"],
    correct: 0,
  },
  {
    question: "Wo war unser erster gemeinsamer Urlaub?",
    answers: ["Teneriffa - auf der Heimatinsel vom Onkel Can", "Vietnam", "Camping Platz Klausdorf auf Fehmarn"],
    correct: 0,
  },
  {
    question: "Welches Lied verbindet uns am meisten?",
    answers: ["Jedes Lied vom Trancefloor auf der Fusion", "Kippe von Ennio", "All of Me von John Legend"],
    correct: 1,
  },
  {
    question: "Wo fand der Antrag statt?",
    answers: ["Im Ski Urlaub in der Gondel", "Im Lieblingsrestaurant mit Ring im Sektglas", "Weinberg Kahlenberg bei 36 Grad"],
    correct: 2,
  },
  {
    question: "Wo haben wir uns kennengelernt?",
    answers: ["Bei den Bundesjugendspielen", "Bei Ihrem Reifenhersteller des Vertrauen: Continental", "Beim Konfirmandenunterricht"],
    correct: 1,
  },
  {
    question: "Was haben Stine und Luis im Bachelor studiert?",
    answers: ["Medizin - wir sind ja jetzt in der Facharztausbildung", "Weinbau, Önologie und Weinwirtschaft", "BWL - der Nischenstudiengang für die, die sich nicht entscheiden können"],
    correct: 2,
  },
  {
    question: "Welche Musikrichtung hören Stine und Luis am liebsten?",
    answers: ["Utz utz utz", "Lalalala", "Klingelingeling"],
    correct: 0,
  },
];

const quizResults = {
  high: {
    title: "Ihr kennt uns ziemlich gut.",
    text: "Ein super Ergebnis – damit seid ihr bestens für die Hochzeit vorbereitet.",
  },
  middle: {
    title: "Gar nicht schlecht.",
    text: "Ein paar Details über uns gibt es offenbar noch zu lernen. Das ist doch das perfekte Thema, um mit anderen Gästen auf der Hochzeit ins Gespräch zu kommen...",
  },
  low: {
    title: "Das könnt ihr besser!",
    text: "0 oder 1 richtige Antwort – bis zur Hochzeit ist aber natürlich noch genug Zeit, um die Details nachzuholen.",
  },
};

function initQuiz() {
  const quiz = document.querySelector("[data-quiz]");
  if (!quiz) return;

  const counter = quiz.querySelector("[data-quiz-counter]");
  const scoreLabel = quiz.querySelector("[data-quiz-score-label]");
  const progress = quiz.querySelector("[data-quiz-progress]");
  const questionScreen = quiz.querySelector("[data-quiz-question-screen]");
  const questionEl = quiz.querySelector("[data-quiz-question]");
  const answersEl = quiz.querySelector("[data-quiz-answers]");
  const result = quiz.querySelector("[data-quiz-result]");
  const resultScore = quiz.querySelector("[data-quiz-result-score]");
  const resultTitle = quiz.querySelector("[data-quiz-result-title]");
  const resultText = quiz.querySelector("[data-quiz-result-text]");
  const restart = quiz.querySelector("[data-quiz-restart]");

  let currentQuestion = 0;
  let score = 0;

  function renderQuestion() {
    const item = quizQuestions[currentQuestion];
    counter.textContent = `Frage ${currentQuestion + 1} von ${quizQuestions.length}`;
    scoreLabel.textContent = "";
    progress.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    questionEl.textContent = item.question;
    answersEl.innerHTML = "";

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz__answer";
      button.textContent = answer;
      button.addEventListener("click", () => selectAnswer(index));
      answersEl.appendChild(button);
    });
  }

  function selectAnswer(index) {
    if (index === quizQuestions[currentQuestion].correct) score += 1;

    currentQuestion += 1;
    if (currentQuestion < quizQuestions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    questionScreen.hidden = true;
    result.hidden = false;
    counter.textContent = "Geschafft";
    scoreLabel.textContent = "";
    progress.style.width = "100%";

    let copy = quizResults.middle;
    if (score >= 7) copy = quizResults.high;
    if (score <= 1) copy = quizResults.low;

    resultScore.textContent = `${score} von ${quizQuestions.length} richtig`;
    resultTitle.textContent = copy.title;
    resultText.textContent = copy.text;
  }

  function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    result.hidden = true;
    questionScreen.hidden = false;
    renderQuestion();
  }

  restart.addEventListener("click", resetQuiz);
  renderQuestion();
}

initQuiz();


window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});