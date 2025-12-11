"use client";

import React, { useState } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { 
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  Camera,
  AlertCircle,
  Edit,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
import { authService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  stripeAccountId?: string | null;
  stripeOnboardingCompleted?: boolean;
  settings?: Record<string, any>;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [orgName, setOrgName] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      const newData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone ? formatPhoneNumber(user.phone, false) : "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      setFormData(newData);
      setOriginalData(newData);

      // Load notification settings
      const newNotifications = {
        emailAlerts: user.emailAlerts ?? false,
        marketingEmails: user.marketingEmails ?? false,
        weeklyReports: user.weeklyReports ?? false,
      };
      setNotifications(newNotifications);
      setOriginalNotifications(newNotifications);
    }
  }, [user]);

  // Fetch organization data
  React.useEffect(() => {
    const fetchOrganization = async () => {
      if (!user?.organizationId) {
        setIsLoadingOrg(false);
        return;
      }
      
      try {
        const data = await apiClient.get<Organization>(`/organizations/${user.organizationId}`);
        setOrganization(data);
        setOrgName(data.name);
      } catch (error: any) {
        // Silently handle error
      } finally {
        setIsLoadingOrg(false);
      }
    };

    fetchOrganization();
  }, [user]);

  const [notifications, setNotifications] = useState({
    emailAlerts: false,
    marketingEmails: false,
    weeklyReports: false,
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [originalNotifications, setOriginalNotifications] = useState<typeof notifications | null>(null);

  const formatPhoneNumber = (value: string, isDeleting: boolean = false) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // If deleting and the cleaned value is empty, return empty string
    if (isDeleting && cleaned.length === 0) {
      return '';
    }
    
    // Apply US phone format
    let formatted = cleaned;
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      formatted = `(${cleaned}`;
    }
    
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Get the raw numeric value
      const numericValue = value.replace(/\D/g, '');
      
      // Check if user is deleting (new value is shorter than old value)
      const isDeleting = value.length < formData.phone.length;
      
      // If deleting and the last character was a formatting character, remove more digits
      if (isDeleting) {
        const lastChar = formData.phone[formData.phone.length - 1];
        if (lastChar === ' ' || lastChar === '-' || lastChar === ')') {
          // Remove one more digit
          const shorterNumeric = numericValue.slice(0, -1);
          const formatted = formatPhoneNumber(shorterNumeric, true);
          setFormData(prev => ({
            ...prev,
            phone: formatted
          }));
          return;
        }
      }
      
      // Format normally
      const formattedPhone = formatPhoneNumber(value, isDeleting);
      setFormData(prev => ({
        ...prev,
        phone: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNotificationChange = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    
    // Update local state immediately for UI responsiveness
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));

    setIsSavingNotifications(true);
    
    try {
      // Send update to backend
      const updatedPrefs = await authService.updateNotificationPreferences({
        [key]: newValue
      });
      
      // The API returns only the notification preferences, not the full user
      
      toast({
        title: "Notification preference updated",
        description: "Your notification settings have been saved.",
        variant: "success",
      });
    } catch (error: any) {
      console.error('[Profile] Notification update error:', error);
      
      // Revert on error
      setNotifications(prev => ({
        ...prev,
        [key]: !newValue
      }));
      
      toast({
        title: "Update failed",
        description: error.error || error.message || "Failed to update notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (originalData) {
      setFormData(originalData);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure the passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-z])(?=.*[A-Z]).+$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast({
        title: "Invalid password",
        description: "Password must contain at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    
    try {
      await apiClient.post('/auth/change-password', {
        newPassword: formData.newPassword,
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.error || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOrgEdit = () => {
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setIsEditingOrg(false);
    setOrgName(organization?.name || '');
  };

  const handleOrgSave = async () => {
    if (!organization || !user) return;
    
    setIsSavingOrg(true);
    
    try {
      const updatedOrg = await apiClient.put<Organization>(
        `/organizations/${organization.id}`,
        { name: orgName }
      );
      
      setOrganization(updatedOrg);
      setIsEditingOrg(false);
      
      toast({
        title: "Organization updated",
        description: "Organization name has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.error || "Failed to update organization",
        variant: "destructive",
      });
      // Reset to original name on error
      setOrgName(organization.name);
    } finally {
      setIsSavingOrg(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Prepare the update data
      const updateData: any = {};
      
      if (formData.firstName !== originalData?.firstName) {
        updateData.firstName = formData.firstName;
      }
      
      if (formData.lastName !== originalData?.lastName) {
        updateData.lastName = formData.lastName;
      }
      
      if (formData.phone !== originalData?.phone) {
        // Strip formatting from phone number
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) {
          updateData.phone = cleanPhone;
        } else if (cleanPhone.length > 0) {
          toast({
            title: "Invalid phone number",
            description: "Phone number must be 10 digits",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      }
      
      // Only send request if there are changes
      if (Object.keys(updateData).length > 0) {
        const response = await apiClient.patch('/auth/profile', updateData);
        
        // Update the user in auth context
        await refreshUser();
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.error || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar gradient
  const getInitials = () => {
    const firstInitial = user?.firstName?.[0] || user?.email?.[0] || "U";
    const lastInitial = user?.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <MobileHeader title="Profile" />
      
      <main className="pb-20 md:pb-8 md:pt-8 min-h-full">
        <div className="md:max-w-3xl md:mx-auto px-4 md:px-4 lg:px-8 space-y-8">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {getInitials()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Member since December 2024
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h2>
              {!isEditing ? (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg transition-colors",
                      "dark:bg-gray-800 dark:border-gray-700",
                      isEditing 
                        ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                    )}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg transition-colors",
                      "dark:bg-gray-800 dark:border-gray-700",
                      isEditing 
                        ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                    )}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Locked</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 select-none">+1</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="(555) 123-4567"
                    className={cn(
                      "w-full pl-20 pr-3 py-2 border rounded-lg transition-colors",
                      "dark:bg-gray-800 dark:border-gray-700",
                      isEditing 
                        ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        : "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                    )}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">Password Requirements</p>
                    <ul className="mt-1 text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Contains at least 1 number</li>
                      <li>• Contains at least 1 special character</li>
                      <li>• Contains at least 1 uppercase letter</li>
                      <li>• Contains at least 1 lowercase letter</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={handlePasswordChange}
                disabled={!formData.newPassword || !formData.confirmPassword || isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">
                      {key === 'emailAlerts' && 'Email Alerts'}
                      {key === 'marketingEmails' && 'Marketing Emails'}
                      {key === 'weeklyReports' && 'Weekly Reports'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'emailAlerts' && 'Receive important updates via email'}
                      {key === 'marketingEmails' && 'Stay updated with our latest features and offers'}
                      {key === 'weeklyReports' && 'Get weekly summary of your business performance'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                    disabled={isSavingNotifications}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
                      isSavingNotifications && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        value ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization
              </h2>
              {user?.role === 'owner' || user?.role === 'admin' ? (
                !isEditingOrg ? (
                  <Button
                    onClick={handleOrgEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleOrgCancel}
                      variant="outline"
                      size="sm"
                      disabled={isSavingOrg}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOrgSave}
                      size="sm"
                      disabled={isSavingOrg || !orgName.trim()}
                      className="flex items-center gap-2"
                    >
                      {isSavingOrg ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </div>
                )
              ) : null}
            </div>
            
            <div className="p-6 space-y-4">
              {isLoadingOrg ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Organization Name</p>
                    {isEditingOrg ? (
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter organization name"
                      />
                    ) : (
                      <p className="font-medium">{organization?.name || 'N/A'}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Organization ID</p>
                    <p className="font-mono text-sm">{user?.organizationId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your Role</p>
                    <p className="font-medium capitalize">{user?.role || 'Owner'}</p>
                  </div>
                  
                  {organization?.createdAt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Organization Created</p>
                      <p className="font-medium">
                        {new Date(organization.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              To delete your account, please contact our support team at <a href="mailto:support@lumapos.co" className="underline font-medium">support@lumapos.co</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}