"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar
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
import { Label } from "@/components/ui/label"

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  address: string
  created_at: string
  total_bookings: number
  total_spent: number
}

export default function CustomersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/customers.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setCustomers(result.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCustomers(filtered)
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setFormData({ name: '', phone: '', email: '', address: '' })
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || ''
    })
    setIsDialogOpen(true)
  }

  const handleSaveCustomer = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const method = editingCustomer ? 'PUT' : 'POST'
      const payload = editingCustomer 
        ? { ...formData, id: editingCustomer.id }
        : formData

      const response = await fetch('/api/admin/customers.php', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || `Customer ${editingCustomer ? 'updated' : 'created'} successfully`
        })
        setIsDialogOpen(false)
        fetchCustomers()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to save customer:', error)
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive"
      })
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/customers.php', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: customerId })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Customer deleted successfully"
        })
        fetchCustomers()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + (c.total_bookings || 0), 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-400">
              <CardHeader className="pb-3 bg-gray-50 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {customer.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-600 text-white border-0 text-xs">
                          {customer.total_bookings || 0} bookings
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">{customer.phone || 'N/A'}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700 font-medium truncate">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700 font-medium">{customer.address}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-gray-700">Total Spent</span>
                    <span className="font-bold text-lg text-green-600">
                      ₹{(customer.total_spent || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No customers found</p>
            <Button onClick={handleAddCustomer} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add First Customer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer 
                ? 'Update customer information' 
                : 'Enter customer details to create a new customer'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


