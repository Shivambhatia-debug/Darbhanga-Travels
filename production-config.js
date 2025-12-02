// Production Configuration for Hostinger Deployment
// Update these values according to your Hostinger setup

export const productionConfig = {
  // PHP API URL - Update this to your actual domain
  phpApiUrl: 'https://darbhangatravels.com/api',
  
  // Database configuration (if using database)
  database: {
    host: 'localhost',
    name: 'u363779306_dbg_travels',
    user: 'u363779306_localhost',
    password: 'Shiva@8053'
  },
  
  // Admin credentials (update these)
  admin: {
    email: 'admin@darbhangatravels.com',
    password: 'your_secure_password'
  },
  
  // Site configuration
  site: {
    name: 'Darbhanga Travels',
    domain: 'darbhangatravels.com',
    email: 'info@darbhangatravels.com'
  }
}
