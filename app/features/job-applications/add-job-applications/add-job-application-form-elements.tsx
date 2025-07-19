import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { addJobApplicationFormArray } from "@/types/features/job-application/add-job-application-types";
import { TagInput, type Tag } from "emblor";
import { useState } from "react";
import { useFormContext, type UseFormReturn } from "react-hook-form";
import type { FrontendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function addJobApplicationFormElementsHook(
  form: UseFormReturn<FrontendJobApplicationData>
) {
  const [tags, setTags] = useState<Tag[]>(form.getValues("tag"));
  const [rounds, setRounds] = useState<Tag[]>(form.getValues("rounds"));
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const formArray: Array<addJobApplicationFormArray> = [
    // STEP 1 FORM ELEMENTS
    {
      element: (
        <>
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Job Role Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="We are seeking a creative and detail-oriented..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Work From Home" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
      title: {
        text: "Job Information",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-2",
      fieldNameArray: ["company_name", "role", "job_description", "location"],
    },
    // STEP 2 FORM ELEMENTS
    {
      element: (
        <>
          <section className="grid grid-cols-2 gap-2 mt-3">
            <FormField
              control={form.control}
              name="min_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Salary</FormLabel>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <div className="relative">
                        <Input
                          className="peer ps-6"
                          placeholder="0.00"
                          type="number"
                          {...field}
                        />
                        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                          €
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Salary</FormLabel>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <div className="relative">
                        <Input
                          className="peer ps-6"
                          placeholder="0.00"
                          type="number"
                          {...field}
                        />
                        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                          €
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="job_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full-time, Contractual, Part-time etc.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="8am to 5pm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </>
      ),
      title: {
        text: "Job Compensation",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-4",
      fieldNameArray: ["min_salary", "max_salary", "job_type", "work_schedule"],
    },
    // STEP 3 FORM ELEMENTS
    {
      element: (
        <>
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      tags={tags}
                      setTags={(newTags) => {
                        setTags(newTags);
                        form.setValue("tag", newTags as [Tag, ...Tag[]]);
                      }}
                      placeholder="Add a tag for this job application"
                      styleClasses={{
                        inlineTagsContainer:
                          "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                        input: "w-full min-w-[80px] shadow-none px-2 h-7",
                        tag: {
                          body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                          closeButton:
                            "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                        },
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Application Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="bookmarked">Bookmarked</SelectItem>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="waiting for result">
                      Waiting for Result
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rounds"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Rounds</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      tags={rounds}
                      setTags={(newTags) => {
                        setRounds(newTags);
                        form.setValue("rounds", newTags as [Tag, ...Tag[]]);
                      }}
                      placeholder="Add a tag for this job application"
                      styleClasses={{
                        inlineTagsContainer:
                          "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                        input: "w-full min-w-[80px] shadow-none px-2 h-7",
                        tag: {
                          body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                          closeButton:
                            "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                        },
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="applied_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
      title: {
        text: "Extra Information",
        className: "font-bold text-xl",
      },
      contentClassName: "space-y-4",
      fieldNameArray: ["tag", "status", "rounds", "applied_at"],
    },
  ];

  return formArray;
}
