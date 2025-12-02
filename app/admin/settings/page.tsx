"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Save, 
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
// import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Setting {
  id: number
  setting_key: string
  setting_value: string
  description: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.setting_key === key 
        ? { ...setting, setting_value: value }
        : setting
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings.php', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        toast({
          title: "Settings Saved! ✅",
          description: "Your settings have been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.setting_key === key)
    return setting?.setting_value || ''
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill all password fields.",
        variant: "destructive"
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)
    try {
      const token = localStorage.getItem('user_token') || localStorage.getItem('admin_token')
      const response = await fetch('/api/user/change-password.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Password Changed! ✅",
          description: "Your password has been updated successfully.",
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to change password. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your application settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={getSettingValue('company_name')}
                onChange={(e) => handleSettingChange('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company_phone"
                  value={getSettingValue('company_phone')}
                  onChange={(e) => handleSettingChange('company_phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="company_email"
                type="email"
                value={getSettingValue('company_email')}
                onChange={(e) => handleSettingChange('company_email', e.target.value)}
                placeholder="Enter email address"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="company_address"
                value={getSettingValue('company_address')}
                onChange={(e) => handleSettingChange('company_address', e.target.value)}
                placeholder="Enter company address"
                className="pl-10 min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="booking_email">Booking Notification Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="booking_email"
                type="email"
                value={getSettingValue('booking_email')}
                onChange={(e) => handleSettingChange('booking_email', e.target.value)}
                placeholder="Enter booking email"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="current_password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="new_password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirm_password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            onClick={handlePasswordChange} 
            disabled={isChangingPassword}
            className="w-full"
          >
            {isChangingPassword ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Send email notifications for new bookings</p>
            </div>
            <Switch id="email_notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto_confirm">Auto Confirm Bookings</Label>
              <p className="text-sm text-gray-600">Automatically confirm bookings without manual approval</p>
            </div>
            <Switch id="auto_confirm" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}













