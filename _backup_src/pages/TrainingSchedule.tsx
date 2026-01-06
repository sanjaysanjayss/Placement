import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, MapPin, Video, FileText, Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  type: "aptitude" | "technical" | "softskills" | "mockinterview";
  mode: "online" | "offline";
  trainer: {
    id: string;
    name: string;
    email: string;
    expertise: string[];
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
  };
  location?: string;
  meetingLink?: string;
  targetAudience: {
    departments: string[];
    batches: string[];
    minCGPA?: number;
    maxBacklogs?: number;
  };
  capacity: {
    maxStudents: number;
    registeredStudents: number;
  };
  materials: {
    slides?: string;
    recordings?: string;
    assignments?: string[];
    resources?: string[];
  };
  attendance: {
    totalStudents: number;
    present: number;
    absent: number;
    records: Array<{
      studentId: string;
      studentName: string;
      status: "present" | "absent" | "late";
      checkInTime?: string;
    }>;
  };
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  feedback: {
    averageRating: number;
    responses: number;
    comments?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function TrainingSchedule() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [newSession, setNewSession] = useState<Partial<TrainingSession>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, trainersRes] = await Promise.all([
        fetch('http://localhost:3000/trainingSessions'),
        fetch('http://localhost:3000/trainers')
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      if (trainersRes.ok) {
        const trainersData = await trainersRes.json();
        setTrainers(trainersData);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const sessionToCreate = {
        ...newSession,
        id: Date.now().toString(),
        status: "scheduled",
        capacity: {
          maxStudents: newSession.capacity?.maxStudents || 50,
          registeredStudents: 0
        },
        attendance: {
          totalStudents: 0,
          present: 0,
          absent: 0,
          records: []
        },
        feedback: {
          averageRating: 0,
          responses: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/trainingSessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionToCreate)
      });

      if (response.ok) {
        setSessions(prev => [...prev, sessionToCreate as TrainingSession]);
        setIsCreating(false);
        setNewSession({});
        toast.success("Training session created successfully");
      }
    } catch (error) {
      toast.error("Failed to create session");
    }
  };

  const handleUpdateAttendance = async (sessionId: string, studentId: string, status: "present" | "absent" | "late") => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const updatedRecords = session.attendance.records.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      );

      const updatedSession = {
        ...session,
        attendance: {
          ...session.attendance,
          records: updatedRecords,
          present: updatedRecords.filter(r => r.status === "present").length,
          absent: updatedRecords.filter(r => r.status === "absent").length
        }
      };

      const response = await fetch(`http://localhost:3000/trainingSessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSession)
      });

      if (response.ok) {
        setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
        toast.success("Attendance updated");
      }
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'aptitude': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'softskills': return 'bg-purple-100 text-purple-800';
      case 'mockinterview': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Training Schedule</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Session
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-4">
            {sessions
              .filter(session => session.status === 'scheduled')
              .map(session => (
                <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{session.title}</h3>
                          <Badge className={getSessionTypeColor(session.type)}>
                            {session.type}
                          </Badge>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{session.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(session.schedule.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{session.schedule.startTime} - {session.schedule.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{session.trainer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.mode === 'online' ? (
                          <Video className="h-4 w-4 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{session.mode === 'online' ? 'Online' : session.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Capacity: {session.capacity.registeredStudents}/{session.capacity.maxStudents}
                        </span>
                        <span className="text-sm text-gray-600">
                          Target: {session.targetAudience.departments.join(', ')}
                        </span>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {sessions.filter(s => s.status === 'scheduled').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Sessions</h3>
                  <p className="text-gray-600">Create a new training session to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ongoing">
          <div className="grid gap-4">
            {sessions
              .filter(session => session.status === 'ongoing')
              .map(session => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{session.title}</h3>
                        <p className="text-gray-600">{session.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ongoing</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{session.trainer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{session.schedule.startTime} - {session.schedule.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Present: {session.attendance.present}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Registered: {session.capacity.registeredStudents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {sessions.filter(s => s.status === 'ongoing').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Ongoing Sessions</h3>
                  <p className="text-gray-600">No training sessions are currently in progress</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {sessions
              .filter(session => session.status === 'completed')
              .map(session => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{session.title}</h3>
                        <p className="text-gray-600">{session.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                        <span className="text-sm text-gray-600">
                          ⭐ {session.feedback.averageRating.toFixed(1)} ({session.feedback.responses} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(session.schedule.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{session.trainer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Attendance: {session.attendance.present}/{session.attendance.totalStudents}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>{session.materials.recordings ? 'Recording available' : 'No recording'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {sessions.filter(s => s.status === 'completed').length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Completed Sessions</h3>
                  <p className="text-gray-600">Completed training sessions will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Training Calendar</CardTitle>
              <CardDescription>Monthly view of all training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                <p className="text-gray-600">Full calendar integration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Session Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Training Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Session Title</Label>
                  <Input
                    value={newSession.title || ''}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Aptitude Training - Quantitative Aptitude"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(value: "aptitude" | "technical" | "softskills" | "mockinterview") => setNewSession(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aptitude">Aptitude</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="softskills">Soft Skills</SelectItem>
                      <SelectItem value="mockinterview">Mock Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newSession.description || ''}
                  onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the training session..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newSession.schedule?.date || ''}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, date: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select onValueChange={(value: "online" | "offline") => setNewSession(prev => ({ ...prev, mode: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newSession.schedule?.startTime || ''}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, startTime: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newSession.schedule?.endTime || ''}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, endTime: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Trainer</Label>
                  <Select onValueChange={(value) => {
                    const trainer = trainers.find(t => t.id === value);
                    setNewSession(prev => ({ ...prev, trainer }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.name} - {trainer.expertise?.join(', ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Max Students</Label>
                  <Input
                    type="number"
                    value={newSession.capacity?.maxStudents || ''}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      capacity: { ...prev.capacity, maxStudents: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleCreateSession}>Create Session</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
