import Link from "next/link";
import { notFound } from "next/navigation";

import { getRecordByVideoId } from "@/lib/store";

export default async function VideoPage(props: PageProps<"/videos/[id]">) {
  const { id } = await props.params;
  const record = await getRecordByVideoId(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          ← 목록으로
        </Link>

        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {record.title}
        </h1>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${record.videoId}`}
            title={record.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              영어 자막
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
              {record.englishText}
            </p>
          </section>
          {/* 한국어 번역은 추후 개발로 보류 (docs/follow-ups/translate-provider-rate-limit.md 참고)
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              한국어 번역
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
              {record.koreanText}
            </p>
          </section>
          */}
        </div>
      </main>
    </div>
  );
}
