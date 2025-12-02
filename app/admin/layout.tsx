"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  LogOut, 
  Settings, 
  Users, 
  BookOpen, 
  BarChart3, 
  Menu,
  X,
  Shield,
  Home,
  UserCircle,
  Calendar,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isBookingsExpanded, setIsBookingsExpanded] = useState(false)
  const [isCustomersExpanded, setIsCustomersExpanded] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    checkAuth()
    
    // Check if we're on bookings page with date filter, expand Bookings menu
    const dateParam = searchParams?.get('date')
    if (dateParam && ['today', 'yesterday', 'tomorrow'].includes(dateParam)) {
      setIsBookingsExpanded(true)
    }
    
    // Auto-expand Bookings menu if on bookings page
    if (pathname?.startsWith('/admin/bookings')) {
      setIsBookingsExpanded(true)
    }
    
    // Auto-expand Customers menu if on customer bookings page
    if (pathname?.startsWith('/admin/customers/bookings')) {
      setIsCustomersExpanded(true)
    }
  }, [pathname, searchParams])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/admin/verify.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAdminData(data.admin)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('admin_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('admin_token')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setAdminData(null)
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={checkAuth} />
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen, hasSubMenu: true },
    { name: "Customers", href: "/admin/customers", icon: UserCircle, hasSubMenu: true },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const bookingsSubMenu = [
    { name: "Today Booking", filter: "today" },
    { name: "Yesterday Booking", filter: "yesterday" },
    { name: "Tomorrow Booking", filter: "tomorrow" },
  ]

  const customersSubMenu = [
    { name: "Customer Bookings", href: "/admin/customers/bookings" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-500">Darbhanga Travels</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="h-5 w-5" />
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:translate-x-0"
            >
              <nav className="mt-8 px-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      {item.hasSubMenu ? (
                        <>
                          <button
                            onClick={() => {
                              if (item.name === "Bookings") {
                                setIsBookingsExpanded(!isBookingsExpanded)
                                router.push("/admin/bookings")
                              } else if (item.name === "Customers") {
                                setIsCustomersExpanded(!isCustomersExpanded)
                                router.push("/admin/customers")
                              }
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                            {((item.name === "Bookings" && isBookingsExpanded) || (item.name === "Customers" && isCustomersExpanded)) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          {isBookingsExpanded && item.name === "Bookings" && (
                            <ul className="mt-1 ml-8 space-y-1">
                              {bookingsSubMenu.map((subItem) => {
                                const isActive = searchParams?.get('date') === subItem.filter
                                return (
                                  <li key={subItem.filter}>
                                    <Link
                                      href={`/admin/bookings?date=${subItem.filter}`}
                                      className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md transition-colors ${
                                        isActive 
                                          ? 'bg-blue-100 text-blue-700 font-medium' 
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                      onClick={() => setIsSidebarOpen(false)}
                                    >
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                          {isCustomersExpanded && item.name === "Customers" && (
                            <ul className="mt-1 ml-8 space-y-1">
                              {customersSubMenu.map((subItem) => {
                                const isActive = pathname === subItem.href
                                return (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md transition-colors ${
                                        isActive 
                                          ? 'bg-blue-100 text-blue-700 font-medium' 
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                      onClick={() => setIsSidebarOpen(false)}
                                    >
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  {item.hasSubMenu ? (
                    <>
                      <button
                        onClick={() => {
                          if (item.name === "Bookings") {
                            setIsBookingsExpanded(!isBookingsExpanded)
                            router.push("/admin/bookings")
                          } else if (item.name === "Customers") {
                            setIsCustomersExpanded(!isCustomersExpanded)
                            router.push("/admin/customers")
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {((item.name === "Bookings" && isBookingsExpanded) || (item.name === "Customers" && isCustomersExpanded)) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isBookingsExpanded && item.name === "Bookings" && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {bookingsSubMenu.map((subItem) => {
                            const isActive = searchParams?.get('date') === subItem.filter
                            return (
                              <li key={subItem.filter}>
                                <Link
                                  href={`/admin/bookings?date=${subItem.filter}`}
                                  className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md transition-colors ${
                                    isActive 
                                      ? 'bg-blue-100 text-blue-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                      {isCustomersExpanded && item.name === "Customers" && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {customersSubMenu.map((subItem) => {
                            const isActive = pathname === subItem.href
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md transition-colors ${
                                    isActive 
                                      ? 'bg-blue-100 text-blue-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/admin/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_token', data.token)
        onLogin()
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Darbhanga Travels Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}















