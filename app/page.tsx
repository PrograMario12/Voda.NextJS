import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BarChart3, ListTodo, Clock, ArrowRight } from "lucide-react";
import { getDashboardStats } from "@/app/actions/projects";

// Status badge color mapping
const statusColors: Record<string, string> = {
  draft: "bg-slate-500/10 text-slate-500",
  analyzing: "bg-amber-500/10 text-amber-500",
  approved: "bg-emerald-500/10 text-emerald-500",
  backlog: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-violet-500/10 text-violet-500",
  qa: "bg-orange-500/10 text-orange-500",
  prod: "bg-teal-500/10 text-teal-500",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  analyzing: "Analyzing",
  approved: "Approved",
  backlog: "Backlog",
  in_progress: "In Progress",
  qa: "QA",
  prod: "Production",
};

export default async function Home() {
  const { total, pendingReview, inProgress, recentProjects } = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Solo Dev. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              All registered projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              Draft &amp; Analyzing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground">
              In Progress &amp; QA
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>
                {recentProjects.length > 0
                  ? `Showing the last ${recentProjects.length} projects.`
                  : "There are no recent requests. Start by creating one."}
              </CardDescription>
            </div>
            {recentProjects.length > 0 && (
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">No projects found</p>
                  <Link href="/new">
                    <Button variant="outline" size="sm">Create Project</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Priority: {project.calculatedPriority?.toFixed(2) ?? '–'}
                        {' · '}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusColors[project.status] || "bg-slate-500/10 text-slate-500"
                        }`}
                    >
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
