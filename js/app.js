// Dữ liệu phim mẫu
const moviesData = [
    {
        id: 1,
        title: "Inception",
        year: 2010,
        genre: ["Khoa học viễn tưởng", "Hành động", "Kịch tính"],
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80",
        director: "Christopher Nolan",
        cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
        description: "Một tên trộm chuyên đánh cắp bí mật thông qua tiềm thức của mục tiêu trong trạng thái mơ được giao nhiệm vụ khó khăn: cấy ý tưởng vào tâm trí một CEO."
    },
    {
        id: 2,
        title: "The Dark Knight",
        year: 2008,
        genre: ["Hành động", "Tội phạm", "Kịch tính"],
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80",
        director: "Christopher Nolan",
        cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
        description: "Khi mối đe dọa mang tên Joker tàn phá thành phố Gotham, Batman phải chấp nhận thử thách tâm lý và thể chất lớn nhất để chiến đấu chống lại cái ác."
    },
    {
        id: 3,
        title: "Interstellar",
        year: 2014,
        genre: ["Khoa học viễn tưởng", "Phiêu lưu", "Kịch tính"],
        poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80",
        director: "Christopher Nolan",
        cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
        description: "Nhóm các nhà thám hiểm sử dụng lỗ giun mới được phát hiện để du hành không gian nhằm tìm kiếm một ngôi nhà mới cho nhân loại trước khi Trái Đất diệt vong."
    },
    {
        id: 4,
        title: "Parasite",
        year: 2019,
        genre: ["Hài", "Kịch tính", "Tội phạm"],
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
        director: "Bong Joon Ho",
        cast: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
        description: "Gia đình nghèo khó của Ki-taek tìm cách thâm nhập vào cuộc sống xa hoa của gia đình Park bằng cách lần lượt làm việc giả mạo giấy tờ."
    },
    {
        id: 5,
        title: "Whiplash",
        year: 2014,
        genre: ["Âm nhạc", "Kịch tính"],
        poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
        director: "Damien Chazelle",
        cast: "Miles Teller, J.K. Simmons",
        description: "Một tay trống tài năng theo học tại một nhạc viện danh tiếng bị đẩy đến giới hạn của bản thân bởi người giáo viên cực kỳ nghiêm khắc."
    },
    {
        id: 6,
        title: "Avatar",
        year: 2009,
        genre: ["Khoa học viễn tưởng", "Phiêu lưu", "Hành động"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
        director: "James Cameron",
        cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
        description: "Một cựu thủy quân lục chiến bị liệt được cử đến hành tinh Pandora để thực hiện nhiệm vụ đặc biệt, nhưng dần bị giằng xé giữa mệnh lệnh và việc bảo vệ thế giới mới."
    }
];

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const genreFiltersContainer = document.getElementById('genreFilters');
const resultCount = document.getElementById('resultCount');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const movieModal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

// --- 1. DARK/LIGHT MODE LOGIC ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// --- 2. DYNAMIC GENRE CHECKBOXES GENERATION ---
function generateGenreFilters() {
    // Tự động phát hiện các thể loại không trùng lặp từ mảng dữ liệu
    const allGenres = new Set();
    moviesData.forEach(movie => {
        movie.genre.forEach(g => allGenres.add(g));
    });

    genreFiltersContainer.innerHTML = '';
    allGenres.forEach(genre => {
        const label = document.createElement('label');
        label.classList.add('genre-item');
        label.innerHTML = `
            <input type="checkbox" value="${genre}">
            <span>${genre}</span>
        `;
        genreFiltersContainer.appendChild(label);
    });

    // Lắng nghe sự kiện thay đổi trên các checkbox
    const checkboxes = genreFiltersContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', filterMovies);
    });
}

// --- 3. RENDER MOVIES ---
function renderMovies(movies) {
    movieGrid.innerHTML = '';
    resultCount.textContent = `Hiển thị ${movies.length} phim`;

    if (movies.length === 0) {
        movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Không tìm thấy bộ phim nào phù hợp.</p>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <span class="movie-year">${movie.year}</span>
                <span class="movie-genres-tag">${movie.genre.join(', ')}</span>
            </div>
        `;
        
        // Sự kiện click mở modal chi tiết
        card.addEventListener('click', () => openModal(movie));
        movieGrid.appendChild(card);
    });
}

// --- 4. COMBINED FILTER LOGIC (Category + Search Keyword) ---
function filterMovies() {
    const keyword = searchInput.value.trim().toLowerCase();
    
    // Lấy danh sách các thể loại đang được check
    const checkedGenres = Array.from(
        genreFiltersContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    const filtered = moviesData.filter(movie => {
        // Kiểm tra điều kiện tìm kiếm theo tên
        const matchesKeyword = movie.title.toLowerCase().includes(keyword);
        
        // Kiểm tra điều kiện thể loại (nếu chọn thể loại thì phim phải chứa ít nhất một thể loại được chọn, hoặc khớp tất cả tùy logic, ở đây chọn chứa các thể loại đã tick)
        const matchesGenre = checkedGenres.length === 0 || checkedGenres.every(g => movie.genre.includes(g));

        return matchesKeyword && matchesGenre;
    });

    renderMovies(filtered);
}

// --- 5. DEBOUNCE TECHNIQUE FOR SEARCH ---
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const debouncedFilter = debounce(filterMovies, 350);
searchInput.addEventListener('input', debouncedFilter);

// --- 6. MODAL CHI TIẾT PHIM ---
function openModal(movie) {
    modalBody.innerHTML = `
        <div class="modal-body-grid">
            <img src="${movie.poster}" alt="${movie.title}" class="modal-poster">
            <div class="modal-details">
                <h2>${movie.title} (${movie.year})</h2>
                <p><strong>Thể loại:</strong> ${movie.genre.join(', ')}</p>
                <p><strong>Đạo diễn:</strong> ${movie.director}</p>
                <p><strong>Diễn viên:</strong> ${movie.cast}</p>
                <p><strong>Nội dung:</strong> ${movie.description}</p>
            </div>
        </div>
    `;
    movieModal.style.display = 'flex';
}

function closeModalHandler() {
    movieModal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModalHandler);
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        closeModalHandler();
    }
});

// --- KHỞI CHẠY ỨNG DỤNG ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    generateGenreFilters();
    renderMovies(moviesData);
});
