import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Mail, MessageSquare, Send, Users, Calendar, Award, AlertTriangle, CheckCircle, XCircle, Settings, Trash2, Eye, Clock, Star } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "drive" | "training" | "result" | "announcement" | "reminder" | "urgent";
  title: string;
  message: string;
  recipientType: "all" | "student" | "trainer" | "officer" | "admin" | "specific";
  recipientIds?: string[];
  priority: "low" | "medium" | "high" | "urgent";
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  sentAt?: string;
  readBy: string[];
  deliveryStatus: {
    total: number;
    delivered: number;
    failed: number;
    read: number;
  };
  metadata?: {
    driveId?: string;
    trainingId?: string;
    resultId?: string;
    actionUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationPreference {
  userId: string;
  preferences: {
    drive: { inApp: boolean; email: boolean; sms: boolean };
    training: { inApp: boolean; email: boolean; sms: boolean };
    result: { inApp: boolean; email: boolean; sms: boolean };
    announcement: { inApp: boolean; email: boolean; sms: boolean };
    reminder: { inApp: boolean; email: boolean; sms: boolean };
    urgent: { inApp: boolean; email: boolean; sms: boolean };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({});
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notificationsRes, preferencesRes] = await Promise.all([
        fetch('http://localhost:3000/notifications'),
        fetch('http://localhost:3000/notificationPreferences?userId=current_user')
      ]);

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData);
      }

      if (preferencesRes.ok) {
        const preferencesData = await preferencesRes.json();
        if (preferencesData.length > 0) {
          setPreferences(preferencesData[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch notification data");
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    try {
      const notificationToCreate = {
        ...newNotification,
        id: Date.now().toString(),
        status: "draft",
        readBy: [],
        deliveryStatus: {
          total: 0,
          delivered: 0,
          failed: 0,
          read: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationToCreate)
      });

      if (response.ok) {
        setNotifications(prev => [...prev, notificationToCreate as Notification]);
        setIsCreating(false);
        setNewNotification({});
        toast.success("Notification created successfully");
      }
    } catch (error) {
      toast.error("Failed to create notification");
    }
  };

  const sendNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      const updatedNotification = {
        ...notification,
        status: "sent",
        sentAt: new Date().toISOString(),
        deliveryStatus: {
          total: 100, // Calculate actual recipients
          delivered: 95,
          failed: 5,
          read: 0
        }
      };

      const response = await fetch(`http://localhost:3000/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotification)
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? updatedNotification : n));
        toast.success("Notification sent successfully");
      }
    } catch (error) {
      toast.error("Failed to send notification");
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      const updatedNotification = {
        ...notification,
        readBy: [...notification.readBy, 'current_user'], // Replace with actual user ID
        deliveryStatus: {
          ...notification.deliveryStatus,
          read: notification.deliveryStatus.read + 1
        }
      };

      const response = await fetch(`http://localhost:3000/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotification)
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? updatedNotification : n));
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const updatePreferences = async (preferences: NotificationPreference) => {
    try {
      const response = await fetch(`http://localhost:3000/notificationPreferences/${preferences.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, updatedAt: new Date().toISOString() })
      });

      if (response.ok) {
        setPreferences(preferences);
        toast.success("Preferences updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'drive': return <Calendar className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'result': return <Award className="h-4 w-4" />;
      case 'announcement': return <Bell className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Send className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="space-y-4">
            {notifications
              .filter(n => n.status === 'sent' && !n.readBy.includes('current_user'))
              .map(notification => (
                <Card key={notification.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline">{notification.type}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Sent: {new Date(notification.sentAt || notification.createdAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>{notification.deliveryStatus.read}/{notification.deliveryStatus.total} read</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedNotification(notification)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {notifications.filter(n => n.status === 'sent' && !n.readBy.includes('current_user')).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No New Notifications</h3>
                  <p className="text-gray-600">You're all caught up!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <div className="space-y-4">
            {notifications
              .filter(n => n.status === 'sent')
              .map(notification => (
                <Card key={notification.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                            <Badge variant="outline">{notification.type}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Sent: {new Date(notification.sentAt || notification.createdAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>Delivery: {notification.deliveryStatus.delivered}/{notification.deliveryStatus.total}</span>
                            <span>•</span>
                            <span>Read: {notification.deliveryStatus.read}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedNotification(notification)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            {notifications
              .filter(n => n.status === 'scheduled')
              .map(notification => (
                <Card key={notification.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                            <Badge variant="outline">{notification.type}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Scheduled for: {new Date(notification.scheduledAt || '').toLocaleString()}</span>
                            <span>•</span>
                            <span>Recipients: {notification.recipientType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => sendNotification(notification.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          Send Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {notifications.filter(n => n.status === 'scheduled').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Scheduled Notifications</h3>
                  <p className="text-gray-600">Scheduled notifications will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
                <CardDescription>Pre-defined notification templates for common scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <h4 className="font-semibold">New Drive Announcement</h4>
                    </div>
                    <p className="text-sm text-gray-600">Notify students about new placement drives</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <h4 className="font-semibold">Training Reminder</h4>
                    </div>
                    <p className="text-sm text-gray-600">Remind students about upcoming training sessions</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <h4 className="font-semibold">Results Announcement</h4>
                    </div>
                    <p className="text-sm text-gray-600">Announce drive results and selections</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h4 className="font-semibold">Urgent Alert</h4>
                    </div>
                    <p className="text-sm text-gray-600">Send urgent notifications to all users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {preferences && (
                <>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Notification Channels</h4>
                    {Object.entries(preferences.preferences).map(([type, channels]) => (
                      <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h5 className="font-medium capitalize">{type} Notifications</h5>
                          <p className="text-sm text-gray-600">Choose how to receive {type} notifications</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <Switch
                              checked={channels.inApp}
                              onCheckedChange={(checked) => {
                                const updatedPreferences = {
                                  ...preferences,
                                  preferences: {
                                    ...preferences.preferences,
                                    [type]: { ...channels, inApp: checked }
                                  }
                                };
                                updatePreferences(updatedPreferences);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Switch
                              checked={channels.email}
                              onCheckedChange={(checked) => {
                                const updatedPreferences = {
                                  ...preferences,
                                  preferences: {
                                    ...preferences.preferences,
                                    [type]: { ...channels, email: checked }
                                  }
                                };
                                updatePreferences(updatedPreferences);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <Switch
                              checked={channels.sms}
                              onCheckedChange={(checked) => {
                                const updatedPreferences = {
                                  ...preferences,
                                  preferences: {
                                    ...preferences.preferences,
                                    [type]: { ...channels, sms: checked }
                                  }
                                };
                                updatePreferences(updatedPreferences);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Quiet Hours</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Enable Quiet Hours</h5>
                        <p className="text-sm text-gray-600">Limit notifications during specific hours</p>
                      </div>
                      <Switch
                        checked={preferences.quietHours.enabled}
                        onCheckedChange={(checked) => {
                          const updatedPreferences = {
                            ...preferences,
                            quietHours: { ...preferences.quietHours, enabled: checked }
                          };
                          updatePreferences(updatedPreferences);
                        }}
                      />
                    </div>
                    {preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={preferences.quietHours.startTime}
                            onChange={(e) => {
                              const updatedPreferences = {
                                ...preferences,
                                quietHours: { ...preferences.quietHours, startTime: e.target.value }
                              };
                              updatePreferences(updatedPreferences);
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={preferences.quietHours.endTime}
                            onChange={(e) => {
                              const updatedPreferences = {
                                ...preferences,
                                quietHours: { ...preferences.quietHours, endTime: e.target.value }
                              };
                              updatePreferences(updatedPreferences);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Notification Modal */}
      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Notification</DialogTitle>
              <DialogDescription>Send a notification to users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drive">Drive</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="result">Result</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={newNotification.title || ''}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={newNotification.message || ''}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>

              <div>
                <Label>Recipients</Label>
                <Select onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, recipientType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="trainer">Trainers</SelectItem>
                    <SelectItem value="officer">Placement Officers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Delivery Channels</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Switch
                      checked={newNotification.channels?.inApp ?? true}
                      onCheckedChange={(checked) => setNewNotification(prev => ({
                        ...prev,
                        channels: { ...prev.channels, inApp: checked }
                      }))}
                    />
                    <span>In-App</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Switch
                      checked={newNotification.channels?.email ?? false}
                      onCheckedChange={(checked) => setNewNotification(prev => ({
                        ...prev,
                        channels: { ...prev.channels, email: checked }
                      }))}
                    />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Switch
                      checked={newNotification.channels?.sms ?? false}
                      onCheckedChange={(checked) => setNewNotification(prev => ({
                        ...prev,
                        channels: { ...prev.channels, sms: checked }
                      }))}
                    />
                    <span>SMS</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={createNotification}>Create Notification</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
