import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { TagInput, type Tag } from "emblor";
import type { UseFormReturn } from "react-hook-form";
import type { FrontendJobApplicationData } from "#/schema/features/job-applications/job-application-schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function JobApplicationStep3FormElement(
  form: UseFormReturn<FrontendJobApplicationData>
) {
  const [tags, setTags] = useState<Tag[]>(form.getValues("tag"));
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [rounds, setRounds] = useState<Tag[]>(form.getValues("rounds"));
  const [activeRounds, setActiveActiveRoundsIndex] = useState<number | null>(
    null
  );

  return (
    <>
      <FormField
        control={form.control}
        name="tag"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <div className="*:not-first:mt-2">
                  <TagInput
                    {...field}
                    id={field.name}
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
                    maxTags={10}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                  />
                </div>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  placeholder="Add rounds for this job application"
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
                  maxTags={5}
                  activeTagIndex={activeRounds}
                  setActiveTagIndex={setActiveActiveRoundsIndex}
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
  );
}
