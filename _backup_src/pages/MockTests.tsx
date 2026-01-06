import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Clock, 
  Users, 
  Award, 
  Play, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Target,
  BookOpen,
  Brain,
  Timer,
  Star,
  Download,
  Eye,
  Plus,
  Trophy
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "coding";
  category: "aptitude" | "technical" | "reasoning" | "verbal" | "coding";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
  timeLimit?: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  category: "aptitude" | "technical" | "reasoning" | "verbal" | "coding" | "psychometric";
  type: "practice" | "assessment" | "mock_drive";
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  questions: Question[];
  instructions: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  timeTaken: number;
  startedAt: string;
  completedAt: string;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  categoryScores: Record<string, number>;
  rank?: number;
  percentile?: number;
}

interface Leaderboard {
  testId: string;
  testTitle: string;
  entries: Array<{
    rank: number;
    studentId: string;
    studentName: string;
    score: number;
    percentage: number;
    timeTaken: number;
    completedAt: string;
  }>;
  totalParticipants: number;
}

export default function MockTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [newTest, setNewTest] = useState<Partial<Test>>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && isTakingTest) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isTakingTest) {
      submitTest();
    }
  }, [timeRemaining, isTakingTest]);

  const fetchData = async () => {
    try {
      const [testsRes, resultsRes, leaderboardsRes] = await Promise.all([
        fetch('http://localhost:3000/tests'),
        fetch('http://localhost:3000/testResults?studentId=current_user'),
        fetch('http://localhost:3000/leaderboards')
      ]);

      if (testsRes.ok) {
        const testsData = await testsRes.json();
        setTests(testsData);
      }

      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setResults(resultsData);
      }

      if (leaderboardsRes.ok) {
        const leaderboardsData = await leaderboardsRes.json();
        setLeaderboards(leaderboardsData);
      }
    } catch (error) {
      toast.error("Failed to fetch test data");
    } finally {
      setLoading(false);
    }
  };

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setIsTakingTest(true);
    setCurrentQuestion(0);
    setTestAnswers({});
    setTestStartTime(new Date());
    setTimeRemaining(test.duration * 60);
  };

  const submitTest = async () => {
    if (!selectedTest || !testStartTime) return;

    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - testStartTime.getTime()) / 1000);

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedQuestions = 0;
    let totalScore = 0;
    const categoryScores: Record<string, number> = {};

    const answers = selectedTest.questions.map(question => {
      const userAnswer = testAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer.toString();
      
      if (!userAnswer) {
        skippedQuestions++;
      } else if (isCorrect) {
        correctAnswers++;
        totalScore += question.points;
        categoryScores[question.category] = (categoryScores[question.category] || 0) + question.points;
      } else {
        wrongAnswers++;
      }

      return {
        questionId: question.id,
        answer: userAnswer || '',
        isCorrect,
        timeSpent: 0
      };
    });

    const result: TestResult = {
      id: Date.now().toString(),
      testId: selectedTest.id,
      studentId: 'current_user',
      studentName: 'Current Student',
      score: totalScore,
      totalPoints: selectedTest.totalPoints,
      percentage: Math.round((totalScore / selectedTest.totalPoints) * 100),
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      timeTaken,
      startedAt: testStartTime.toISOString(),
      completedAt: endTime.toISOString(),
      answers,
      categoryScores
    };

    try {
      const response = await fetch('http://localhost:3000/testResults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });

      if (response.ok) {
        setResults(prev => [...prev, result]);
        setIsTakingTest(false);
        setSelectedTest(null);
        toast.success("Test submitted successfully!");
      }
    } catch (error) {
      toast.error("Failed to submit test");
    }
  };

  const createTest = async () => {
    try {
      const testToCreate = {
        ...newTest,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'current_user',
        totalPoints: newTest.questions?.reduce((sum, q) => sum + q.points, 0) || 0,
        totalQuestions: newTest.questions?.length || 0
      };

      const response = await fetch('http://localhost:3000/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testToCreate)
      });

      if (response.ok) {
        setTests(prev => [...prev, testToCreate as Test]);
        setIsCreatingTest(false);
        setNewTest({});
        toast.success("Test created successfully");
      }
    } catch (error) {
      toast.error("Failed to create test");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aptitude': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'reasoning': return 'bg-green-100 text-green-800';
      case 'verbal': return 'bg-orange-100 text-orange-800';
      case 'coding': return 'bg-red-100 text-red-800';
      case 'psychometric': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isTakingTest && selectedTest) {
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{selectedTest.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className={`font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button variant="outline" onClick={() => submitTest()}>
                Submit Test
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {selectedTest.questions.length}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryColor(question.category)}>
                  {question.category}
                </Badge>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <span className="text-sm text-gray-600">{question.points} points</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            </div>

            {question.type === 'multiple_choice' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={testAnswers[question.id] === option}
                      onChange={(e) => setTestAnswers(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <label key={option} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={testAnswers[question.id] === option}
                      onChange={(e) => setTestAnswers(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'short_answer' && (
              <Textarea
                value={testAnswers[question.id] || ''}
                onChange={(e) => setTestAnswers(prev => ({
                  ...prev,
                  [question.id]: e.target.value
                }))}
                placeholder="Enter your answer..."
                rows={4}
              />
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentQuestion(Math.min(selectedTest.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === selectedTest.questions.length - 1}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mock Tests & Assessments</h1>
        <Button onClick={() => setIsCreatingTest(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Tests</TabsTrigger>
          <TabsTrigger value="my-results">My Results</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid gap-6">
            {tests.map(test => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{test.title}</h3>
                        <Badge className={getCategoryColor(test.category)}>
                          {test.category}
                        </Badge>
                        <Badge variant="outline">{test.type}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{test.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{test.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>{test.totalPoints} points</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button onClick={() => startTest(test)}>
                        <Play className="h-4 w-4 mr-1" />
                        Start Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tests.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tests Available</h3>
                  <p className="text-gray-600">Tests will appear here once created</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-results">
          <div className="space-y-4">
            {results.map(result => {
              const test = tests.find(t => t.id === result.testId);
              return (
                <Card key={result.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{test?.title || 'Unknown Test'}</h3>
                        <p className="text-sm text-gray-600">
                          Completed: {new Date(result.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{result.percentage}%</div>
                        <Badge variant={result.percentage >= 70 ? 'default' : result.percentage >= 50 ? 'secondary' : 'destructive'}>
                          {result.percentage >= 70 ? 'Excellent' : result.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-600">Score</Label>
                        <p className="font-medium">{result.score}/{result.totalPoints}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Correct</Label>
                        <p className="font-medium text-green-600">{result.correctAnswers}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Wrong</Label>
                        <p className="font-medium text-red-600">{result.wrongAnswers}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Skipped</Label>
                        <p className="font-medium text-gray-600">{result.skippedQuestions}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Time Taken</Label>
                        <p className="font-medium">{formatTime(result.timeTaken)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {result.rank && (
                          <Badge variant="outline">Rank: #{result.rank}</Badge>
                        )}
                        {result.percentile && (
                          <Badge variant="outline">Percentile: {result.percentile}%</Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {results.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Test Results</h3>
                  <p className="text-gray-600">Your test results will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboards">
          <div className="space-y-6">
            {leaderboards.map(leaderboard => (
              <Card key={leaderboard.testId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {leaderboard.testTitle}
                  </CardTitle>
                  <CardDescription>
                    {leaderboard.totalParticipants} participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.entries.slice(0, 10).map((entry, index) => (
                      <div key={entry.studentId} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <p className="font-medium">{entry.studentName}</p>
                            <p className="text-sm text-gray-600">{formatTime(entry.timeTaken)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{entry.percentage}%</p>
                          <p className="text-sm text-gray-600">{entry.score} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Your test performance trends and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
                  <p className="text-gray-600">Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Test Modal */}
      {isCreatingTest && (
        <Dialog open={isCreatingTest} onOpenChange={setIsCreatingTest}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Test</DialogTitle>
              <DialogDescription>Create a custom test for students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Test Title</Label>
                  <Input
                    value={newTest.title || ''}
                    onChange={(e) => setNewTest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter test title"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select onValueChange={(value: any) => setNewTest(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aptitude">Aptitude</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="reasoning">Reasoning</SelectItem>
                      <SelectItem value="verbal">Verbal</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="psychometric">Psychometric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTest.description || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the test..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newTest.duration || ''}
                    onChange={(e) => setNewTest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(value: any) => setNewTest(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="mock_drive">Mock Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingTest(false)}>Cancel</Button>
                <Button onClick={createTest}>Create Test</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
