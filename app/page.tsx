import Link from "next/link";

import { VideoUrlForm } from "@/components/video-url-form";
import { getAllRecords } from "@/lib/store";

export default async function Home() {
  const records = await getAllRecords();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            유튜브 자막 번역
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            영어 자막이 있는 유튜브 링크를 입력하면 영상과 함께 영어 자막을 볼 수 있어요. (한국어 번역은 추후 지원 예정)
          </p>
        </div>

        <VideoUrlForm />

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            처리한 영상
          </h2>
          {records.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              아직 처리한 영상이 없어요.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {records.map((record) => (
                <li key={record.id} className="py-3">
                  <Link
                    href={`/videos/${record.id}`}
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                  >
                    {record.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
