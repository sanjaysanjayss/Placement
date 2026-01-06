import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, GraduationCap, Building2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
}

const UserList = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const currentUser = userStr ? JSON.parse(userStr) : null;

        if (!currentUser || currentUser.role !== "officer") {
            setUsers([]); // Clear users or keep empty
            setLoading(false);
            return;
        }

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    }, []);

    const getIcon = (role: string) => {
        switch (role) {
            case "student":
                return <GraduationCap className="h-5 w-5" />;
            case "officer":
                return <Building2 className="h-5 w-5" />;
            case "trainer":
                return <BookOpen className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="mb-8 text-3xl font-bold">Registered Users</h1>
            {loading ? (
                <p>Loading users...</p>
            ) : (!JSON.parse(localStorage.getItem("user") || "null") || JSON.parse(localStorage.getItem("user") || "null").role !== "officer") ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                    <p className="text-muted-foreground mt-2">Only Placement Officers can view the registered users list.</p>
                    <Button asChild className="mt-4">
                        <Link to="/">Go Home</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Link key={user.id} to={`/users/${user.id}`}>
                            <Card className="h-full transition-shadow hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        {getIcon(user.role)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{user.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <p className="text-xs text-muted-foreground mt-1">ID: {user.id}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {users.length === 0 && <p>No users found. Register some users first!</p>}
                </div>
            )}
            <div className="mt-8">
                <Button asChild>
                    <Link to="/register">Register New User</Link>
                </Button>
            </div>
        </div>
    );
};

export default UserList;
