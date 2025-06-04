import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AppHeader from '@/components/app/AppHeader';

const Settings: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder handlers
  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update display name
    alert('Display name updated!');
  };
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update password
    alert('Password changed!');
  };
  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to delete account
    alert('Account deleted!');
  };
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleProfilePicUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to upload profile picture
    alert('Profile picture updated!');
  };
  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update email
    alert('Email updated!');
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-muted/50 dark:bg-background pb-16">
        <div className="container mx-auto max-w-2xl pt-12">
          <h1 className="text-4xl font-bold mb-2 text-center">Settings</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 text-center">
            Update your profile, manage your preferences, and control your account security below.
          </p>
         
          {/* Profile Picture Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfilePicUpload} className="flex flex-col gap-4 items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {profilePicUrl ? (
                      <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-gray-400">👤</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleProfilePicChange}
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Choose Image
                  </Button>
                </div>
                <Button type="submit" className="w-fit" disabled={!profilePic}>Upload</Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Display Name Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Change Display Name</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNameChange} className="flex flex-col gap-4">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter new display name" />
                <Button type="submit" className="w-fit">Update Name</Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Email Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter new email" />
                <Button type="submit" className="w-fit">Update Email</Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Password Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" />
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
                <Button type="submit" className="w-fit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Notification Preferences Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                <Label htmlFor="notifications">Enable email notifications for PDF uploads and chat responses</Label>
              </div>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Delete Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4">
                <Label htmlFor="deleteConfirm">Type <span className="font-bold">DELETE</span> to confirm</Label>
                <Input id="deleteConfirm" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
                <Button type="submit" variant="destructive" className="w-fit" disabled={deleteConfirm !== 'DELETE'}>
                  Delete Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;
