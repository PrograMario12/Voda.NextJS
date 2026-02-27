import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Request</h1>
        <p className="text-muted-foreground">
          Submit a new feature or project idea for evaluation.
        </p>
      </div>
      <div className="py-4">
        <ProjectForm />
      </div>
    </div>
  );
}
