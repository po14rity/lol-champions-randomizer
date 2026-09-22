import { useState, useEffect } from "react";
import './App.css';
import { openUrl } from "@tauri-apps/plugin-opener";

// interface ChampionImages {
//   [key: string]: string;
// }

function App() {
  const [champions, setChampions] = useState<Record<string, string>>({});
  const [currentChampion, setCurrentChampion] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // состояние для анимации (переключение)

  useEffect(() => {
    const modules = import.meta.glob<{default: string}>('./assets/*{.jpg,png}');

    // Импорт файлов, как оказалось, - асинхронная операция
    const loadImages = async () => {
      const images: Record<string, string> = {};
      for (const [path, module] of Object.entries(modules)) {
        try {
          const imported = await module();
          const name = path.split('/').pop()?.replace(/\.(jpg|png)$/, '') || '';
          images[name] = imported.default;
        } catch (error) {
          console.error(`Failed to load ${path}:`, error);
        }
      }

      setChampions(images);
    };

    loadImages();

    // return () => {};
  }, []);

  const randomizeChampion = () => {
    const championNames = Object.keys(champions);
    if (championNames.length === 0) return;

    setIsAnimating(true);

    const randomIndex = Math.floor(Math.random() * championNames.length);
    const selectedChampion = championNames[randomIndex];

    setTimeout(() => {
      setCurrentChampion(selectedChampion);
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    if (Object.keys(champions).length > 0 && !currentChampion) {
      randomizeChampion();
    }
  }, [champions]);

  // Функция для открытия opgg
  const openChampionGuide = async (championName: string) => {
    const url = `https://op.gg/ru/lol/champions/${championName}/build`;
    if (url) {
      await openUrl(url);
    } else {
      console.warn(`URL not found for ${championName}`);
    }
  }

  if (Object.keys(champions).length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка чемпионов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">
          🎲 Рандомайзер Чемпионов
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Нажми кнопку, чтобы выбрать случайного чемпиона
        </p>

        <div className="relative w-full max-w-md">
          <div
            className={`
              bg-gray-800 rounded-2xl overflow-hidden shadow-2xl
              transition-all duration-200 ease-in-out
              ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
          >
            {currentChampion && (
              <>
                <div className="relative">
                  <img
                    src={champions[currentChampion]}
                    alt={currentChampion}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Градиент поверх изображения для красоты */}
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
                  
                {/* КЛИКАБЕЛЬНОЕ ИМЯ ЧЕМПИОНА */}
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={() => openChampionGuide(currentChampion)}
                    className="
                      text-3xl font-bold text-white capitalize drop-shadow-lg
                      cursor-pointer hover:text-blue-400 
                      transition-colors duration-200
                      bg-transparent border-none p-0
                      text-left
                    "
                    title={`Открыть страницу ${currentChampion}`}
                  >
                    {currentChampion.replace('_', ' ')}
                  </button>
                </div>
              </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>ADC Champion</span>
                    <span>{Object.keys(champions).length} всего</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={randomizeChampion}
          disabled={isAnimating}
          className={`
            mt-8 px-8 py-4 
            bg-linear-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            text-white font-bold text-xl
            rounded-full
            shadow-lg hover:shadow-2xl
            transform hover:scale-105
            active:scale-95
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-3
          `}
        >
          <svg
            className={`w-6 h-6 ${isAnimating ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m-4-4h8"
            />
          </svg>
          
          <span>
            {isAnimating ? 'Выбираем...' : 'Случайный чемпион'}
          </span>
        </button>
      </div>
  );
}


export default App;