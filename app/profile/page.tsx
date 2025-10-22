'use client';

import { useState, useEffect } from 'react';
import { profileService } from '@/lib/profile-service';
import { UserProfile, UpdateProfileData, ChangePasswordData, LANGUAGES } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Lock, Bell, Upload, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { TIMEZONES } from '@/types/company-settings';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    approval_notifications: true,
    rejection_notifications: true,
    reminder_notifications: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setProfileForm({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
      });
      setNotificationPrefs(data.notification_preferences);
      if (data.avatar) {
        setAvatarPreview(data.avatar);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await profileService.updateProfile(profileForm);
      toast.success('Perfil actualizado exitosamente');
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      setLoading(true);
      await profileService.changePassword(passwordForm);
      toast.success('Contraseña cambiada exitosamente');
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setLoading(true);
      await profileService.uploadAvatar(avatarFile);
      toast.success('Avatar actualizado exitosamente');
      setAvatarFile(null);
      loadProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al subir avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setLoading(true);
      await profileService.deleteAvatar();
      toast.success('Avatar eliminado exitosamente');
      setAvatarPreview(null);
      loadProfile();
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Error al eliminar avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPrefsUpdate = async () => {
    try {
      setLoading(true);
      await profileService.updateNotificationPreferences(notificationPrefs);
      toast.success('Preferencias actualizadas exitosamente');
      loadProfile();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Error al actualizar preferencias');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-blue-100">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                {profile.role === 'admin' ? 'Administrador' : profile.role === 'manager' ? 'Manager' : 'Empleado'}
              </span>
              {profile.company_name && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                  {profile.company_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Avatar Card */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Foto de Perfil
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    JPG, PNG o GIF. Max 2MB.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile || loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir
                  </Button>
                  {avatarPreview && (
                    <Button
                      onClick={handleAvatarDelete}
                      disabled={loading}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Profile Info Card */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Información Personal
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                  />
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </Card>
          </div>

          {/* Additional Settings */}
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Preferencias</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select defaultValue={profile.timezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue={profile.language}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 shadow-lg max-w-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Cambiar Contraseña
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Contraseña Actual</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Nueva Contraseña</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password_confirmation">Confirmar Nueva Contraseña</Label>
                <Input
                  id="new_password_confirmation"
                  type="password"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Lock className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 shadow-lg max-w-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Preferencias de Notificaciones
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones en tu correo electrónico</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_notifications}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({ ...notificationPrefs, email_notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones Push</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones push en el navegador</p>
                </div>
                <Switch
                  checked={notificationPrefs.push_notifications}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({ ...notificationPrefs, push_notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Aprobación</Label>
                  <p className="text-sm text-gray-500">Cuando tus registros sean aprobados</p>
                </div>
                <Switch
                  checked={notificationPrefs.approval_notifications}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({ ...notificationPrefs, approval_notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Rechazo</Label>
                  <p className="text-sm text-gray-500">Cuando tus registros sean rechazados</p>
                </div>
                <Switch
                  checked={notificationPrefs.rejection_notifications}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({ ...notificationPrefs, rejection_notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios</Label>
                  <p className="text-sm text-gray-500">Recordatorios de fichajes y pendientes</p>
                </div>
                <Switch
                  checked={notificationPrefs.reminder_notifications}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({ ...notificationPrefs, reminder_notifications: checked })
                  }
                />
              </div>

              <Button
                onClick={handleNotificationPrefsUpdate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Preferencias
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
