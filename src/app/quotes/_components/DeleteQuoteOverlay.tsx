"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";

import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { deleteQuote } from "~/server/queries/QuoteQueries";
import type { QuoteDBType } from "~/server/db/schema";
import { toast } from "sonner";

export function DeleteQuoteOverlay({ quote }: { quote: QuoteDBType }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function onDelete() {
    const res = await deleteQuote(quote);
    if (!res?.message) {
      router.push("/quotes");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sure you want to delete quote?</DialogTitle>
          <DialogDescription>This action can not be undone</DialogDescription>
          {/* <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription> */}
        </DialogHeader>
        <DialogFooter>
          <div className="mt-4 flex flex-col gap-3">
            <Button onClick={onDelete} variant="destructive">
              Yes delete
            </Button>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
