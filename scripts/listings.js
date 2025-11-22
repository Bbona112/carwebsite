// Car data
const carsData = [
  {
    id: 1,
    image: "../assets/images/s550side.jpeg",
    type: "Sedan",
    make: "Mercedez Benz S550",
    model: "Model 1",
    year: 2022,
    price: 30000,
    link: "sClass.html"
  },
  {
    id: 2,
    image: "../assets/images/g550side.jpeg",
    type: "Suv",
    make: "Mercedez G Benz 550",
    model: "Model 1",
    year: 2022,
    price: 35000,
    link: "gClass.html"
  },
  {
    id: 3,
    image: "../assets/images/spurside.jpeg",
    type: "Sedan",
    make: "Bentley Flying Spur",
    model: "Model 1",
    year: 2022,
    price: 45000,
    link: "bentely.html"
  },
  {
    id: 4,
    image: "../assets/images/tundra side.jpeg",
    type: "Pick-up",
    make: "Toyota Tundra",
    model: "Model 1",
    year: 2022,
    price: 28000,
    link: "tundra.html"
  },
  {
    id: 5,
    image: "../assets/images/lcside.jpeg",
    type: "Suv",
    make: "Land Cruiser 300",
    model: "Model 1",
    year: 2022,
    price: 40000,
    link: "lc300.html"
  },
  {
    id: 6,
    image: "../assets/images/570side.jpeg",
    type: "Suv",
    make: "Lexux LX570",
    model: "Model 1",
    year: 2022,
    price: 38000,
    link: "lexus.html"
  },
  {
    id: 7,
    image: "../assets/images/bmwside.jpeg",
    type: "Sedan",
    make: "BMW i7 Series",
    model: "Model 1",
    year: 2022,
    price: 42000,
    link: "i7.html"
  },
  {
    id: 8,
    image: "../assets/images/phside.jpeg",
    type: "Sedan",
    make: "Rolce Royce Phantom III",
    model: "Model 1",
    year: 2022,
    price: 150000,
    link: "phantom.html"
  },
  {
    id: 9,
    image: "../assets/images/cullinanside.jpeg",
    type: "Suv",
    make: "Rolls Royce Cullinan",
    model: "Model 1",
    year: 2022,
    price: 180000,
    link: "cullian.html"
  },
  {
    id: 10,
    image: "../assets/images/vside.jpeg",
    type: "Mid-Suv",
    make: "Range Rover Velar",
    model: "Model 1",
    year: 2022,
    price: 36000,
    link: "velar.html"
  },
  {
    id: 11,
    image: "../assets/images/rside.jpeg",
    type: "Suv",
    make: "Range Rover Vogue",
    model: "Model 1",
    year: 2022,
    price: 55000,
    link: "autobiography.html"
  },
  {
    id: 12,
    image: "../assets/images/glsside.jpeg",
    type: "Suv",
    make: "Mercedez Benz Gls 63",
    model: "Model 1",
    year: 2022,
    price: 48000,
    link: "gls.html"
  }
];

// State
let filteredCars = [...carsData];
let currentPage = 1;
const itemsPerPage = 6;
let currentView = 'grid';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  renderCars();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Search
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  
  // Make filter
  document.getElementById('makeFilter').addEventListener('change', applyFilters);
  
  // Type filters
  document.querySelectorAll('input[type="checkbox"][id^="type"]').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Year filters
  document.getElementById('yearMin').addEventListener('input', applyFilters);
  document.getElementById('yearMax').addEventListener('input', applyFilters);
  
  // Price filters
  document.getElementById('priceMin').addEventListener('input', applyFilters);
  document.getElementById('priceMax').addEventListener('input', applyFilters);
  document.getElementById('priceRange').addEventListener('input', function() {
    document.getElementById('priceMax').value = this.value;
    document.getElementById('priceRangeValue').textContent = formatPrice(this.value);
    applyFilters();
  });
  
  // Sort
  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  
  // View toggle
  document.querySelectorAll('.view-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentView = this.dataset.view;
      renderCars();
    });
  });
  
  // Clear filters
  document.getElementById('clearFilters').addEventListener('click', clearFilters);
}

// Initialize filters
function initializeFilters() {
  const maxPrice = Math.max(...carsData.map(car => car.price));
  document.getElementById('priceRange').max = maxPrice;
  document.getElementById('priceRange').value = maxPrice;
  document.getElementById('priceRangeValue').textContent = formatPrice(maxPrice);
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const makeFilter = document.getElementById('makeFilter').value;
  const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"][id^="type"]:checked'))
    .map(cb => cb.value);
  const yearMin = parseInt(document.getElementById('yearMin').value) || 0;
  const yearMax = parseInt(document.getElementById('yearMax').value) || 9999;
  const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
  const priceMax = parseInt(document.getElementById('priceMax').value) || 999999;
  const sortBy = document.getElementById('sortSelect').value;

  // Filter cars
  filteredCars = carsData.filter(car => {
    const matchesSearch = !searchTerm || 
      car.make.toLowerCase().includes(searchTerm) ||
      car.type.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm);
    
    const matchesMake = !makeFilter || car.make.includes(makeFilter);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.type);
    
    const matchesYear = car.year >= yearMin && car.year <= yearMax;
    
    const matchesPrice = car.price >= priceMin && car.price <= priceMax;
    
    return matchesSearch && matchesMake && matchesType && matchesYear && matchesPrice;
  });

  // Sort cars
  sortCars(sortBy);
  
  // Reset to first page
  currentPage = 1;
  
  // Render
  renderCars();
  updateResultsCount();
}

