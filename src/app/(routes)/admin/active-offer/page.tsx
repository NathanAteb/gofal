"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const questions = [
  {
    id: "staff_welsh",
    question_cy: "Faint o'ch staff sy'n siarad Cymraeg?",
    question_en: "How many of your staff speak Welsh?",
    options: [
      { value: 0, label_cy: "Dim", label_en: "None" },
      { value: 1, label_cy: "1-2 aelod o staff", label_en: "1-2 staff members" },
      { value: 2, label_cy: "3-5 aelod o staff", label_en: "3-5 staff members" },
      { value: 3, label_cy: "Mwyafrif y staff", label_en: "Majority of staff" },
    ],
  },
  {
    id: "daily_welsh",
    question_cy: "A yw'r Gymraeg yn cael ei defnyddio'n ddyddiol?",
    question_en: "Is Welsh used on a daily basis?",
    options: [
      { value: 0, label_cy: "Ddim o gwbl", label_en: "Not at all" },
      { value: 1, label_cy: "Cyfarchion yn unig", label_en: "Greetings only" },
      { value: 2, label_cy: "Mewn sgyrsiau", label_en: "In conversations" },
      { value: 3, label_cy: "Prif iaith y cartref", label_en: "Main language of the home" },
    ],
  },
  {
    id: "signage",
    question_cy: "A yw arwyddion a bwydlenni yn ddwyieithog?",
    question_en: "Are signs and menus bilingual?",
    options: [
      { value: 0, label_cy: "Saesneg yn unig", label_en: "English only" },
      { value: 1, label_cy: "Rhai arwyddion", label_en: "Some signs" },
      { value: 2, label_cy: "Y mwyafrif", label_en: "Most" },
      { value: 3, label_cy: "Popeth yn ddwyieithog", label_en: "Everything bilingual" },
    ],
  },
  {
    id: "care_plans",
    question_cy: "A all cynlluniau gofal gael eu darparu yn Gymraeg?",
    question_en: "Can care plans be provided in Welsh?",
    options: [
      { value: 0, label_cy: "Na", label_en: "No" },
      { value: 1, label_cy: "Ar gais", label_en: "On request" },
      { value: 2, label_cy: "Ie, yn rheolaidd", label_en: "Yes, regularly" },
      { value: 3, label_cy: "Cymraeg yn ddiofyn", label_en: "Welsh by default" },
    ],
  },
  {
    id: "activities",
    question_cy: "A oes gweithgareddau Cymraeg ar gael?",
    question_en: "Are Welsh-language activities available?",
    options: [
      { value: 0, label_cy: "Dim", label_en: "None" },
      { value: 1, label_cy: "Ambell un", label_en: "Occasionally" },
      { value: 2, label_cy: "Yn rheolaidd", label_en: "Regularly" },
      { value: 3, label_cy: "Bob dydd", label_en: "Every day" },
    ],
  },
];

function Assessment() {
  const searchParams = useSearchParams();
  const homeId = searchParams.get("id");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;
  const level = totalScore >= 12 ? 3 : totalScore >= 7 ? 2 : totalScore >= 3 ? 1 : 0;

  const levelLabels = [
    { cy: "Dim gwybodaeth", en: "No information" },
    { cy: "Rhywfaint o Gymraeg", en: "Some Welsh" },
    { cy: "Cymraeg da", en: "Good Welsh" },
    { cy: "Rhagorol yn Gymraeg", en: "Excellent Welsh" },
  ];

  async function handleSubmit() {
    if (!homeId) return;
    await fetch("/api/admin/active-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ care_home_id: homeId, level, answers }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 className="font-heading text-2xl font-bold">Diolch! / Thank you!</h2>
        <p className="mt-3 text-muted-plum">
          Your Active Offer level: <strong>Level {level}</strong> — {levelLabels[level].en}
        </p>
        <div className="mt-4 flex justify-center gap-1">
          {[1, 2, 3].map((s) => (
            <svg key={s} width="24" height="24" viewBox="0 0 24 24" fill={s <= level ? "#E5AD3E" : "none"} stroke="#E5AD3E" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold">
        Hunanasesiad y Cynnig Rhagweithiol / Active Offer Self-Assessment
      </h1>
      <p className="mt-2 text-sm text-muted-plum">
        Atebwch y cwestiynau canlynol i asesu lefel eich Cynnig Rhagweithiol. /
        Answer the following questions to assess your Active Offer level.
      </p>

      <div className="mt-8 space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="rounded-[16px] border border-blush-grey bg-white p-5">
            <p className="font-heading font-bold text-dusk">{q.question_cy}</p>
            <p className="text-sm text-muted-plum">{q.question_en}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer rounded-[12px] p-2 hover:bg-ivory transition-colors">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => setAnswers({ ...answers, [q.id]: opt.value })}
                    className="accent-primary"
                  />
                  <span className="text-sm">
                    {opt.label_cy} / {opt.label_en}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Score preview */}
      {Object.keys(answers).length > 0 && (
        <div className="mt-6 rounded-[16px] bg-linen p-4 text-center">
          <p className="text-sm text-muted-plum">
            Score: {totalScore}/{maxScore} — Level {level}: {levelLabels[level].cy} / {levelLabels[level].en}
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < questions.length}
        className="mt-6 w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
      >
        Cyflwyno / Submit
      </button>
    </div>
  );
}

export default function ActiveOfferAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-plum">Loading...</div>}>
      <Assessment />
    </Suspense>
  );
}
