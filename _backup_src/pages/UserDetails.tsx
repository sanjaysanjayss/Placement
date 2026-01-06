import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User, GraduationCap, Building2, BookOpen, ArrowLeft, Mail, Calendar, Camera, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    avatar?: string;
    createdAt: string;
}

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<UserType>>({});

    // Check if logged in user is the same as profile user
    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const isOwnProfile = currentUser && currentUser.id === id;

    useEffect(() => {
        fetch(`http://localhost:3000/users/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setEditData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                setLoading(false);
            });
    }, [id]);

    const getIcon = (role: string) => {
        switch (role) {
            case "student":
                return <GraduationCap className="h-12 w-12" />;
            case "officer":
                return <Building2 className="h-12 w-12" />;
            case "trainer":
                return <BookOpen className="h-12 w-12" />;
            default:
                return <User className="h-12 w-12" />;
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editData.name,
                    department: editData.department,
                    avatar: editData.avatar,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
                toast.success("Profile updated successfully!");

                // Update local storage if it's the current user
                if (isOwnProfile) {
                    const newUserData = { ...currentUser, ...updatedUser };
                    localStorage.setItem("user", JSON.stringify(newUserData));
                    // Force refresh to update header avatar if we had one
                    window.dispatchEvent(new Event("storage"));
                }
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating profile");
        }
    };

    if (loading) return <div className="container py-10">Loading...</div>;
    if (!user) return <div className="container py-10">User not found</div>;

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                <Button asChild variant="ghost">
                    <Link to="/users">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                    </Link>
                </Button>
                {isOwnProfile && !isEditing && (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-col items-center gap-4 border-b pb-6 relative">
                    {isEditing ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-2 border-primary/20">
                                    <AvatarImage src={editData.avatar} />
                                    <AvatarFallback className="bg-primary/10">
                                        {getIcon(user.role)}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Camera className="h-4 w-4" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <span className="text-xs text-muted-foreground">Click camera to upload</span>
                        </div>
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border-2 border-primary/20">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                getIcon(user.role)
                            )}
                        </div>
                    )}

                    <div className="text-center w-full">
                        {isEditing ? (
                            <div className="space-y-2 w-full max-w-xs mx-auto">
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Your Name"
                                    className="text-center font-bold text-lg"
                                />
                            </div>
                        ) : (
                            <CardTitle className="text-3xl mb-2">{user.name}</CardTitle>
                        )}
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize mt-2">
                            {user.role}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Email Address</p>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div className="w-full">
                            <p className="text-sm font-medium">Department</p>
                            {isEditing ? (
                                <div className="mt-1">
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={editData.department || ""}
                                        onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AIDS", "BME", "FT", "AGRI"].map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{user.department || "Not assigned"}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Member Since</p>
                            <p className="text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setEditData(user);
                            }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">About This User</h3>
                        <p className="text-sm text-muted-foreground">
                            This is a registered student of Sri Shakthi Institute of Engineering and Technology.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetails;
