/**
 * Design: 余白のノート — Japanese editorial wellness. Evergreen Ink, paper texture,
 * generous left-aligned whitespace, notebook rules, and gentle motion for self-reflection.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
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

type IndependenceBenefit = {
  title: string;
  description: string;
  nextStep: string;
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

const independenceBenefits: IndependenceBenefit[] = [
  {
    title: "誰と働くかを選びやすくなる",
    description: "組織に決められた人間関係だけでなく、お客さまや仲間、協業相手を自分の価値観に合わせて選びやすくなります。",
    nextStep: "一緒に仕事をしたい人や、届けたい相手を一人思い浮かべる。",
  },
  {
    title: "提供した価値が売上に反映されやすい",
    description: "喜ばれたサービスを磨き、価格や届け方を工夫することで、自分の貢献を事業の成長につなげやすくなります。",
    nextStep: "これまで一番喜ばれた支援を、一つ言葉にしてみる。",
  },
  {
    title: "得意分野をそのまま仕事にできる",
    description: "自分が深めてきた専門性や経験を軸に、必要としている人へ独自のサービスとして届けられます。",
    nextStep: "人からよく相談されることを、三つ書き出してみる。",
  },
  {
    title: "働く時間や場所を設計できる",
    description: "予約枠、休日、オンライン対応などを自分で組み立て、生活に合った働き方をつくりやすくなります。",
    nextStep: "理想の一週間を、勤務時間に縛られず描いてみる。",
  },
  {
    title: "自分の名前で信頼を積み上げられる",
    description: "発信やサービスの実績が自分自身の資産として残り、次の仕事や新しい出会いにつながっていきます。",
    nextStep: "伝えられそうな知識や経験を、一つ発信してみる。",
  },
  {
    title: "収入の可能性を自分で広げられる",
    description: "サービス設計や価格、提供方法を自分で決められるため、給与体系に限定されない収入の形を育てられます。",
    nextStep: "小さく提供できるサービスと価格を、仮で一つ決めてみる。",
  },
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [diagnosisDone, setDiagnosisDone] = useState(false);
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState<number | null>(null);

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

  const selectedBenefit = selectedBenefitIndex === null ? null : independenceBenefits[selectedBenefitIndex];

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

  const selectBenefit = (index: number) => {
    setSelectedBenefitIndex(index);
    window.setTimeout(() => document.getElementById("possibility-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  };

  const copyBenefit = async () => {
    if (!selectedBenefit) return;
    const text = `独立で一番魅力に感じることは「${selectedBenefit.title}」です。\n最初の一歩：${selectedBenefit.nextStep}\n#セラピストビジネス広場`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("結果をコピーしました", { description: "オープンチャットに貼り付けてシェアできます。" });
    } catch {
      toast.message("結果カードをスクリーンショットしてシェアしてください。");
    }
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
          <a href="#possibilities">独立の可能性</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><Leaf size={15} strokeWidth={2.2} /> SELF-REFLECTION TOOLS</p>
            <h1 id="hero-title">働き方の「次の一歩」を、<br />自分らしく描いてみる。</h1>
            <p className="hero-lead">独立・副業を考えるセラピストのための、小さなワークスペースです。いまの自分を知り、独立で広がる可能性を見つけてみましょう。</p>
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
            <a href="#possibilities"><span>02</span><strong>独立で広がる<br />働き方の可能性</strong><small>一番魅力に感じる変化を見つける。</small><ChevronRight size={18} /></a>
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

        <section id="possibilities" className="notebook-section possibility-section" aria-labelledby="possibilities-title">
          <div className="section-heading">
            <div className="section-number">02</div>
            <div>
              <p className="eyebrow">DESIGN YOUR OWN WORK</p>
              <h2 id="possibilities-title">独立すると、働き方はどう変わる？</h2>
              <p>収入だけではない、独立によって広がる働き方の可能性を見てみましょう。</p>
            </div>
          </div>

          <div className="possibility-intro">
            <Sparkles size={20} aria-hidden="true" />
            <p>独立の魅力は、収入だけではありません。あなたが一番魅力に感じる変化を、一つ選んでみてください。</p>
          </div>

          <div className="possibility-grid" role="radiogroup" aria-label="独立で一番魅力に感じること">
            {independenceBenefits.map((benefit, index) => (
              <button
                className={`possibility-card ${selectedBenefitIndex === index ? "is-selected" : ""}`}
                key={benefit.title}
                type="button"
                role="radio"
                aria-checked={selectedBenefitIndex === index}
                onClick={() => selectBenefit(index)}
              >
                <span className="possibility-number">0{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
                <span className="possibility-choice">{selectedBenefitIndex === index ? <><Check size={15} /> 選択中</> : <>これが魅力的 <ArrowRight size={15} /></>}</span>
              </button>
            ))}
          </div>

          {selectedBenefit && (
            <div id="possibility-result" className="result-card possibility-result" aria-live="polite">
              <div className="result-card-topline"><Sparkles size={18} /> YOUR IDEAL WORK STYLE</div>
              <p className="result-eyebrow">YOU CHOSE</p>
              <h3>{selectedBenefit.title}</h3>
              <p className="result-description">{selectedBenefit.description}</p>
              <div className="next-step"><span>今日からできる小さな一歩</span><strong>{selectedBenefit.nextStep}</strong></div>
              <div className="result-card-actions">
                <button className="solid-button" type="button" onClick={copyBenefit}><Copy size={17} /> 結果をコピーする</button>
              </div>
              <p className="share-caption"><Clipboard size={15} /> 一番魅力に感じたことを、オープンチャットで教えてください。</p>
            </div>
          )}

          <aside className="disclaimer" role="note">
            <strong>いきなり退職する必要はありません</strong>
            <p>独立には、集客や収入の変動など自分で向き合う課題もあります。まずは今の仕事を続けながら、副業や小さなサービス提供で試すこともできます。</p>
          </aside>
        </section>

        <section className="closing-section">
          <div><p className="eyebrow">A SMALL STEP, TOGETHER</p><h2>考えたことを、<br />誰かと話してみる。</h2></div>
          <p>タイプ診断でも、独立で魅力に感じたことでも。気づいたことがあれば、オープンチャットで気軽にシェアしてください。言葉にすることで、次の一歩が少し具体的になります。</p>
        </section>
      </main>

      <footer className="site-footer">
        <p><span>THERAPIST BUSINESS PLAZA</span> 自分らしい働き方を考えるためのツール</p>
        <p>入力内容は保存・送信されません。</p>
      </footer>
    </div>
  );
}
