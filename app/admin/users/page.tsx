"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Key,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  id: number
  username: string
  email: string
  full_name: string
  phone: string
  is_active: boolean
  created_at: string
  total_bookings: number
  total_spent: number
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [userPassword, setUserPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/users.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const normalizedUsers = (data.users || []).map((user: any) => ({
          ...user,
          is_active: user.is_active === 1 || user.is_active === '1',
          total_bookings: Number(user.total_bookings) || 0,
          total_spent: Number(user.total_spent) || 0,
        }))
        setUsers(normalizedUsers)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      )
    }

    setFilteredUsers(filtered)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowPassword(false)
    setFormData({
      username: '',
      password: '',
      email: '',
      full_name: '',
      phone: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowPassword(false)
    setFormData({
      username: user.username,
      password: '',
      email: user.email || '',
      full_name: user.full_name || '',
      phone: user.phone || ''
    })
    setIsDialogOpen(true)
  }

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingUser 
        ? `/api/admin/users.php?id=${editingUser.id}`
        : '/api/admin/users.php'
      
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData

      // Remove empty password for updates
      if (editingUser && !formData.password) {
        delete body.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingUser ? "User updated successfully" : "User created successfully",
        })
        setIsDialogOpen(false)
        fetchUsers()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to save user",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive"
      })
    }
  }

  const handleViewUser = async (user: User) => {
    setViewingUser(user)
    setShowPassword(false)
    setUserPassword('Loading...')
    
    // Fetch user details including password
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users.php?id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('User data received:', data) // Debug log
        if (data.user) {
          // Show the actual hashed password from database
          const password = data.user.password || data.user.password_hash || null
          if (password) {
            setUserPassword(password)
          } else {
            setUserPassword('No password set')
          }
        } else {
          setUserPassword('User data not found')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error fetching user:', errorData)
        setUserPassword('Error loading password')
      }
    } catch (error) {
      console.error('Error in handleViewUser:', error)
      setUserPassword('Error loading password')
    }
    
    setIsViewDialogOpen(true)
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users.php?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Create and manage user accounts for ticket booking</p>
        </div>
        <Button onClick={handleCreateUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by username, name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">{user.username}</h3>
                            {user.is_active ? (
                              <Badge className="bg-green-600 text-white border-0">Active</Badge>
                            ) : (
                              <Badge className="bg-red-600 text-white border-0">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            {user.full_name || 'No name'} • ID: #{user.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {user.email && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            Created {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">
                          {user.total_bookings || 0}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Total Bookings</div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xl font-bold text-green-600">
                          ₹{(user.total_spent || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Total Spent</div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search to see more results."
                  : "No users have been created yet."}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create First User
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Update user information. Leave password empty to keep current password.'
                : 'Create a new user account. The user can login with this username and password.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">
                Password {editingUser ? '(leave empty to keep current)' : '*'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                  required={!editingUser}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user account
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">User ID</Label>
                  <p className="font-semibold text-gray-900">#{viewingUser.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div>
                    {viewingUser.is_active ? (
                      <Badge className="bg-green-600 text-white border-0">Active</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white border-0">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Username</Label>
                <p className="font-semibold text-gray-900">{viewingUser.username}</p>
              </div>

              <div>
                <Label className="text-gray-600">Full Name</Label>
                <p className="font-semibold text-gray-900">{viewingUser.full_name || 'Not provided'}</p>
              </div>

              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="font-semibold text-gray-900">{viewingUser.email || 'Not provided'}</p>
              </div>

              <div>
                <Label className="text-gray-600">Phone</Label>
                <p className="font-semibold text-gray-900">{viewingUser.phone || 'Not provided'}</p>
              </div>

              <div>
                <Label className="text-gray-600">Current Password (Hashed)</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={userPassword}
                    readOnly
                    className="pr-10 bg-gray-50 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This is the hashed password stored in the database. Use eye icon to view.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-gray-600">Total Bookings</Label>
                  <p className="font-semibold text-blue-600 text-xl">{viewingUser.total_bookings || 0}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Total Spent</Label>
                  <p className="font-semibold text-green-600 text-xl">
                    ₹{(viewingUser.total_spent || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Account Created</Label>
                <p className="font-semibold text-gray-900">
                  {new Date(viewingUser.created_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {viewingUser && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                handleEditUser(viewingUser)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}







