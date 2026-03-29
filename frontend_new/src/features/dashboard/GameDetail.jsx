import { Link, useParams } from 'react-router-dom';
import games from '../../data/gcomprisGames.json';

export default function GameDetail() {
  const { slug } = useParams();
  const game = games.find((item) => item.slug === slug);

  if (!game) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-bold">Game not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="mb-4 inline-block text-sm font-bold text-sky-600 hover:underline"
        >
          &larr; Quay lại Bảng điều khiển
        </Link>
        <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div
            className="h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${game.icon})` }}
          />
          <div className="space-y-4 p-6">
            <h1 className="text-3xl font-black text-slate-800">{game.title}</h1>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="mb-2 text-lg font-black text-emerald-800">Muốn chơi ngay trên web?</h2>
              <p className="mb-3 text-sm text-emerald-900/80">
                Một số game web đã có sẵn trong dashboard.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/games/rocket-dodge" className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white hover:bg-emerald-600">
                  Chơi Rocket Dodge
                </Link>
                <Link to="/games/drawing-board" className="rounded-full bg-sky-500 px-4 py-2 text-xs font-black text-white hover:bg-sky-600">
                  Chơi Bảng Vẽ
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <h2 className="mb-2 text-lg font-black text-slate-800">
                Chơi game này trên GCompris
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                Trò chơi này là một phần của bộ ứng dụng giáo dục GCompris. Để chơi, bạn cần cài đặt GCompris trên máy tính của mình.
              </p>
              <ol className="list-inside list-decimal space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Tải GCompris:</span> Truy cập trang tải xuống chính thức và chọn phiên bản cho hệ điều hành của bạn (Windows, macOS, hoặc Linux).
                </li>
                <li>
                  <span className="font-semibold">Cài đặt:</span> Mở file vừa tải và làm theo các bước hướng dẫn để cài đặt.
                </li>
                <li>
                  <span className="font-semibold">Tìm và chơi:</span> Mở ứng dụng GCompris, tìm đến mục <span className="font-bold text-emerald-700">{game.section} &gt; {game.category}</span> và chọn game <span className="font-bold text-emerald-700">{game.title}</span> để bắt đầu.
                </li>
              </ol>
              <a
                href="https://gcompris.net/downloads-en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-rose-500 px-6 py-2.5 font-bold text-white transition hover:bg-rose-600"
              >
                Tải GCompris ngay
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
