'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePriority } from '@/lib/priority-calculator';
import { EffortSize } from '@/types';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  business_value: z.string().min(5, {
    message: 'Please describe the business value (at least 5 characters).',
  }),
  impact_score: z.coerce.number().min(1).max(5),
  urgency_score: z.coerce.number().min(1).max(5),
  effort_size: z.enum(['S', 'M', 'L', 'XL'] as const),
});

export function ProjectForm() {
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      business_value: '',
      impact_score: 3,
      urgency_score: 3,
      effort_size: 'M',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is where we would save to Supabase
    const priority = calculatePriority(
      values.impact_score,
      values.urgency_score,
      values.effort_size as EffortSize
    );

    setCalculatedScore(priority);

    console.log('Form Submitted:', { ...values, calculated_priority: priority });
    alert(`Project Submitted! Calculated Priority: ${priority}`);
  }

  // Watch values for live calculation preview if desired,
  // or just calculate on change. Here we calculate on submit as requested,
  // but let's show a preview as well.
  const impact = form.watch('impact_score');
  const urgency = form.watch('urgency_score');
  const effort = form.watch('effort_size');

  const currentPriority = calculatePriority(
    Number(impact) || 1,
    Number(urgency) || 1,
    (effort as EffortSize) || 'M'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Define the scope and value of the new project or feature.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Implement Dark Mode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the task..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Value</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Why is this important? Who does it help?"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scoring</CardTitle>
                <CardDescription>
                  Rate the impact, urgency, and effort to calculate priority.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="impact_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact (1-5)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="impact-trigger">
                            <SelectValue placeholder="Select impact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((val) => (
                            <SelectItem key={val} value={val.toString()}>
                              {val} - {val === 1 ? 'Low' : val === 5 ? 'High' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        User/Business impact.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency (1-5)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="urgency-trigger">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((val) => (
                            <SelectItem key={val} value={val.toString()}>
                              {val} - {val === 1 ? 'Low' : val === 5 ? 'Critical' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Time sensitivity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effort_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effort</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="effort-trigger">
                            <SelectValue placeholder="Select effort" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="S">S (1)</SelectItem>
                          <SelectItem value="M">M (3)</SelectItem>
                          <SelectItem value="L">L (5)</SelectItem>
                          <SelectItem value="XL">XL (8)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        T-shirt sizing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Submit Request
            </Button>
          </form>
        </Form>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Score Preview</CardTitle>
            <CardDescription>Live calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-lg dark:bg-slate-800">
              <span className="text-4xl font-bold text-primary">
                {currentPriority}
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                Calculated Priority
              </span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground space-y-2">
              <p>Formula: (Impact * Urgency) / Effort</p>
              <ul className="list-disc list-inside">
                <li>Impact: {impact}</li>
                <li>Urgency: {urgency}</li>
                <li>Effort: {effort} ({
                    effort === 'S' ? 1 :
                    effort === 'M' ? 3 :
                    effort === 'L' ? 5 :
                    effort === 'XL' ? 8 : 0
                  })
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