// Sort cars
function sortCars(sortBy) {
  switch(sortBy) {
    case 'price-asc':
      filteredCars.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredCars.sort((a, b) => b.price - a.price);
      break;
    case 'year-asc':
      filteredCars.sort((a, b) => a.year - b.year);
      break;
    case 'year-desc':
      filteredCars.sort((a, b) => b.year - a.year);
      break;
    case 'name-asc':
      filteredCars.sort((a, b) => a.make.localeCompare(b.make));
      break;
    case 'name-desc':
      filteredCars.sort((a, b) => b.make.localeCompare(a.make));
      break;
    default:
      // Keep original order
      break;
  }
}

// Clear filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('makeFilter').value = '';
  document.querySelectorAll('input[type="checkbox"][id^="type"]').forEach(cb => cb.checked = false);
  document.getElementById('yearMin').value = '';
  document.getElementById('yearMax').value = '';
  document.getElementById('priceMin').value = '';
  const maxPrice = Math.max(...carsData.map(car => car.price));
  document.getElementById('priceMax').value = maxPrice;
  document.getElementById('priceRange').value = maxPrice;
  document.getElementById('priceRangeValue').textContent = formatPrice(maxPrice);
  document.getElementById('sortSelect').value = 'default';
  
  filteredCars = [...carsData];
  currentPage = 1;
  renderCars();
  updateResultsCount();
}

// Render cars
function renderCars() {
  const container = document.getElementById('carListings');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const carsToShow = filteredCars.slice(startIndex, endIndex);
  
  container.innerHTML = '';
  container.className = currentView === 'grid' ? 'row g-4' : 'row g-3';
  
  if (carsToShow.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          <i class="fas fa-search fa-3x mb-3"></i>
          <h4>No cars found</h4>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    `;
    return;
  }
  
  carsToShow.forEach(car => {
    const colClass = currentView === 'grid' ? 'col-lg-4 col-md-6' : 'col-12';
    const cardHTML = currentView === 'grid' ? createGridCard(car) : createListCard(car);
    container.innerHTML += `<div class="${colClass}">${cardHTML}</div>`;
  });
  
  renderPagination();
  updateResultsCount();
}

// Create grid card
function createGridCard(car) {
  return `
    <div class="car-card h-100">
      <div class="card-img-wrapper">
        <img src="${car.image}" class="card-img-top" alt="${car.make}" onerror="this.src='../assets/images/cars.png'">
        <div class="card-badge">${car.type}</div>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${car.make}</h5>
        <ul class="card-details list-unstyled mb-3">
          <li><strong>Model:</strong> ${car.model}</li>
          <li><strong>Year:</strong> ${car.year}</li>
          <li><strong>Price:</strong> <span class="text-warning fw-bold">$${formatPrice(car.price)}</span></li>
        </ul>
        <a href="${car.link}" class="btn btn-primary mt-auto">
          <span>More Info</span>
        </a>
      </div>
    </div>
  `;
}

// Create list card
function createListCard(car) {
  return `
    <div class="car-card car-card-list">
      <div class="row g-0">
        <div class="col-md-4">
          <div class="card-img-wrapper">
            <img src="${car.image}" class="card-img-top h-100" alt="${car.make}" style="object-fit: cover;" onerror="this.src='../assets/images/cars.png'">
            <div class="card-badge">${car.type}</div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card-body h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${car.make}</h5>
              <ul class="card-details list-unstyled row g-2 mb-3">
                <li class="col-md-6"><strong>Model:</strong> ${car.model}</li>
                <li class="col-md-6"><strong>Year:</strong> ${car.year}</li>
                <li class="col-md-12"><strong>Price:</strong> <span class="text-warning fw-bold fs-5">$${formatPrice(car.price)}</span></li>
              </ul>
            </div>
            <a href="${car.link}" class="btn btn-primary align-self-start">
              <span>More Info</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }
  
  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;
  
  pagination.innerHTML = paginationHTML;
  
  // Add event listeners
  pagination.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCars();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// Update results count
function updateResultsCount() {
  const total = filteredCars.length;
  const start = filteredCars.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);
  
  document.getElementById('resultsCount').textContent = total;
  document.getElementById('showingCount').textContent = `${start}-${end} of ${total}`;
}

// Format price
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

