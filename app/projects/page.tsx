'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getProjects, updateProjectStatus, deleteProject } from '@/app/actions/projects';
import { Trash2, Loader2, FolderKanban } from 'lucide-react';
import Link from 'next/link';

type Project = {
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    businessValue: string | null;
    impactScore: number | null;
    urgencyScore: number | null;
    effortSize: string;
    calculatedPriority: number | null;
    status: string;
};

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    analyzing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    backlog: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    in_progress: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    qa: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    prod: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    analyzing: 'Analyzing',
    approved: 'Approved',
    backlog: 'Backlog',
    in_progress: 'In Progress',
    qa: 'QA',
    prod: 'Production',
};

const allStatuses = ['draft', 'analyzing', 'approved', 'backlog', 'in_progress', 'qa', 'prod'];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        setLoading(true);
        const data = await getProjects();
        setProjects(data as Project[]);
        setLoading(false);
    }

    function handleStatusChange(projectId: string, newStatus: string) {
        startTransition(async () => {
            await updateProjectStatus(projectId, newStatus as any);
            await loadProjects();
        });
    }

    function handleDelete(projectId: string) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        startTransition(async () => {
            await deleteProject(projectId);
            await loadProjects();
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your project requests.
                    </p>
                </div>
                <Link href="/new">
                    <Button>+ New Request</Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create your first project request to get started.
                        </p>
                        <Link href="/new">
                            <Button>Create Project</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <CardTitle className="text-lg">{project.title}</CardTitle>
                                        {project.description && (
                                            <CardDescription className="mt-1 line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${statusColors[project.status] || 'bg-slate-500/10 text-slate-500'
                                            }`}
                                    >
                                        {statusLabels[project.status] || project.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    <span>
                                        Priority:{' '}
                                        <strong className="text-foreground">
                                            {project.calculatedPriority?.toFixed(2) ?? '–'}
                                        </strong>
                                    </span>
                                    <span>
                                        Impact: <strong className="text-foreground">{project.impactScore ?? '–'}</strong>
                                    </span>
                                    <span>
                                        Urgency: <strong className="text-foreground">{project.urgencyScore ?? '–'}</strong>
                                    </span>
                                    <span>
                                        Effort: <strong className="text-foreground">{project.effortSize}</strong>
                                    </span>
                                    <span>
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Status:</span>
                                        <Select
                                            defaultValue={project.status}
                                            onValueChange={(val) => handleStatusChange(project.id, val)}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-[160px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allStatuses.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {statusLabels[s]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="ml-auto">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            onClick={() => handleDelete(project.id)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
