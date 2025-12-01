import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Billboard } from './components/Billboard';
import { MovieRow } from './components/MovieRow';
import { Modal } from './components/Modal';
import { Search } from './components/Search';
import { BottomNav } from './components/BottomNav';
import { AdminPanel } from './components/AdminPanel';
import { Player } from './components/Player';
import { Movie, ViewState, AppConfig, CategoryDef } from './types';

// Initial Data
const INITIAL_MOVIES: Movie[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `mock-${i}`,
  title: [
    "Stranger Things", "The Crown", "Ozark", "Dark", 
    "Breaking Bad", "Black Mirror", "Money Heist", "The Witcher",
    "Mindhunter", "Narcos", "Squid Game", "Bridgerton"
  ][i % 12] + (i > 11 ? ` ${i}` : ''),
  description: "Un grupo de amigos descubre misterios sobrenaturales y experimentos secretos del gobierno en su pequeño pueblo. Una aventura emocionante que te mantendrá al borde de tu asiento.",
  thumbnailUrl: `https://picsum.photos/seed/${i + 100}/400/230`, // Landscape
  posterUrl: `https://picsum.photos/seed/${i + 100}/600/900`,   // Portrait (High Res)
  coverUrl: `https://picsum.photos/seed/${i + 100}/1920/1080`,  // Hero
  videoUrl: "https://unlimplay.com/play.php/embed/movie/1979", // Default provided link
  genre: ["Drama", "Sci-Fi", "Thriller"],
  duration: "50m",
  rating: "TV-MA",
  matchScore: 90 + (i % 10),
  year: 2016 + (i % 8)
}));

// Default Configuration
const DEFAULT_CONFIG: AppConfig = {
  appName: "NetClone AI",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  primaryColor: "#E50914", // Netflix Red
  backgroundColor: "#000000",
  secondaryColor: "#141414",
  textColor: "#FFFFFF",
  showBillboard: true,
  categoryOrder: ["trends", "new", "us_series", "action", "comedy"]
};

