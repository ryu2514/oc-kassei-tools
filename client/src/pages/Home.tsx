/**
 * Design: 余白のノート — Japanese editorial wellness. Evergreen Ink, paper texture,
 * generous left-aligned whitespace, notebook rules, and gentle motion for self-reflection.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Leaf,
  LockKeyhole,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type Answer = "A" | "B" | "C";

type Question = {
  prompt: string;
  options: { code: Answer; label: string }[];
};

type DiagnosisResult = {
  name: string;
  eyebrow: string;
  description: string;
  nextStep: string;
  accent: string;
};

const questions: Question[] = [
  {
    prompt: "独立や副業について、今どのくらい情報を集めていますか。",
    options: [
      { code: "A", label: "まだあまり調べていない" },
      { code: "B", label: "ネットで情報を集め始めている" },
      { code: "C", label: "すでに人に会って話を聞いている" },
    ],
  },
  {
    prompt: "新しいことを始めるとき、あなたはどちらに近いですか。",
    options: [
      { code: "A", label: "まず情報を集めてから動く" },
      { code: "B", label: "ある程度分かったら動いてみる" },
      { code: "C", label: "とりあえず動きながら考える" },
    ],
  },
  {
    prompt: "今の収入について感じることは。",
    options: [
      { code: "A", label: "たまに気になる程度" },
      { code: "B", label: "定期的に不安になる" },
      { code: "C", label: "かなり具体的に将来を心配している" },
    ],
  },
  {
    prompt: "独立や副業について、周りに話したことはありますか。",
    options: [
      { code: "A", label: "まだ誰にも話していない" },
      { code: "B", label: "家族や近しい人には話した" },
      { code: "C", label: "実際に動いている人に相談したことがある" },
    ],
  },
  {
    prompt: "失敗したときのことを考えると。",
    options: [
      { code: "A", label: "かなり怖くて動けない" },
      { code: "B", label: "怖いけど許容できる範囲を考えている" },
      { code: "C", label: "失敗も経験のうちだと思っている" },
    ],
  },
  {
    prompt: "今の職場や働き方について。",
    options: [
      { code: "A", label: "特に大きな不満はない" },
      { code: "B", label: "このままでいいのか漠然とした不安がある" },
      { code: "C", label: "具体的に変えたいと思っている" },
    ],
  },
];

const diagnosisResults: Record<Answer, DiagnosisResult> = {
  A: {
    name: "情報収集タイプ",
    eyebrow: "FOUNDATION PHASE",
    description:
      "今は、とにかく情報を集めている段階です。遅れているのではなく、安心して動くための土台をつくっている時期といえます。",
    nextStep: "気になる人の話を、一人だけ聞いてみる。",
    accent: "アイデアをノートにためる時期",
  },
  B: {
    name: "慎重派",
    eyebrow: "STEADY PHASE",
    description:
      "情報はある程度集まっていて、確認しながら進めたいタイプです。慎重に考えられることは、そのまま強みになります。",
    nextStep: "小さく試せることを一つ、期限を決めずに始める。",
    accent: "確かめながら前へ進む時期",
  },
  C: {
    name: "行動派",
    eyebrow: "ACTION PHASE",
    description:
      "すでに動き出しているか、動く準備が整っているタイプです。いまは、具体的な相談や壁打ちの相手を見つけるタイミングです。",
    nextStep: "相談できる相手と、次の一手を言葉にする。",
    accent: "経験を次の形にする時期",
  },
};

const formatYen = (value: number) => `${Math.max(0, Math.round(value)).toLocaleString("ja-JP")} 円`;

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [diagnosisDone, setDiagnosisDone] = useState(false);
  const [salary, setSalary] = useState("300000");
  const [sales, setSales] = useState("450000");
  const [expenseRate, setExpenseRate] = useState(30);
  const [simulationDone, setSimulationDone] = useState(false);

  const selectedAnswer = answers[currentQuestion];
  const selectedResult = useMemo(() => {
    if (!diagnosisDone || answers.length !== questions.length) return null;
    const counts = { A: 0, B: 0, C: 0 };
    answers.forEach((answer) => {
      counts[answer] += 1;
    });
    const type = (["A", "B", "C"] as Answer[]).reduce(
      (winner, candidate) => (counts[candidate] > counts[winner] ? candidate : winner),
      "A",
    );
    return diagnosisResults[type];
  }, [answers, diagnosisDone]);

  const simulation = useMemo(() => {
    const salaryValue = Number(salary.replace(/,/g, "")) || 0;
    const salesValue = Number(sales.replace(/,/g, "")) || 0;
    const takeHomeFromSalary = salaryValue * 0.78;
    const businessIncome = salesValue * (1 - expenseRate / 100);
    const takeHomeFromBusiness = businessIncome * 0.75 - 45000;
    return {
      salary: takeHomeFromSalary,
      income: businessIncome,
      business: takeHomeFromBusiness,
      difference: takeHomeFromBusiness - takeHomeFromSalary,
    };
  }, [salary, sales, expenseRate]);

  const selectAnswer = (answer: Answer) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = answer;
    setAnswers(nextAnswers);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;
    if (currentQuestion === questions.length - 1) {
      setDiagnosisDone(true);
      window.setTimeout(() => document.getElementById("diagnosis-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
      return;
    }
    setCurrentQuestion((current) => current + 1);
  };

  const resetDiagnosis = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosisDone(false);
  };

  const copyDiagnosis = async () => {
    if (!selectedResult) return;
    const text = `開業タイプ診断の結果は「${selectedResult.name}」でした。\n次の一歩：${selectedResult.nextStep}\n#セラピストビジネス広場`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("結果をコピーしました", { description: "オープンチャットに貼り付けてシェアできます。" });
    } catch {
      toast.message("結果カードをスクリーンショットしてシェアしてください。");
    }
  };

  const runSimulation = () => {
    setSimulationDone(true);
    window.setTimeout(() => document.getElementById("simulation-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f3eb] text-[#173a32]">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="セラピストビジネス広場 ホーム">
          <span className="brand-mark" aria-hidden="true"><Leaf size={22} /></span>
          <span>
            <strong>セラピストビジネス広場</strong>
            <small>CAREER NOTEBOOK</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="ページ内ナビゲーション">
          <a href="#diagnosis">タイプ診断</a>
          <a href="#simulator">手取り比較</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><Leaf size={15} strokeWidth={2.2} /> SELF-REFLECTION TOOLS</p>
            <h1 id="hero-title">働き方の「次の一歩」を、<br />言葉と数字で整理する。</h1>
            <p className="hero-lead">独立・副業を考えるセラピストのための、小さなワークスペースです。診断と試算は、すべてこの画面の中だけで完結します。</p>
            <div className="hero-actions">
              <a className="primary-link" href="#diagnosis">まずタイプを知る <ArrowDownRight size={18} /></a>
              <span className="privacy-note"><LockKeyhole size={15} /> 入力内容は保存しません</span>
            </div>
          </div>
          <figure className="hero-visual">
            <div className="hero-visual-placeholder" role="img" aria-label="ノートとペンをイメージした、やわらかな光のワークスペース">
              <BookOpen size={72} strokeWidth={1.2} />
              <span>CAREER NOTEBOOK</span>
            </div>
            <figcaption><span>01</span> MAKE SPACE FOR YOUR NEXT STEP</figcaption>
          </figure>
        </section>

        <section className="tool-intro" aria-label="利用できるツール">
          <p>CHOOSE A TOOL</p>
          <div className="intro-tool-list">
            <a href="#diagnosis"><span>01</span><strong>開業タイプ診断</strong><small>6つの問いで、いまのフェーズを整理する。</small><ChevronRight size={18} /></a>
            <a href="#simulator"><span>02</span><strong>勤務 vs 事業<br />手取り比較</strong><small>月収と月商を、手取り目安で見てみる。</small><ChevronRight size={18} /></a>
          </div>
        </section>

        <section id="diagnosis" className="notebook-section diagnosis-section" aria-labelledby="diagnosis-title">
          <div className="section-heading">
            <div className="section-number">01</div>
            <div>
              <p className="eyebrow">CAREER PHASE CHECK</p>
              <h2 id="diagnosis-title">開業タイプ診断</h2>
              <p>6つの問いに答えると、いまの自分がどのフェーズにいるかを整理できます。</p>
            </div>
          </div>

          {!diagnosisDone ? (
            <div className="diagnosis-workspace">
              <div className="question-rail" aria-label={`全${questions.length}問中 ${currentQuestion + 1}問目`}>
                <span>QUESTION</span>
                <strong>0{currentQuestion + 1}<i>/0{questions.length}</i></strong>
                <div className="question-dots">
                  {questions.map((_, index) => <span className={index <= currentQuestion ? "is-active" : ""} key={index} />)}
                </div>
              </div>
              <div className="question-panel">
                <p className="question-index">Q. {currentQuestion + 1}</p>
                <h3>{questions[currentQuestion].prompt}</h3>
                <div className="answer-list" role="radiogroup" aria-label={questions[currentQuestion].prompt}>
                  {questions[currentQuestion].options.map((option) => (
                    <button
                      className={`answer-button ${selectedAnswer === option.code ? "is-selected" : ""}`}
                      key={option.code}
                      type="button"
                      role="radio"
                      aria-checked={selectedAnswer === option.code}
                      onClick={() => selectAnswer(option.code)}
                    >
                      <span className="answer-letter">{option.code}</span>
                      <span>{option.label}</span>
                      {selectedAnswer === option.code && <Check size={18} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
                <div className="question-actions">
                  <button className="text-button" type="button" onClick={() => setCurrentQuestion((current) => Math.max(0, current - 1))} disabled={currentQuestion === 0}>
                    <ArrowLeft size={16} /> 前の問いへ
                  </button>
                  <button className="solid-button" type="button" onClick={nextQuestion} disabled={!selectedAnswer}>
                    {currentQuestion === questions.length - 1 ? "診断結果を見る" : "次の問いへ"} <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div id="diagnosis-result" className="result-card diagnosis-result-card">
              <div className="result-card-topline"><Sparkles size={18} /> YOUR CURRENT PHASE</div>
              <p className="result-eyebrow">{selectedResult?.eyebrow}</p>
              <h3>{selectedResult?.name}</h3>
              <p className="result-accent">{selectedResult?.accent}</p>
              <p className="result-description">{selectedResult?.description}</p>
              <div className="next-step"><span>次の一歩</span><strong>{selectedResult?.nextStep}</strong></div>
              <div className="result-card-actions">
                <button className="solid-button" type="button" onClick={copyDiagnosis}><Copy size={17} /> 結果をコピーする</button>
                <button className="text-button" type="button" onClick={resetDiagnosis}><RefreshCw size={16} /> もう一度診断する</button>
              </div>
              <p className="share-caption"><Clipboard size={15} /> 結果をコピーして、オープンチャットでシェアしてみましょう。</p>
            </div>
          )}
        </section>

        <section id="simulator" className="notebook-section simulator-section" aria-labelledby="simulator-title">
          <div className="section-heading">
            <div className="section-number">02</div>
            <div>
              <p className="eyebrow">INCOME PERSPECTIVE</p>
              <h2 id="simulator-title">勤務 vs 事業、手取り比較</h2>
              <p>額面ではなく、毎月の手取り目安で働き方を見比べてみましょう。</p>
            </div>
          </div>

          <div className="simulator-layout">
            <form className="sim-inputs" onSubmit={(event) => { event.preventDefault(); runSimulation(); }}>
              <div className="input-label"><span>INPUTS</span><LockKeyhole size={15} /> ブラウザ内だけで計算します</div>
              <label>
                <span>現在の勤務月収 <em>額面</em></span>
                <div className="currency-input"><input inputMode="numeric" type="text" value={salary} onChange={(event) => setSalary(event.target.value.replace(/[^0-9]/g, ""))} aria-label="現在の勤務月収（額面）" /><i>円</i></div>
              </label>
              <label>
                <span>想定する事業の月商 <em>売上</em></span>
                <div className="currency-input"><input inputMode="numeric" type="text" value={sales} onChange={(event) => setSales(event.target.value.replace(/[^0-9]/g, ""))} aria-label="想定する事業の月商（売上）" /><i>円</i></div>
              </label>
              <label className="slider-label">
                <span>経費率 <b>{expenseRate}%</b></span>
                <input type="range" min="10" max="50" step="1" value={expenseRate} onChange={(event) => setExpenseRate(Number(event.target.value))} aria-label="経費率" />
                <small><span>10%</span><span>目安 30%</span><span>50%</span></small>
              </label>
              <button className="solid-button simulation-submit" type="submit"><BarChart3 size={18} /> 手取り目安を比べる</button>
            </form>

            <div id="simulation-result" className={`simulation-result ${simulationDone ? "is-visible" : ""}`} aria-live="polite">
              {simulationDone ? (
                <>
                  <div className="comparison-heading"><span>ESTIMATED TAKE-HOME</span><strong>月ごとの手取り目安</strong></div>
                  <div className="take-home-row salary-row">
                    <div><span>勤務の場合</span><small>月収 × 78%</small></div>
                    <strong>{formatYen(simulation.salary)}</strong>
                  </div>
                  <div className="take-home-row business-row">
                    <div><span>事業の場合</span><small>所得 {formatYen(simulation.income)} を基準</small></div>
                    <strong>{formatYen(simulation.business)}</strong>
                  </div>
                  <div className={`difference-card ${simulation.difference >= 0 ? "is-positive" : "is-negative"}`}>
                    <span>{simulation.difference >= 0 ? "事業の方が多い目安" : "勤務の方が多い目安"}</span>
                    <strong>{formatYen(Math.abs(simulation.difference))}</strong>
                  </div>
                  <p className="share-caption"><Clipboard size={15} /> 数字が意外だったら、オープンチャットで話してみましょう。</p>
                </>
              ) : (
                <div className="simulation-placeholder"><BookOpen size={30} /><p>左の数字を入力して、<br />手取りの目安を見比べましょう。</p></div>
              )}
            </div>
          </div>
          <aside className="disclaimer" role="note">
            <strong>計算について</strong>
            <p>勤務の手取りは「月収 × 0.78」、事業は「月商 ×（1 − 経費率）× 0.75 − 45,000円」で試算しています。税金・社会保険料・国民健康保険料は所得、居住地、扶養や控除等によって変わります。これは概算であり、重要な判断や申告の際は税理士・自治体窓口・国税庁等で確認してください。</p>
          </aside>
        </section>

        <section className="closing-section">
          <div><p className="eyebrow">A SMALL STEP, TOGETHER</p><h2>考えたことを、<br />誰かと話してみる。</h2></div>
          <p>タイプ診断でも、手取り比較でも。気づいたことがあれば、オープンチャットで気軽にシェアしてください。言葉にすることで、次の一歩が少し具体的になります。</p>
        </section>
      </main>

      <footer className="site-footer">
        <p><span>THERAPIST BUSINESS PLAZA</span> 自分らしい働き方を考えるためのツール</p>
        <p>入力内容は保存・送信されません。</p>
      </footer>
    </div>
  );
}
