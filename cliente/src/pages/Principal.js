import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Principal.css";
import debounce from "lodash.debounce";
import axiosRetry from "axios-retry";
import logo from "../assets/logo.png";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.response?.status === 429,
});

const Principal = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [view, setView] = useState("explore");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmation, setConfirmation] = useState({
    show: false,
    type: null,
    data: null,
  });

  const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const TMDB_ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }, [navigate]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovies(searchQuery, nextPage);
  };
  
  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    fetchMovies(searchQuery, prevPage);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:8080/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      handleLogout();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setError("Erro ao excluir conta. Tente novamente.");
    }
  };

  const toggleWatched = async (movie) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/movies/${movie._id}`,
        { watched: !movie.watched },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMyList((prev) =>
        prev.map((m) =>
          m._id === movie._id ? { ...m, watched: response.data.movie.watched } : m
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const saveScrollPosition = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
  };
  
  const restoreScrollPosition = () => {
    setTimeout(() => {
      const savedPosition = sessionStorage.getItem("scrollPosition");
      if (savedPosition !== null) {
        window.scrollTo({
          top: parseInt(savedPosition, 10),
          behavior: "instant"
        });
      }
    }, 50);
  };
  
  const removeFromList = async (movieId) => {
    try {
      await axios.delete(`http://localhost:8080/api/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMyList((prev) => prev.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error("Erro ao remover filme:", error);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
              }
            }
          );
          setSelectedMovie(response.data);
        } catch (error) {
          console.error("Erro ao buscar filme:", error);
          navigate('/principal');
        }
      }
    };
    fetchMovie();
  }, [TMDB_ACCESS_TOKEN, movieId, navigate]);

  const handleCardClick = (movie) => {
    const idToUse = movie.tmdbId || movie.id;
    navigate(`/principal/${idToUse}`);
  };

  const handleCloseDescription = useCallback(() => {
    // Limpa o estado e navega SEM o movieId
    navigate('/principal', { replace: true });
    setSelectedMovie(null);
    document.body.style.overflow = 'auto';
  }, [navigate]);

  useEffect(() => {
    // Se não tem movieId na URL mas tem filme selecionado
    if (!movieId && selectedMovie) {
      setSelectedMovie(null);
    }
  }, [movieId, selectedMovie]);

  useEffect(() => {
    if (movieId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [movieId]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        try {
          // Primeiro verifica se o filme está na lista pessoal
          const localMovie = myList.find(movie => movie.tmdbId === Number(movieId));
          
          if (localMovie) {
            setSelectedMovie(localMovie);
          } else {
            // Se não encontrou local, busca na API
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
              { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } }
            );
            setSelectedMovie(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar filme:", error);
          navigate('/principal');
        }
      }
    };
    fetchMovie();
  }, [movieId, navigate, myList, TMDB_ACCESS_TOKEN]);

  useEffect(() => {
    // Verifica se o ID da URL é diferente do filme selecionado
    if (movieId && movieId !== selectedMovie?.id?.toString()) {
      const fetchMovie = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
              }
            }
          );
          setSelectedMovie(response.data);
        } catch (error) {
          console.error("Erro ao buscar filme:", error);
          navigate('/principal');
        }
      };
      fetchMovie();
    }
  }, [movieId, navigate, selectedMovie?.id, TMDB_ACCESS_TOKEN]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          handleLogout();
          return;
        }

        const response = await axios.get("http://localhost:8080/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.success) {
          throw new Error("Erro ao buscar usuário");
        }

        setUserData(response.data.user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        handleLogout();
      }
    };

    fetchUserData();
  }, [handleLogout]);
  
  
  const fetchMovies = useCallback(async (query = "", page = 1) => {
    setLoading(true);
    setError("");
  
    try {
      const API_KEY = TMDB_API_KEY;
      if (!API_KEY) {
        console.error("Erro: API Key não definida!");
        setError("Erro ao carregar filmes. API Key não configurada.");
        return;
      }
  
      const url = query
        ? `${TMDB_BASE_URL}search/movie?query=${encodeURIComponent(query)}&page=${page}&language=pt-BR&api_key=${API_KEY}`
        : `${TMDB_BASE_URL}movie/popular?page=${page}&language=pt-BR&api_key=${API_KEY}`;
  
      const response = await axios.get(url);
      setTotalPages(response.data.total_pages);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setError("Erro ao carregar filmes.");
    } finally {
      setLoading(false);
    }
  }, [TMDB_API_KEY]);

  

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const listResponse = await axios.get('http://localhost:8080/api/movies', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMyList(listResponse.data.data);
        await fetchMovies(searchQuery, currentPage);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setIsLoading(false);
      }
    };
  
    if (view === 'explore') {
      fetchInitialData();
    }
  }, [currentPage, fetchMovies, searchQuery, view]);
  
  useEffect(() => {
    fetchMovies(searchQuery, currentPage);
  }, [currentPage, searchQuery, fetchMovies]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      if (view === 'explore') {
        setCurrentPage(1);
        fetchMovies(searchQuery, 1);
      }
    }, 500);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [searchQuery, view, fetchMovies]);

  const fetchMyList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/movies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMyList(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
      console.error("Erro ao buscar lista:", error);
      setError("Erro ao carregar a lista de filmes.");
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (view === 'mylist') {
      fetchMyList();
    } else {
      fetchMovies(searchQuery, currentPage);
    }
  }, [view, searchQuery, currentPage, fetchMovies, fetchMyList]);

  const isInList = (movie) => {
    return myList.some(item => 
      Number(item.tmdbId) === Number(movie?.id) || // Para filmes da TMDB
      item._id === movie?._id // Para filmes salvos
    );
  };
  
  const addToList = async (movie) => {
    try {
      await axios.post('http://localhost:8080/api/movies', {
        tmdbId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConfirmation({ show: false, type: null, data: null });
      fetchMyList();

      setTimeout(() => {
        restoreScrollPosition();
      }, 100);

    } catch (error) {
      console.error("Erro ao adicionar filme:", error);
      setError(error.response?.data?.message || "Erro ao adicionar filme");
    }
  };

  return (
    <div className="principal-container">
      {showMenu && <div className="overlay" onClick={() => setShowMenu(false)} />}
  
      {confirmation.show && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>
              {confirmation.type === 'addMovie' 
                ? `Adicionar "${confirmation.data?.title}" à lista?`
                : 'Tem certeza que deseja excluir sua conta?'}
            </h3>
            <div className="confirmation-buttons">
              <button 
                className="confirm-button"
                onClick={() => {
                  if (confirmation.type === 'addMovie') {
                    addToList(confirmation.data);
                  } else {
                    handleDeleteAccount();
                  }
                  setConfirmation({ show: false, type: null, data: null });
                }}
              >
                Confirmar
              </button>
              <button
                className="cancel-button"
                onClick={() => setConfirmation({ show: false, type: null, data: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="description-overlay">
          <div className="description-content">
            <button 
              className="close-button"
              onClick={handleCloseDescription}
            >
              ×
            </button>
            
            <div className="description-poster">
              <img
                src={selectedMovie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=Poster+Indisponível'}
                alt={selectedMovie.title}
              />
            </div>
            
            <div className="description-info">
              <h1>{selectedMovie.title}</h1>
              <p>{selectedMovie.overview}</p>
              
              <div className="metadata">
                <span>⭐ {selectedMovie.vote_average}</span>
                <span>🗓️ {new Date(selectedMovie.release_date).toLocaleDateString()}</span>
                <span>⏱️ {selectedMovie.runtime} minutos</span>
              </div>
              
              {isInList(selectedMovie) ? (
                <div className="in-list-message">✅ Em sua lista</div>
              ) : (
                <button 
                  className="add-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    saveScrollPosition();
                    setConfirmation({ show: true, type: 'addMovie', data: selectedMovie });
                  }}
                >
                  ➕ WatchList
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  
      <header className="main-header">
        <div className="header-left">
          <div className="logo-link" onClick={() => window.location.reload()}>
            <img src={logo} alt="Logo do site" className="logo" />
          </div>
  
          <nav>
            <button onClick={() => setView('explore')} className={view === 'explore' ? 'active' : ''}>
              Explorar
            </button>
            <button onClick={() => setView('mylist')} className={view === 'mylist' ? 'active' : ''}>
              Minha Lista
            </button>
          </nav>
  
          {view === 'explore' && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchMovies(searchQuery)}
              />
              <button className="search-button" onClick={() => fetchMovies(searchQuery)}>
                {loading ? '⌛' : '🔍'}
              </button>
            </div>
          )}
        </div>
  
        <div className="header-right">
          <div className="user-menu">
            <button className="user-button" onClick={() => setShowMenu(!showMenu)}>
              {userData?.name || 'Usuário'}
            </button>
            
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={() => navigate('/edit-profile')}>✏️ Editar Perfil</button>
                <button onClick={() => setConfirmation({
                  show: true,
                  type: 'deleteAccount',
                  data: null
                })}>
                  🗑️ Excluir Conta
                </button>
                <button onClick={handleLogout}>🚪 Sair</button>
              </div>
            )}
          </div>
        </div>
      </header>
  
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {(view === 'explore' ? movies : myList).map((movie) => {
                const isMovieInList = isInList(movie);
                const identifier = movie.tmdbId || movie.id;

                return (
                  <div 
                    className="movie-card-container" 
                    key={identifier}
                    onClick={() => handleCardClick(movie)}
                  >
                    <div className="movie-card">
                      <div className="movie-poster-container">
                        <img
                          src={movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=Poster+Indisponível'}
                          alt={movie.title}
                          className="movie-poster"
                          loading="lazy"
                        />
                      </div>
                      <div className="movie-info">
                        <h3>{movie.title}</h3>
                        <div className="movie-details">
                          <span>⭐ {movie.vote_average}</span>
                          <span>🗓️ {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Ano Desconhecido'}</span>
                        </div>
                      </div>
                    </div>

                    {view === 'mylist' ? (
                      <>
                        <button 
                          className="remove-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromList(movie._id);
                          }}
                        >
                          ×
                        </button>
                        <button
                          className={`watched-button ${movie.watched ? 'watched' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatched(movie);
                          }}
                        >
                          {movie.watched ? 'Assistido ✔️' : 'Marcar como assistido'}
                        </button>
                      </>
                    ) : (
                      !isMovieInList && (
                        <button 
                          className="add-button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmation({
                              show: true,
                              type: 'addMovie',
                              data: movie
                            });
                          }}
                        >
                          ➕ WatchList
                        </button>
                      )
                      
                      
                      
                      )}

                      {isMovieInList && view === 'explore' && (
                              <div className="in-list-message">
                                ✅ Em sua lista
                              </div>
                            )}

                  </div>
                );
              })}


            </div>

            {view === 'explore' && (
              <div className="pagination">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1 || loading}
                >
                  Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || loading}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="tmdb-attribution">
        <p>Dados fornecidos pelo <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a></p>
      </footer>
    </div>
  );
};

export default Principal;