// Category Definitions
const CATEGORY_DEFS: Record<string, CategoryDef> = {
  trends: { id: "trends", title: "Tendencias ahora", filter: (m) => m.slice(0, 8) },
  new: { id: "new", title: "Nuevos lanzamientos", filter: (m) => m.slice(6, 14) },
  us_series: { id: "us_series", title: "Series Internacionales", filter: (m) => m.slice(12, 20) },
  action: { id: "action", title: "Acción y Aventura", filter: (m) => m.filter(x => x.genre.includes("Drama") || x.genre.includes("Sci-Fi")).slice(0, 10) },
  comedy: { id: "comedy", title: "Para reír", filter: (m) => m.slice(5, 15) }
};

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Randomize featured movie on initial load (automatic rotation on reload)
  const [featuredMovie, setFeaturedMovie] = useState<Movie>(() => {
    if (INITIAL_MOVIES.length > 0) {
      const randomIndex = Math.floor(Math.random() * INITIAL_MOVIES.length);
      return INITIAL_MOVIES[randomIndex];
    }
    return INITIAL_MOVIES[0];
  });
  
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  // Update featured movie if the movies list changes (e.g. if deleted)
  useEffect(() => {
    if (movies.length > 0 && !movies.find(m => m.id === featuredMovie.id)) {
        setFeaturedMovie(movies[0]);
    }
  }, [movies, featuredMovie.id]);

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePlay = (movie: Movie) => {
    setPlayingMovie(movie);
    // Close modal if open to clean up UI
    if (selectedMovie) setSelectedMovie(null);
  };

  const handleClosePlayer = () => {
    setPlayingMovie(null);
  };

  // Dynamic Styles
  const appStyle = {
    backgroundColor: appConfig.backgroundColor,
    color: appConfig.textColor,
    '--primary': appConfig.primaryColor,
    '--secondary': appConfig.secondaryColor,
  } as React.CSSProperties;

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden transition-colors duration-300" style={appStyle}>
      
      <Navbar 
        config={appConfig}
        setViewState={setViewState} 
        onSearchClick={() => setViewState(ViewState.SEARCH)} 
      />

      {viewState === ViewState.HOME && (
        <div className="pb-20 md:pb-10">
          {movies.length > 0 ? (
             <>
               {appConfig.showBillboard && (
                 <Billboard 
                  movie={featuredMovie} 
                  onOpenModal={handleOpenModal} 
                  onPlay={handlePlay}
                  primaryColor={appConfig.primaryColor}
                 />
               )}
               
               <div className={`pb-10 relative z-20 pl-0 space-y-4 md:space-y-8 ${appConfig.showBillboard ? '-mt-10 md:-mt-48' : 'pt-24'}`}>
                 {appConfig.categoryOrder.map((catId) => {
                   const def = CATEGORY_DEFS[catId];
                   if (!def) return null;
                   return (
                     <MovieRow 
                       key={catId} 
                       title={def.title} 
                       movies={def.filter(movies)} 
                       onMovieClick={handleOpenModal} 
                     />
                   );
                 })}
               </div>
             </>
          ) : (
            <div className="flex h-screen items-center justify-center text-gray-500">
               No hay contenido disponible. Usa el Panel de Control.
            </div>
          )}
        </div>
      )}

      {viewState === ViewState.SEARCH && (
        <div className="pb-20">
          <Search onMovieClick={handleOpenModal} onClose={() => setViewState(ViewState.HOME)} />
        </div>
      )}

      {viewState === ViewState.NEW_HOT && (
         <div className="pt-24 px-4 md:px-12 pb-24 min-h-screen">
             <h1 className="text-2xl md:text-3xl font-bold mb-6">Novedades populares</h1>
             <div className="space-y-6">
                {movies.slice(0, 5).map((movie, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="flex-none w-12 pt-2 text-center">
                        <span className="text-sm opacity-70 font-bold block">{['ENE', 'FEB', 'MAR'][i%3] || 'NOV'}</span>
                        <span className="text-2xl font-bold block">{10 + i}</span>
                     </div>
                     <div className="flex-1">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                           <img src={movie.thumbnailUrl} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <button onClick={() => handleOpenModal(movie)} style={{ backgroundColor: 'rgba(255,255,255,0.9)' }} className="p-3 rounded-full">
                                <span className="sr-only">Play</span>
                                <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </button>
                           </div>
                        </div>
                        <h3 className="font-bold text-lg">{movie.title}</h3>
                        <p className="opacity-70 text-sm line-clamp-2 mt-1">{movie.description}</p>
                     </div>
                  </div>
                ))}
             </div>
         </div>
      )}

      {viewState === ViewState.MY_LIST && (
         <div className="pt-24 px-4 md:px-12 pb-24 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Mi lista</h1>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
               {movies.slice(0, 8).map(m => (
                 <div key={m.id} className="aspect-[2/3] relative">
                   <img 
                    src={m.posterUrl} 
                    alt={m.title} 
                    className="rounded md:rounded-lg w-full h-full object-cover cursor-pointer hover:opacity-80 transition" 
                    onClick={() => handleOpenModal(m)}
                   />
                 </div>
               ))}
            </div>
         </div>
      )}

      {/* Admin Panel Overlay */}
      {viewState === ViewState.ADMIN && (
        <AdminPanel 
          movies={movies} 
          setMovies={setMovies} 
          config={appConfig}
          setConfig={setAppConfig}
          onClose={() => setViewState(ViewState.HOME)} 
          categoryDefs={CATEGORY_DEFS}
        />
      )}

      {/* Footer */}
      <footer className="hidden md:block px-12 py-8 max-w-5xl mx-auto opacity-50 text-sm mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <span className="hover:underline cursor-pointer">Audio y subtítulos</span>
          <span className="hover:underline cursor-pointer">Centro de ayuda</span>
          <span className="hover:underline cursor-pointer">Prensa</span>
          <span className="hover:underline cursor-pointer">Inversores</span>
        </div>
        <p className="text-[11px] mt-4">© 2024 {appConfig.appName}, Inc.</p>
      </footer>

      {/* Modal Overlay */}
      {selectedMovie && (
        <Modal 
          movie={selectedMovie} 
          onClose={handleCloseModal} 
          onPlay={handlePlay}
        />
      )}

      {/* Video Player Overlay */}
      {playingMovie && (
         <Player 
           url={playingMovie.videoUrl || "https://unlimplay.com/play.php/embed/movie/1979"} 
           onClose={handleClosePlayer} 
         />
      )}

      {/* Mobile Bottom Navigation */}
      {viewState !== ViewState.ADMIN && (
        <BottomNav viewState={viewState} setViewState={setViewState} config={appConfig} />
      )}
      
    </div>
  );
}

export default App;