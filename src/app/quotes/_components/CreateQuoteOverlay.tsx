"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createQuote } from "~/server/queries/QuoteQueries";
import { toast } from "sonner";

function SubmitButton() {
  // const { pending } = useFormStatus();
  // if (pending) return <div>yoyoyo</div>;
  return <Button type="submit">Submit</Button>;
}

const formSchema = z.object({
  quote: z.string().min(1, "Required").max(1024),
  personQuoted: z.string().max(64),
  contextOfQuote: z.string().max(254),
});

export function CreateQuoteOverlay() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quote: "",
      personQuoted: "",
      contextOfQuote: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await createQuote(values);
    if (!res?.message) {
      // reruns on the server and refreshes just the necessary parts.
      router.refresh();
      setOpen(false);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create quote</DialogTitle>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="quote"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personQuoted"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who said the quote?</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contextOfQuote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context of the quote</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Eg., Matson when she explained why she hates men
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
